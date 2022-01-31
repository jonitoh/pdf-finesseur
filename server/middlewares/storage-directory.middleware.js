// use of multer
// cf. https://github.com/expressjs/multer#diskstorage
const multer = require('multer');

const availableMimetypes = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'];
const fileFilter = (req, file, cb) => {
    if (availableMimetypes.indexOf(file.mimetype) !== -1) {
        cb(null, true)
    } else {
        cb(null, false)
        return cb(new Error("INVALID_TYPE"))
    }
}

// our handler tied to our storage
const getHandlerMiddleware = (storagePath) => {
    console.log("chosen storagePath", storagePath);

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

    // handler
    const upload = multer({
        storage: fileStorage,
        fileFilter: fileFilter,
        limits: {
            fileSize: 5 * 1024 * 1024,
        }
    }).array('files');

    return upload
}

//Express Error Handling
const availableErrors = [
    "FILE_MISSING",
    "INVALID_TYPE",
    "FORBIDDEN_DOWNLOAD",
];

const errorMiddleware = (err, req, res, next) => {
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
};

module.exports = {
    getHandlerMiddleware,
    errorMiddleware,
}