const express = require('express');
const router = express.Router();
const db = require('../../config/db')

const Vagas = db.Mongoose.model('vagas', db.VagaSchema, 'vagas');

const newVaga = ('/newVaga', (req, res) => {

    const { nomeCont, areaAt, estado,
        cidade, remu, viagem, numCont,
        emailCont,  tipoVaga, idUser } = req.body;

    const newVaga = new Vagas({
        nomeCont, areaAt, tipoVaga,
        estado, cidade, remu, viagem,
        numCont, emailCont,idUser 
    })

    newVaga.save(err => {
        if (err) res.json({ msg: 'Falha ao cadastrar, tente novamente.'}).status(400).end() 
        else res.json({msg:'Vaga Cadastrada com Sucesso!'}).status(200).end();
    })
})

router.delete('/deletevaga/:id', (req, res) => {
    Vagas.deleteOne({ _id: req.params.id }, (err) => {
        if (err) res.status(500).json({ "error": "Erro ao excluir a Vaga" }).end()
        else res.send('Vaga excluida com Sucesso').end();
    })
})

module.exports = { newVaga };