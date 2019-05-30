const path = require('path');
const fs = require('fs');

const express = require('express');


const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
// const multer = require('multer');


const errorController = require('./controllers/error');
const User = require('./models/user');

//
const MONGODB_URI =
// 'mongodb://localhost/new-app';
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@fastfood-ltklf.mongodb.net/${process.env.MONGO_DATABASE}`;

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

const csrfProtection =csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'), 
{flags: 'a'});

app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream}));

app.use(bodyParser.urlencoded({ extended: false }));
// app.use(multer().single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use(csrfProtection);
app.use(flash());


app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      throw new Error(err);
    });
}); 

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  res.locals.successMsg = req.flash('successMsg');
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  res.redirect('/500');
});

mongoose
  .connect(MONGODB_URI, {useNewUrlParser: true})
  .then(result => {
    app.listen(process.env.PORT || 3000);
    console.log('server started on port 3000');
  })
  .catch(err => {
    console.log(err);
  });
  