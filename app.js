var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var items = require('./routes/itemsRoute');
var suppliersRoute = require('./routes/suppliersRoute');
var methodOverride = require('method-override');
var app = express();
var errors = require('errors');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/items', items);
app.use('/supplier', suppliersRoute);
//app.use(express.errorHandler());

// app.use(methodOverride());
// app.use(logErrors);
// app.use(clientErrorHandler);
// app.use(errorHandler);

// function logErrors(err, req, res, next) {
// 	console.error(err.stack);
// 	next(err);
// }

// function clientErrorHandler(err, req, res, next) {
// 	if (req.xhr) {
// 		res.status(500).send({
// 			error: 'Something failed!'
// 		});
// 	} else {
// 		next(err);
// 	}
// }

// function errorHandler(err, req, res, next) {
// 	res.status(500);
// 	res.render('error', {
// 		error: err
// 	});
// }
// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
// no stacktraces leaked to user unless in development environment
// app.use(function(err, req, res, next) {
// 	res.status(err.status || 500);
// 	res.render('error', {
// 		message: err.message,
// 		error: (app.get('env') === 'development') ? err : {}
// 	});
// });

module.exports = app;