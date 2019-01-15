const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('../../.env')
const db = require('../../config/db')

const User = db.Mongoose.model('users', db.UserSchema, 'users');

const emailRegex = /\S+@\S+\.\S+/ //string antes do @ , string antes do . 
const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/

const getUsers = (req,res) =>{
  User.find({}, (err,data) =>{
    if(err) res.send(err)
    else res.send(data)
  })
}

//Login
const login = (req, res) => {
  const email = req.body.email || '';
  const password = req.body.password || '';
  User.findOne({ email }, (err, user) => {
    if (err) res.json({ msg: err })
    else if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ ...user }, env.authSecret, {
        expiresIn: "1 day"
      })
      const { nome, email, _id} = user
      res.status(200).json({ nome, email, _id, token })
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
  
  const nome = req.body.nome || ''
  const email = req.body.email || ''
  // const typeUser = req.body.typeUser || ''
  const password = req.body.password || ''
  const confirmPassword = req.body.confirmPassword || ''

  if (!email.match(emailRegex)) {
    return res.status(400).send({ errors: ['O e-mail informado está inválido'] })
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
      res.status(400).json({error:err, msg:123}).end()
    } else if (user) {
      return res.status(400).send({ errors: ['Usuário já cadastrado.'] })
    } else {
      const newUser = new User({ nome, email, password: passwordHash })//typeUser
      newUser.save(err => {
        if (err) {
          res.json({ err: err, msg:':(' }).status(400).end()
        } else {
          login(req, res, next)
        }
      })
    }
  })
}


module.exports = { login, signup,getUsers, validateToken };
