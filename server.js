const express = require('express');
const app = express();
const PORT = 3000;

app.set('view-engine', 'ejs');

//Make a route for home
app.get('/', (req, res) => {
  res.render('index.ejs');
});

//make a route for login
app.get('/login', (req, res) => {
  res.render('login.ejs');
});

//make a route for register
app.get('/register', (req, res) => {
  res.render('register.ejs');
});

app.listen(PORT);
