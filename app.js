var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const flash = require('connect-flash')
const Config = require('config')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const passport = require('passport')
const io = require('socket.io')()
const passportSocketIo = require('passport.socketio')

const DB = require('./core/my_db/DB')

const dbOptions = {
  connectionLimit: Config.DB.connectionLimit,
  host: Config.DB.host,
  user: Config.DB.user,
  password: Config.DB.password,
  database: Config.DB.database
}

DB.setOptions(dbOptions)

const sessionStore = new MySQLStore(dbOptions)

const sessionMiddleware = session({
  key: Config.SESSION.key,
  secret: Config.SESSION.secret,
  store: sessionStore,
  resave: true,
  saveUninitialized: true
})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(flash())
app.use(sessionMiddleware)
app.use(passport.initialize())
app.use(passport.session())

io.use(passportSocketIo.authorize({
  key: Config.SESSION.key,
  secret: Config.SESSION.secret,
  store: sessionStore,
  passport,
  success: (data, accept) => accept(),
  fail: (data, message, error, accept) => accept(new Error('auth_fail'))
}))

io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next)
})

app.use('/', require('./routes/index'))
app.use('/chat', require('./routes/chat'))
app.use('/logout', require('./routes/logout'))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const server = require('http').Server(app)
io.attach(server)

require('./socket/socket').init(io)
require('./app/passport')(passport)

module.exports = { app, server, io };
