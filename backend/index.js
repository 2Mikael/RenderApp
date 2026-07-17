const express = require("express")
const morgan = require("morgan")
const app = express()

app.use(express.json())
app.use(express.static('dist'))
morgan.token("pad-method", (req, res) => req.method.padEnd(6))
morgan.token("pad-url", (req, res) => req.url.padEnd(32))
morgan.token("json-body", (req, res) => JSON.stringify(req.body))
app.use(morgan(":pad-method :pad-url :status | :res[content-length] bytes | :response-time ms | :json-body"))

let data = [
    { 
        "id": "1",
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": "2",
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": "3",
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": "4",
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
]

app.get("/info", (request, response) => {
    response.end(
        `<div>
            <p> Phonebook has info for ${data.length} people. </p>
            <i> ${Date()} </i>
        </div>`
    )
})

app.get("/api/persons", (request, response) => {
    response.json(data)
})

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id
    const person = data.find(entry => entry.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.post("/api/persons", (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({error: "Name not specified."})
    } if (!body.number) {
        return response.status(400).json({error: "Number not specified."})
    } if (data.find(person => person.name === body.name)) {
        return response.status(409).json({error: "Name already exists."})
    }

    const person = {
        id: String(Math.ceil(Math.random() * Number.MAX_SAFE_INTEGER)),
        name: body.name,
        number: body.number
    }

    data.push(person)

    response.json(person)
})

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id
    const person = data.find(person => person.id === id)
    
    if (person) {
        data = data.filter(person => person.id !== id)
        response.status(200).end()
    } else {
        response.status(404).end()
    }
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})