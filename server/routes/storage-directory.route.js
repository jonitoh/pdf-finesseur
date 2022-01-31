const express = require('express');
const middleware = require("../middlewares/storage-directory.middleware");
const controller = require("../controllers/storage-directory.controller");

const getRouter = () => {
    // Initiate router
    const router = express.Router();

    // TO serve any file back to the client
    const storagePath = process.env.STORAGEPATH || './public/uploads/';
    router.use(express.static(storagePath));

    // Add middlewares
    router.use(middleware.errorMiddleware);

    // POST ROUTE
    const upload = middleware.getHandlerMiddleware(storagePath)
    router.post('/', upload, controller.uploadFiles);

    // DELETE ROUTE -- any files
    router.delete('/:path', controller.deleteFile);

    // DELETE ROUTE -- all files
    router.delete('/', controller.deleteAll);

    return router
}

module.exports = { getRouter }