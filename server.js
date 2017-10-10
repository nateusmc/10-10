'use strict';

const express = require('express');
const queryString = require('query-string');
const app = express();

const USERS = [
  {id: 1,
    firstName: 'Joe',
    lastName: 'Schmoe',
    userName: 'joeschmoe@business.com',
    position: 'Sr. Engineer',
    isAdmin: true,
    // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
    password: 'password'
  },
  {id: 2,
    firstName: 'Sally',
    lastName: 'Student',
    userName: 'sallystudent@business.com',
    position: 'Jr. Engineer',
    isAdmin: true,
    // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
    password: 'password'
  },
  // ...other users
];

function gateKeeper(req, res, next) {
  // req.get('x-username-and-password');
  // res.send(req.get('user-pass''));
  const {user, pass} = Object.assign({user: null, pass: null}, queryString.parse(req.get('user-pass')));

  // your code should replace the line below
  req.user = USERS.find((usr, index) => usr.userName === user && usr.password === pass);
  next();
}
app.use(gateKeeper);
// app.get((req, res, next) => {
//   res.send(req.header);
// });

app.get('/api/users/me', (req, res) => {
  if (req.user === undefined) {
    return res.status(401).json({message: 'Must supply valid user credentials'});
  }
  const {firstName, lastName, id, userName, position} = req.user;
  return res.json({firstName, lastName, id, userName, position});
});

// ... start the app
app.listen(8080);