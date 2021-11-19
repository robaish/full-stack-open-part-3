const mongoose = require('mongoose');

if (process.argv.length < 3) {
	console.log('Please provide the password as an argument: node mongo.js <password>');
	process.exit(1);
}

const password = process.argv[2];

const url =
  `mongodb+srv://fullstackopen:${password}@cluster0.4ljws.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
	name: String,
	number: String
});

const Person = mongoose.model('Person', personSchema);

const addPerson = () => {
	const person = new Person({
		name: `${process.argv[3]}`,
		number: `${process.argv[4]}`
	});

	person.save().then(() => {
		console.log(`added ${person.name} number ${person.number} to phonebook`);
		mongoose.connection.close();
	});
};

const showEntries = () => {
	Person
		.find({})
		.then(result => {
			console.log('phonebook:');
			result.forEach(person => {
				console.log(person.name, person.number);
			});
			mongoose.connection.close();
		});
};

if (process.argv.length === 3) {
	showEntries();
}

if (process.argv.length > 3) {
	addPerson();
}