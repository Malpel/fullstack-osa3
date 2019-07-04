require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(bodyParser.json())

morgan.token('post-content', (tokens) => {
    return JSON.stringify(tokens.body)
})

app.use(morgan(':method :url :status :res[content-length] :response-time ms :post-content'))

let personAmount = 0

app.get('/', (req, res) => {
    res.send('<h1>Phonebook</h1>')
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON(), personAmount = persons.length))
        
    })
})

app.get('/info', (req, res) => {
    const requestDate = new Date()
    res.send(`<div><p>Phonebook has info for ${personAmount} people</p>
    <p>${requestDate}</p></div>`)
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person.toJSON())
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

const generateId = () => {
    const id = Math.floor(Math.random() * ((1001 - 5) + 1) + 5)
    return id
}

app.post('/api/persons', (req, res) => {
    const body = req.body

    //const exists = persons.find(person => person.name === body.name)

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'content missing'
        })
    } /* else if (exists) {
        return res.status(400).json({
            error: 'already exists! name must be unique'
        })
    } */

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    console.log(person)

    person.save().then(savedPerson => {
        res.json(savedPerson.toJSON())
    })
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(req.params.id, person, { new:true })
    .then(updatedPerson => {
        res.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndRemove(req.params.id)
    .then(result => {
        res.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.log(error)

    if (error.name === 'CastError' && error.kind == 'ObjectID') {
        return res.status(400).send({ error: 'malformed id' })
    }
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})