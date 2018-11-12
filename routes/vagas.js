const express = require('express');
const router = express.Router();

const db = require('../config/db')
const Vagas = db.Mongoose.model('vagas', db.VagaSchema, 'vagas');


router.get('/vagas/:idUser', (req, res) => {
    const idUser = req.params.idUser
    Vagas.find({ idUser }).lean().exec((e, docs) => {
        if (docs.length != 0) {
            res.json({ sucess: true, vagas: docs })
            res.end()
        } else {

            res.json({ sucess: false, msg: 'Não há Vagas publicadas' })
            res.end()
        }
    })
})


router.get('/vaga/:id', (req, res) => {
    Vagas.find({ _id: req.params.id }).lean().exec((e, docs) => {

        res.json(docs)
        res.end()
    })
})

router.get('/vagas', (req, res) => {
    Vagas.find().lean().exec((e, docs) => {

        res.json(docs)
        res.end()
    })
})

router.get('/vaga/:estado/:cidade?/:areaAt?', (req, res) => {
    let { estado, cidade, areaAt } = req.params;

    let search = { estado, cidade, areaAt }


    if (cidade === "0" && areaAt === "0") {
        Vagas.find({ estado }).lean().exec((e, docs) => {
            console.log(docs.length)
            if (docs.length === 0) {
                res.json({ sucess: false, msg: "Não há vagas com esses parametros." })
                res.end()
            }
            else {
                res.json({ sucess: true, vagas: docs })
                res.end()
            }

        })
    } else if (cidade === "0") {
        Vagas.find({ estado, areaAt }).lean().exec((e, docs) => {
            if (docs.length === 0) {
                res.json({ sucess: false, msg: "Não há vagas com esses parametros." })
                res.end()
            } else {
                res.json({ sucess: true, vagas: docs })
                res.end()
            }

        })
    } else if (areaAt === "0") {
        Vagas.find({ estado, cidade }).lean().exec((e, docs) => {

            if (docs.length === 0) {
                res.json({ sucess: false, msg: "Não há vagas com esses parametros." })
                res.end()
            }
            else {
                res.json({ sucess: true, vagas: docs })
                res.end()
            }

        })
    } else {
        Vagas.find({ estado, cidade, areaAt }).lean().exec((e, docs) => {
            if (docs.length === 0) {
                res.json({ sucess: false, msg: "Não há vagas com esses parametros." })
                res.end()
            } else {
                res.json({ sucess: true, vagas: docs })
                res.end()
            }

        })
    }


})

router.post('/newVaga', (req, res) => {
    console.log(req.body)

    const { idUser, nomeCont, areaAt, estado, cidade, remu, viagem, numCont, emailCont, desc, tipoVaga, } = req.body;
    const newVaga = new Vagas({
        idUser,
        nomeCont,
        areaAt,
        tipoVaga,
        estado,
        cidade,
        remu,
        viagem,
        numCont,
        emailCont,
        desc
    })

    newVaga.save(err => {
        if (err) {
            res.status(500)
            res.end();
        } else {
            res.status(200)
            res.end()
        }

    })
})

router.delete('/deletevaga/:id', (req, res) => {
    Vagas.deleteOne({ _id: req.params.id }, (err) => {
        if (err) {
            res.status(500).json({ "error": "Erro ao excluir a Vaga" })
            res.end()
            return
        } else {
            res.send('Vaga excluida')
            res.end()
        }


    })
})
module.exports = router