// import express, morgan, cors, .env variables, mongoose
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const Person = require('./models/person');

// set instance of express
const app = express();

// activate json-parser
app.use(express.json());

// activate morgan
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'));
// only show 'post' token for POST requests
morgan.token('post', function(request, response) {
  return Object.keys(request.body).length > 0 ? JSON.stringify(request.body) : " ";
});

// activate cors
app.use(cors());

// activate static
app.use(express.static('build'));

// define root route
app.get('/', (request, response) => {
  response.send('<h1>Phonebook</h1>')
});

// get all persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people);
  })
});

// get single person
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
  .then(person => {
    response.json(person);
  })
  .catch(error => {
    console.log(error)
    response.status(404).send('That person is not in the phonebook.').end()
  })
});

// define info route
app.get('/info', (request, response) => {
  const responseTime = new Date();
  response.write(`<p>Phonebook has info for ${persons.length} people</p>`);
  response.write(`<p>${responseTime}</p>`);
  response.end();
});

// add person
app.post('/api/persons/', (request, response) => {
  const body = request.body;

  if (body.name === "" || body.number === "") {
    return response.status(400).json({
      error: 'Name or number is missing.'
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then(savedPerson => {
    response.json(savedPerson)
  });
})

// delete person
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(p => p.id !== id);
  response.status(204).end();
})

// listen to HTTP requests
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})