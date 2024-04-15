const express = require('express')
const app = express()
const getTopics = require('../db/controller/topics-controller')

app.use(express.json())

app.get('/api/topics', getTopics)


app.use((err, req, res, next) => {
    if(err.status && err.message){
        res.status(err.status).send({ message: err.message})
    }
    next(err)
})

app.all('*', (req,res,next) => {
    res.status(404).send({ message: 'path not found!' })
})





module.exports = app