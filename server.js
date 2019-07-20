const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const PORT = 3000;

//Saving data as array
const users = [];

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

//Make a route for home
app.get('/', (req, res) => {
  res.render('index.ejs');
});

//make a route for login
app.get('/login', (req, res) => {
  res.render('login.ejs');
});

//receiving data from login
app.post('/login', (req, res) => {

});

//make a route for register
app.get('/register', (req, res) => {
  res.render('register.ejs');
});

//receiving data from register
app.post('/register', async (req, res) => {
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

app.listen(PORT);
