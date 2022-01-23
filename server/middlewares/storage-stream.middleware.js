// use of multer
// cf. https://github.com/expressjs/multer#memorystorage
const multer = require('multer');

// multer configuration
const storage = multer.memoryStorage();

// our handler tied to our storage
const upload = multer({ storage: storage });

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
    upload,
    errorMiddleware,
}