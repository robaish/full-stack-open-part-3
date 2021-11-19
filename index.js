// import .env, express, morgan, cors, mongoose
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

// set instance of express
const app = express();

// prints every request
const requestLogger = (request, response, next) => {
	console.log('Method:', request.method);
	console.log('Path:  ', request.path);
	console.log('Body:  ', request.body);
	console.log('---');
	next();
};

// activate static
app.use(express.static('build'));

// activate json-parser
app.use(express.json());

// activate morgan
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'));
// only show 'post' token for POST requests
morgan.token('post', (request) => Object.keys(request.body).length > 0 ? JSON.stringify(request.body) : ' ');

// activate cors
app.use(cors());

// activate requestlogger
app.use(requestLogger);

// define root route
app.get('/', (request, response) => {
	response.send('<h1>Phonebook</h1>');
});

// get all persons
app.get('/api/persons', (request, response) => {
	Person.find({}).then(persons => {
		response.json(persons);
	});
});

// get single person
app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id)
		.then(person => {
			if (person) {
				response.json(person);
			} else {
				response.status(404).send('That person is not in the phonebook.').end();
			}
		})
		.catch(error => next(error));
});

// define info route
app.get('/info', (request, response) => {
	Person.find({}).then(persons => {
		const responseTime = new Date();
		const personCount = persons.length;
		response.write(`<p>The phonebook has info for ${personCount} people.</p>`);
		response.write(`<p>${responseTime}</p>`);
		response.end();
	});
});

// add person
app.post('/api/persons/', (request, response, next) => {
	const body = request.body;

	const person = new Person({
		name: body.name,
		number: body.number,
	});

	person
		.save()
		.then(savedPerson => savedPerson.toJSON())
		.then(savedAndFormattedPerson => {
			response.json(savedAndFormattedPerson);
		})
		.catch(error => next(error));
});

// delete person
app.delete('/api/persons/:id', (request, response, next) => {
	Person
		.findByIdAndRemove(request.params.id)
		.then(() => {
			response.status(204).end();
		})
		.catch(error => next(error));
});

// update person
app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body;

	const person = {
		name: body.name,
		number: body.number
	};
	// turn on update validators
	const opts = { new: true, runValidators: true };

	Person
		.findByIdAndUpdate(request.params.id, person, opts)
		.then(updatedPerson => {
			response.json(updatedPerson);
		})
		.catch(error => next(error));
});

// handle requests with unknown endpoint
const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

// error handling
const errorHandler = (error, request, response, next) => {
	console.log(error.name);
	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' });
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message });
	}
	next(error);
};

// keep here, has to be the last loaded middleware
app.use(errorHandler);

// listen to HTTP requests
const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});