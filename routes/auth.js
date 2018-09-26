const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

const db = require('../config/db');

const gerarToken = data => jwt.sign(data, secret, { expiresIn: '1m' })
const abrirToken = token => jwt.decode(token, secret)
const secret = 'secretoabvagas201820182018'

const verifyToken = (req, res, next) => {
  const authorization = req.headers.authorization || '';
  const token = authorization.split(' ')[0];

  if (!token) res.status(400).json({sucess:false,msg:'Token Inválido'})

  const tokenData = abrirToken(token)

  if (!tokenData) res.json({sucess:false,msg:'Token Inválido'});

  res.json({sucess:true,msg:'Token Válido', user:tokenData})
  // req.user = tokenData;
  next();
}

const User = db.Mongoose.model('users', db.UserSchema, 'users');

router.post('/login', (req, res) => {
  const { numInc, password } = req.body;
  const handler = (err, result) => {
    if (result != null) {
      if (bcrypt.compareSync(password, result.password)) {

        let user = {
          id: result._id,
          nome: result.nome
        }

        const token = gerarToken(user, secret)
        res.status(200).json({
          sucess: true,
          token
        })
      } else {
        res.json({
          sucess: false,
          msg: 'Senha Inválida'
        })
      }
    } else {
      res.json({
        sucess: false,
        msg: 'Nº de Incrição Inválido'
      })
    }
  }

  User.findOne({ numInc }, handler);
}
)

router.get('/me', verifyToken ,async(req,res) =>{
  return res.json(req.user)
})

router.get('/')

module.exports = router