const { v4: uuid } = require('uuid')
const logger = require('../../logger/logger')
const { createTableIfNotExists } = require('../persistence/dbConfig')
const dbOpts = require('../persistence/dbOpts')
const mysql = require('mysql2/promise')
let pool = mysql.createPool(dbOpts)

getItems = async (req, res) => {
    try {
        const [items] = await pool.query('SELECT * FROM items')
        logger.debug(`Items retrieved`)
        res.send(items)
        pool.releaseConnection()
    } catch (error) {
        logger.error(`Error fetching items: `, error)
        if (error.errno == 1146) {
            logger.debug("Trying to create table")
            await createTableIfNotExists()
            const [items] = await pool.query('SELECT * FROM items')
            logger.debug(`Items retrieved`)
            res.send(items)
        }
        pool.releaseConnection()
        res.status(500).send('Error fetching items')
    }
}

addItem = async (req, res) => {
    const item = {
        id: uuid(),
        name: req.body.name,
        completed: false,
    }
    try {
        await pool.query('INSERT INTO items SET ?', item)
        logger.debug(`Item [${item.id}] created`)
        pool.releaseConnection()
        res.send(item)
    } catch (error) {
        logger.error(`Error storing item: ${error.message}`)
        pool.releaseConnection()
        res.status(500).send('Error storing item')
    }
}

updateItem = async (req, res) => {
  try {
      await pool.query('UPDATE items SET ? WHERE id = ?', [
          { name: req.body.name, completed: req.body.completed },
          req.params.id,
      ]);
      const [items] = await pool.query('SELECT * FROM items WHERE id = ?', [req.params.id]);
      logger.debug(`Item ${req.params.id} marked as [${req.body.completed}]`)
        pool.releaseConnection()
        res.send(items[0]);
  } catch (error) {
      logger.error(`Error updating item: ${error.message}`);
        pool.releaseConnection()
        res.status(500).send('Error updating item');
  }
};

deleteItem = async (req, res) => {
  const id = req.params.id
  try {
      await pool.query('DELETE FROM items WHERE id = ?', [req.params.id]);
      logger.debug(`Item [${id}] removed`)
        pool.releaseConnection()
        res.sendStatus(200);
  } catch (error) {
      logger.error(`Error deleting item: ${error.message}`);
        pool.releaseConnection()
        res.status(500).send('Error deleting item');
  }
};

module.exports = {
    getItems,
    addItem,
    updateItem,
    deleteItem
}
