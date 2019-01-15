const express = require('express')
const auth = require('./auth')

module.exports = server => {
    const controlVagas = require('../api/vagas/controleVagas');
    //Aréas Fechadas
    const protectedApi = express.Router();
    protectedApi.use(auth);
    protectedApi.post('/newVaga', controlVagas.newVaga)
    server.use('/api', protectedApi);
    
    //Aréas Abertas
    const openApi = express.Router();
    
    //Ares Livres sem Verificação
    const AuthService = require('../api/auth/authService');
    openApi.get('/users',AuthService.getUsers)
    openApi.post('/login', AuthService.login);
    openApi.post('/signup', AuthService.signup);
    openApi.post('/validateToken', AuthService.validateToken);
    
    const Vagas = require('../api/vagas/vagas');
    openApi.post('/vaga', Vagas.getVaga);
    openApi.get('/vagas', Vagas.getVagas);
    openApi.get('/vaga/:id', Vagas.getVagasbyId);
    
    server.use('/oapi', openApi);
}