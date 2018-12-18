require('console-error');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');
var router = express.Router();
var app = express();
var port = 3000;
var api = require('./api/api');

mongoose.connect('mongodb+srv://admin:HYfOORa0cj20bsat@vacayiou-x4osx.mongodb.net/test?retryWrites=true', { useNewUrlParser: true })
	.then(() => {
		console.log('Database connection successful');
	})
	.catch(err => {
		console.error('Database connection error:\n' + err);
	});

//Log all requests
app.use(morgan('dev'));

//View Engine
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public'), {index: false}));

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Cookie Parser Middleware
app.use(cookieParser());

//Routes
app.get('/', function(req, res, next){
	res.send('Landing page');
});

app.get('/app/*', function(req, res, next){
	res.sendFile(path.join(__dirname,'public/index.html'));
});

app.use('/api', api);

//Error handling
app.use(function(err, req, res, next){
	console.error('Server error ' + err.stack);
	res.status(500).send('Server error:' + err);
})

app.listen(port, function(){
	console.log('Server listening on port ' + port);
});