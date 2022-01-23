const express = require('express');
const controller = require("../controllers/storage-database.controller");

const getRouter = () => {
    // Initiate router
    const router = express.Router();

    // POST ROUTE
    router.post('/', controller.uploadFiles);

    // DELETE ROUTE -- any files
    router.delete('/:path', controller.deleteFile);

    // DELETE ROUTE -- all files
    router.delete('/', controller.deleteAll);

    return router
}

module.exports = { getRouter }