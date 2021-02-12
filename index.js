///ENVIRONMENT///
require('dotenv').config();

///IMPORTS///
const express= require('express');
const axios = require('axios');
const ejsLayouts = require ('express-ejs-layouts');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const passport = require('./config/ppConfig');
const session = require('express-session');


///APP SET-UP///
const app = express();
app.set('view engine', 'ejs');

///SESSIONS///
const SECRET_SESSION = process.env.SECRET_SESSION;
const isLoggedIn = require('./middleware/isLoggedIn');

///MIDDLEWARE///
app.use(require('morgan')('dev'));
app.use(ejsLayouts);
app.use(express.urlencoded( { edxtended: false }) );
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));

///SESSION///
const sessionObject = {
    secret: SECRET_SESSION,
    resave: false,
    saveUninitialized: true
  }
  app.use(session(sessionObject));
  // Passport
  app.use(passport.initialize()); // Initialize passport
  app.use(passport.session()); // Add a session
  // Flash 
  app.use(flash());
  app.use((req, res, next) => {
    console.log(res.locals);
    res.locals.alerts = req.flash();
    res.locals.currentUser = req.user;
    next();
  });


///CONTROLLERS///
app.use('/auth', require('./controllers/auth'));

app.get('/', (req, res)=> {
    res.render('index')
});

app.get('/profile', isLoggedIn, (req, res) => {
    const { id, name, email } = req.user.get(); 
    res.render('profile', { id, name, email });
  });


///SERVER PORT///
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${PORT} 🎧`);
});


module.exports = server;