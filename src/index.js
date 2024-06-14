const express = require('express');
const logger = require('../logger/logger');
const routes = require('./routes/routes')
const app = express();

app.use(express.json());
app.use(express.static(__dirname + '/static'));

app.get('/items', (req, res) => routes.getItems(req, res));
app.post('/items', (req, res) => routes.addItem(req, res));
app.put('/items/:id', (req, res) => routes.updateItem(req, res));
app.delete('/items/:id', (req, res) => routes.deleteItem(req, res));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => logger.info(`Server listening on port ${PORT}`));