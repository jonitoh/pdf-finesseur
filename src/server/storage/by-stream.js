// use of multer
// cf. https://github.com/expressjs/multer#memorystorage
const multer = require('multer');
const express = require('express');
// multer configuration
const storage = multer.memoryStorage();

// our handler tied to our storage
const uploadOne = multer({ storage: storage });

// main router
const router = express.Router();

// POST ROUTE
router.post('/', (req, res) => {
    uploadOne(req, res, (err) => {
        if (err) {
            res.sendStatus(500);
        }
        res.send(req.file);
    });
});

// GET ROUTE -- only for PDF files
router.get('/', (req, res) => {
    //
});

// DELETE ROUTE -- any files
router.delete('/', (req, res) => {

});

// exports
module.exports = router;