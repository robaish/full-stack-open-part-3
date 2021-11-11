// import express
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

// define routes
app.get('/', (request, response) => {
  response.send('<h1>Phonebook</h1>')
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/info', (request, response) => {
  const responseTime = new Date();
  response.write(`<p>Phonebook has info for ${persons.length} people</p>`);
  response.write(`<p>${responseTime}</p>`);
  response.end();
});

// listen to HTTP requests
const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);