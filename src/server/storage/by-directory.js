// use of multer
// cf. https://github.com/expressjs/multer#diskstorage
const fs = require("fs");
const Path = require("path");
const multer = require('multer');
const express = require('express');
const storagePath = './public/uploads/';

// multer configuration
const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, storagePath)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
    onFileUploadStart: file => {
        console.log(file.originalname + ' is starting ...');
    },
    onFileUploadComplete: file => {
        console.log(file.fieldname + ' uploaded to  ' + file.path);
    }
})
const availableMimetypes = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'];//TODO constants
const fileFilter = (req, file, cb) => {
    if (availableMimetypes.indexOf(file.mimetype) !== -1) {
        cb(null, true)
    } else {
        cb(null, false)
        return cb(new Error("INVALID_TYPE"))
    }
}
// our handler tied to our storage
const uploadAll = multer({
    storage: fileStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024,
    }
}).array('files');

// main router
const router = express.Router();

// TO serve any file back to the client
router.use(express.static(storagePath));

//Express Error Handling
const availableErrors = [
    "FILE_MISSING",
    "INVALID_TYPE",
    "FORBIDDEN_DOWNLOAD",
];
router.use(function (err, req, res, next) {
    // Check if the error is thrown from multer
    if (err instanceof multer.MulterError) {
        res.statusCode = 400
        res.send({ code: err.code })
    } else if (err) {
        // If it is not multer error then check if it is our custom error for FILE_MISSING
        if (availableErrors.indexOf(err.message) !== -1) {
            res.statusCode = 400
            res.send({ code: err.message })
        } else {
            //For any other errors set code as GENERIC_ERROR
            res.statusCode = 500
            res.send({ code: "GENERIC_ERROR" })
        }
    }
})

// POST ROUTE
router.post("/", uploadAll, (req, res, next) => {
    if (!req.files) {
        //If the file is not uploaded, then throw custom error with message: FILE_MISSING
        throw Error("FILE_MISSING")
    } else {
        //If the file is uploaded, then send a success response.
        res.send({
            message: "File Uploaded",
            code: 200,
            output: req.files.map(file => ({ filename: file.originalname, path: file.path }))
        });
    }
})

// GET ROUTE -- only for PDF files
router.get('/:path/:name', (req, res) => {
    const { path, name } = req.params;
    res.download("http://localhost:5000/public/uploads/__8497_name_key_0.pdf", name);

    console.log("path", path);
    const _path = "public/uploads/__8497_name_key_0.pdf";
    const _path_photo = "public/uploads/test_photo.png";
    if (!path.endsWith('.pdf')) {
        // it should only download PDF files
        throw Error("FORBIDDEN_DOWNLOAD")
    } else {
        res.download("http://localhost:5000/public/uploads/__8497_name_key_0.pdf", name);
    }
});

// DELETE ROUTE -- any files
router.delete('/:path', (req, res) => {
    const { path } = req.params;
    fs.stat(path, function (err, stats) {
        // check in the last updated
        console.log(`File at path ${path} created at: ${stats.birthtime}`);
        if (err) {
            res.status(500).send(err.message || "UNFOUND_FILE");
        } else {
            fs.unlink(path, function (err) {
                if (err) {
                    res.status(500).send(err.message || "CANT_DELETE");
                } else {
                    res.sendStatus(200)
                }
            });
        }
    });
});

// exports
module.exports = router;