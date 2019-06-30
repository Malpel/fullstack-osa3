const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },

    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },

    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },

    {
        name: "Mary Poppendieck",
        number: "49-23-6423122",
        id: 4
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Phonebook</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const size = persons.length
    const requestDate = new Date()
    res.send(`<div><p>Phonebook has info for ${size} people</p>
    <p>${requestDate}</p></div>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(note => note.id === id)
    person ? res.json(person) : res.status(404).end()
})

const generateId = () => {
    const id = Math.floor(Math.random() * ((1001 - 5) + 1) + 5)
    return id
}

app.post('/api/persons', (req, res) => {
    const body = req.body
    console.log(body)

    const exists = persons.find(person => person.name === body.name)

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'content missing'
        })
    } else if (exists) {
        return res.status(400).json({
            error: 'already exists! name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    console.log(person)

    persons = persons.concat(person)
    res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

const port = 3001
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})