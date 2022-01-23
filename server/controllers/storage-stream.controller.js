const uploadFiles = async (req, res) => {
    console.log('Entry point for uploading files');
    if (err) {
        res.sendStatus(500);
    }
    res.sendStatus(200);
};

const deleteFile = async (req, res) => {
    console.log('Entry point for deleting a file');
    if (err) {
        res.sendStatus(500);
    }
    res.sendStatus(200);
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