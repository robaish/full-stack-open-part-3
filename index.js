// import express
const { response, request } = require('express');
const express = require('express');
// set instance of express
const app = express();

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
  person ? response.json(person) : response.status(404).end();
})

// define info route
app.get('/info', (request, response) => {
  const responseTime = new Date();
  response.write(`<p>Phonebook has info for ${persons.length} people</p>`);
  response.write(`<p>${responseTime}</p>`);
  response.end();
});

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