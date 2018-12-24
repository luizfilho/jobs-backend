const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('../../.env')
const db = require('../../config/db')

const User = db.Mongoose.model('users', db.UserSchema, 'users');

const emailRegex = /\S+@\S+\.\S+/ //string antes do @ , string antes do . 
const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/

//Login
const login = (req, res) => {
  const email = req.body || '';
  const password = req.body || '';

  User.findOne({ email }, (err, user) => {
    if (err) res.json({ msg: err })
    else if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ ...user }, env.AuthSecret, {
        expiresIn: "1 day"
      })
      const { nome, email } = user
      res.json({ nome, email, typeUser, token })
    } else {
      return res.status(400).send({ errors: ['Usuário/Senha inválidos'] })
    }
  })
}

const validateToken = (req, res, next) => {
  const token = req.body.token || ''
  jwt.verify(token, env.authSecret, function (err, decoded) {
    return res.status(200).send({ valid: !err })
  })
}

const signup = (req, res, next) => {
  const name = req.body.name || ''
  const email = req.body.email || ''
  const typeUser = req.body.typeUser || ''
  const password = req.body.password || ''
  const confirmPassword = req.body.confirmPassword || ''

  if (!email.match(emailRegex)) {
    return res.status(400).send({ errors: ['O e-mail informa está inválido'] })
  }
  if (!password.match(passwordRegex)) {
    return res.status(400).send({
      errors: [
        "Senha precisar ter: uma letra maiúscula, uma letra minúscula, um número, uma caractere especial(@#$ %) e tamanho entre 6 - 20."
      ]
    })
  }
  const salt = bcrypt.genSaltSync()
  const passwordHash = bcrypt.hashSync(password, salt)
  if (!bcrypt.compareSync(confirmPassword, passwordHash)) {
    return res.status(400).send({ errors: ['Senhas não conferem.'] })
  }
  User.findOne({ email }, (err, user) => {
    if (err) {
      res.status(400).end()
    } else if (user) {
      return res.status(400).send({ errors: ['Usuário já cadastrado.'] })
    } else {
      const newUser = new User({ name, email, typeUser, password: passwordHash })
      newUser.save(err => {
        if (err) {
          res.status(400).end()
        } else {
          login(req, res, next)
        }
      })
    }
  })
}


module.exports = { login, signup, validateToken };
