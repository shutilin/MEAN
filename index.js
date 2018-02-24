const express = require('express'); 
const app = express(); 
const router = express.Router();
const mongoose = require('mongoose'); 
const config = require('./config/database'); 
const path = require('path'); // NodeJS Package for file paths
const authentication = require('./routes/authentication')(router);
const fanfics = require('./routes/fanfics')(router);
const bodyParser = require('body-parser');
const cors = require('cors');
// Database Connection
mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
  if (err) {
    console.log('Could NOT connect to database: ', err);
  } else {
    console.log('Connected to database: ' + config.db);
  }
});

app.use(cors({
	origin: 'http://localhost:4200'
}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.static(__dirname + '/client/dist/'));
app.use('/authentication', authentication);
app.use('/fanfics', fanfics);

// Connect server to Angular 2 Index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

// Start Server: Listen on port 8080
app.listen(8080, () => {
  console.log('Listening on port 8080');
});