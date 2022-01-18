const express = require('express');
const cors = require('cors');

// initiate the app
const app = express();

// cross-origin resource sharing
app.use(cors());

// default port
const port = process.env.SERVER_PORT || 5000;

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

// routes for file management ( upload, download and delete )
const storageRouter = require(`./storage/by-${process.env.SERVER_STORAGE || "directory"}.js`);
app.use('/storage', storageRouter);