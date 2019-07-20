if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const PORT = 3000;

const initializePassport = require('./passport-config');
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
);

//Saving data as array
const users = [];

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

//Make a route for home
app.get('/', (req, res) => {
  res.render('index.ejs', { name: req.user.name });
});

//make a route for login
app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs');
});

//receiving data from login
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

//make a route for register
app.get('/register',checkNotAuthenticated, (req, res) => {
  res.render('register.ejs');
});

//receiving data from register
app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10); //make password hashed 10 times
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });
    res.redirect('/login');
  } catch {
    //if the register fail, redirect back to register page
    res.redirect('/register');
  }
});

app.delete('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
})

function checkAuthentication(req, res, next){
    if(req.authenticated()){
      return next()
    }

    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return res.redirect('/');
  }
  next();
}

app.listen(PORT);
