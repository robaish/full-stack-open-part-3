// import express, morgan, cors
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

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

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
];

// define root route
app.get('/', (request, response) => {
  response.send('<h1>Phonebook</h1>')
});

// get all persons
app.get('/api/persons', (request, response) => {
  response.json(persons);
});

// get single person
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(p => p.id === id);
  person ? response.json(person) : response.status(404).send('That person does not exist.').end();
})

// define info route
app.get('/info', (request, response) => {
  const responseTime = new Date();
  response.write(`<p>Phonebook has info for ${persons.length} people</p>`);
  response.write(`<p>${responseTime}</p>`);
  response.end();
});

// add person
app.post('/api/persons/', (request, response) => {

  const person = request.body;

  if (!person.name || !person.number) {
    return response.status(400).json({
      error: 'Name or number is missing.'
    });
  }

  if (persons.find(p => p.name === person.name)) {
    return response.status(409).json({
      error: 'The name of this person is already added.'
    })
  }
  person.id = Math.floor(Math.random()*1000000);
  persons = persons.concat(person);
  response.json(person);
})

// delete person
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(p => p.id !== id);
  response.status(204).end();
})

// listen to HTTP requests
const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);