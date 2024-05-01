const logger = require('../../logger/logger')
const pool = require('./DbConfig')

async function dbConfig() {
    await createDatabaseIfNotExists()
    await createTableIfNotExists()
}
async function createDatabaseIfNotExists() {
    try {
        await pool.query(`CREATE DATABASE IF NOT EXISTS todo_items`)
        logger.info(`Database todo_items created or already exists.`)
    } catch (error) {
        logger.error('Error creating database:', error)
        return false
    }
}

async function createTableIfNotExists() {
    try {
        await pool.query('USE todo_items')
        await pool.query(
            `CREATE TABLE IF NOT EXISTS items (id varchar(36), name varchar(255), completed boolean) DEFAULT CHARSET utf8mb4`
        )
        logger.info(`Table items created or already exists`)
    } catch (error) {
        logger.error(`Could not fetch the request. ${error}`)
        return false
    }
}

async function getItems() {
    try {
        const [rows] = await pool.query('SELECT * FROM items')
        logger.debug(`Items retrieved`)
        return rows.map(item => ({
            ...item,
            completed: item.completed === 1
        }))
    } catch (error) {
        logger.error(`Could not fetch the request. ${error}`)
    }
}

async function getItem(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM items WHERE id=?', [id])
        logger.debug("Items retrieved")
        return rows.map(item => ({
            ...item,
            completed: item.completed === 1
        }))[0]
    } catch (error) {
        logger.error(`Could not fetch the request. ${error}`)
    }
}

async function storeItem(item) {
    try {
        await pool.query(
            'INSERT INTO items (id, name, completed) VALUES (?, ?, ?)',
            [item.id, item.name, item.completed ? 1 : 0]
        )
        logger.debug(`Item [${item.id}] created`)
    } catch (error) {
        logger.error(`Could not fetch the request. ${error}`)
    }
}
async function updateItem(id, item) {
    try {
        await pool.query(
            'UPDATE items SET name=?, completed=? WHERE id=?',
            [item.name, item.completed ? 1 : 0, id]
        )
        logger.debug(`Item marked as [${item.completed}]`)
    } catch (error) {
        logger.error(`Could not fetch the request. ${error}`)
    }
}


async function removeItem(id) {
    try {
        await pool.query('DELETE FROM items WHERE id = ?', [id])
        logger.debug(`Item [${id}] removed`)
    } catch (error) {
        logger.error(`Could not fetch the request. ${error}`)
    }
}

module.exports = {
    dbConfig,
    getItems,
    getItem,
    storeItem,
    updateItem,
    removeItem,
}
