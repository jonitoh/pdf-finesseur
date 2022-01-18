// use of multer
// cf. https://github.com/expressjs/multer#diskstorage
const fs = require("fs");
const multer = require('multer');
const express = require('express');
const storagePath = 'public/uploads';
// multer configuration
const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, storagePath)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)// to change into (id + extension)
    }
})
const availableMimetypes = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'];
const fileFilter = (req, file, cb) => {
    if (availableMimetypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}
// our handler tied to our storage
const uploadOne = multer({ storage: fileStorage, fileFilter: fileFilter }).single('file')

// main router
const router = express.Router();

// TO serve any file back to the client
router.use(express.static(storagePath));

// POST ROUTE
router.post('/', (req, res) => {
    uploadOne(req, res, (err) => {
        if (err) {
            res.sendStatus(500);
        }
        res.status(200).send(req.file);
    });
});

// GET ROUTE -- only for PDF files
router.get('/:path/:name', (req, res) => {
    const { path, name } = req.params;
    // Check if it's a pdf
    if (path.endsWith('.pdf')) {
        res.download(path, name);
    } else {
        res.status(500).send(err.message || 'Incomplete Download');
    }
});

// DELETE ROUTE -- any files
router.delete('/:path', (req, res) => {
    const { path } = req.params;
    fs.stat(path, function (err, stats) {
        // check in the last updated
        console.log(`File at path ${path} created at: ${stats.birthtime}`);
        if (err) {
            res.status(500).send(err.message || 'Unfound file during the deletion process');
        } else {
            fs.unlink(path, function (err) {
                if (err) {
                    res.status(500).send(err.message || 'Unsuccessful deletion');
                } else {
                    res.sendStatus(200)
                }
            });
        }
    });
});

// exports
module.exports = router;