const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require("path");

// initiate the app
const app = express();

// default port
const port = process.env.SERVER_PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// cross-origin resource sharing
const checkOrigin = (whitelist = [`http://localhost:${port}`]) => (
  (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1 || whitelist.indexOf('*') !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  }
)
const corsOptions = {
  origin: '*',//checkOrigin(),
  credentials: true,
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions));


app.use('/public', express.static('public'));



// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

// avoid cors stuff
/*
app.use(express.static(path.join(__dirname, '..', 'build')));
*/
// routes for file management ( upload, download and delete )
const storageRouter = require(`./storage/by-${process.env.SERVER_STORAGE || "directory"}.js`);
app.use('/storage', storageRouter);


/*
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});
*/


// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`));



