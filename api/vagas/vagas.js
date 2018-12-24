const express = require('express');
const router = express.Router();
const db = require('../../config/db')

const Vagas = db.Mongoose.model('vagas', db.VagaSchema, 'vagas');

const getVagasbyId = (req, res) => {
    Vagas.find({ _id: req.params.id }).lean().exec((e, docs) => {
        res.json(docs).end()
    })
}

const getVagas = (req, res) => {
    Vagas.find().lean().exec((e, docs) => {
        res.json(docs).end()
    })
}

const getVaga = (req, res) => {
    const { estado, cidade, tipoVaga } = req.body
    let filter = {};

    if (estado) filter.estado = estado;
    if (cidade) filter.cidade = cidade;
    if (tipoVaga) filter.tipoVaga = tipoVaga;

    Vagas.find(filter).lean().exec((e, docs) => {
        console.log(docs)
        if (docs.length > 0) {
            res.status(200).json({ vagas: docs })
            res.end();
        } else {
            res.json({ msg: 'Não há vagas com esses parametros.', vagas: [] }).end()
        }
    }
    )
}


module.exports = { getVagas, getVagasbyId, getVaga };