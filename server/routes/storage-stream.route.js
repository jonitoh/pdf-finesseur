const express = require('express');
const middleware = require("../middlewares/storage-stream.middleware");
const controller = require("../controllers/storage-stream.controller");

const getRouter = () => {
    // Initiate router
    const router = express.Router();

    // Add middlewares
    router.use(middleware.errorMiddleware);

    // POST ROUTE
    const upload = middleware.getHandlerMiddleware()
    router.post('/', upload, controller.uploadFiles);

    // DELETE ROUTE -- any files
    router.delete('/:path', controller.deleteFile);

    // DELETE ROUTE -- all files
    router.delete('/', controller.deleteAll);

    return router
}

module.exports = { getRouter }