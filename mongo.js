const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('password required')
    process.exit
}

const password = process.argv[2]
const url = `mongodb+srv://malpel:${password}@fullstack-vaslr.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 4) {
    console.log('phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
} else if (process.argv.length < 5) {
    console.log('number required')
    process.exit
} else {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    person.save().then(response => {
        console.log(`added ${response.name} ${response.number} to phonebook`)
        mongoose.connection.close()
    })
}










