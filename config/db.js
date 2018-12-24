const mongoose = require('mongoose')
const env = require('../.env')

mongoose.connect(env.URL, { useNewUrlParser: true })

const userSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    typeUser: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
},
    { collection: 'users' })

const vagaSchema = new mongoose.Schema({
    nomeCont: { type: String, required: true },
    areaAt: { type: String, required: true },
    tipoVaga: { type: String, required: true },
    estado: { type: String, required: true },
    cidade: { type: String, required: true },
    remu: { type: String, required: true },
    viagem: { type: String, required: true },
    numCont: { type: String, required: true },
    emailCont: { type: String, required: true },
},
    { collection: 'vagas' })

module.exports = { Mongoose: mongoose, UserSchema: userSchema, VagaSchema: vagaSchema }