const fs = require("fs");

const uploadFiles = async (req, res) => {
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
};

const deleteFile = async (req, res) => {
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
};

const deleteAll = async (req, res) => {
    console.log('Entry point for deleting all the files');
    if (err) {
        res.sendStatus(500);
    }
    res.sendStatus(200);
};

module.exports = {
    uploadFiles,
    deleteFile,
    deleteAll
}