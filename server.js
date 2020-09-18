require('console-error');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');
var cors = require('cors');
var app = express();
var api = require('./api/api');

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

var port = process.env.PORT || 3000;

// Database connection
mongoose
  .connect(
    process.env.MONGO_CONNECTION_STRING,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('Database connection successful');
  })
  .catch(err => {
    console.error('Database connection error:\n' + err);
  });

// Log all requests
app.use(morgan('dev'));

// View Engine
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Cookie Parser Middleware
app.use(cookieParser());

// Config Cross Origin Requests
app.use(cors());

// Routes
app.use('/', api);

// Error handling
app.use(function(err, req, res, next) {
  console.error('Server error ' + err.stack);
  res.status(500).send('Server error:' + err);
});

//Serve
app.listen(port, function() {
  console.log('Server listening on port ' + port);
});
