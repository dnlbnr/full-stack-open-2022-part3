const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log(
    'Please provide a password as an argument: node mongo.js <password>'
  );
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://db-user:${password}@fso-part3.ww0dc.mongodb.net/?retryWrites=true&w=majority`;

const personSchema = mongoose.Schema({
  name: String,
  number: String,
});
const Person = mongoose.model('Person', personSchema);

const name = process.argv[3];
const number = process.argv[4];

if (name && number) {
  mongoose
    .connect(url)
    .then(() => new Person({ name, number }).save())
    .then(() => {
      console.log(`Added ${name} number ${number} to phonebook`);
      mongoose.connection.close();
    })
    .catch((error) => console.log(error));
} else {
  mongoose
    .connect(url)
    .then(() => Person.find({}))
    .then((persons) => {
      console.log('phonebook:');
      persons.forEach((person) =>
        console.log(`${person.name} ${person.number}`)
      );
      mongoose.connection.close();
    })
    .catch((error) => console.log(error));
}
