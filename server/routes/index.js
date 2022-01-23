const express = require('express');

const getRoutes = () => {
    // Initiate express router
    const router = express.Router();

    // Implement routes
    // --> routes for file management ( upload, download and delete )
    const { getRouter: getStorageRouter } = require(`./storage-${process.env.STORAGE || "directory"}.route.js`);
    router.use('/storage', getStorageRouter());

    return router;
}

module.exports = { getRoutes }



