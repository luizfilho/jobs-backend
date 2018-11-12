const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')


const db = require('../config/db');

const User = db.Mongoose.model('users', db.UserSchema, 'users');

//Cadastro de novo usuario
router.post('/newUser', (req, res) => {

  const { nome, cel, email, numInc, password } = req.body;

  const hash = bcrypt.hashSync(password, 13)

  const newUser = new User({
    nome,
    cel,
    email,
    numInc,
    password: hash

  })

  newUser.save(err => {
    if (err) {
      res.status(500).json({ sucess:false,error: err.message })
      res.end();
      return;
    }
    else{
      res.status(200).json({ sucess:true,msg: 'Usuario Cadastrado com Sucesso!' });
      res.end()
    }
   
  })

});





module.exports = router;
