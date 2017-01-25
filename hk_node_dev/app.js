var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var sendLogin = require('./routes/login');
var logout = require('./routes/logout');
var register = require('./routes/register');
var sendRegister = require('./routes/sendRegister');
var upHeadFile = require('./routes/upHeadFile');
var dish = require('./routes/dish');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// cookie解析器
app.use(cookieParser());
// session解析器
app.use(session({
  secret: 'hubwiz app',             //secret的值建议使用随机字符串
  cookie: {maxAge: 60 * 1000 * 30}, // 过期时间（毫秒）
  resave: true,                     // 每次响应结束时,重新保存session
  saveUninitialized: true           // 保存未初始化的session
}));


//app.use(function(req,res,next){
//  if (!req.session.user) {
//      // res.redirect('/login');
//      res.send(JSON.stringify({auth: false}));
//  }
//  else{
//      res.send(JSON.stringify({auth: true}));
//  }
//});

app.use('/', index);
app.use('/users', users);
app.use('/operate/login', sendLogin);
app.use('/operate/register', register);
app.use('/operate/userRegister', sendRegister);
app.use('/operate/upHeadFile', upHeadFile);
app.use('/operate', dish);
app.use('/operate/logout', logout);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
