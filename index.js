const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('build'));

morgan.token('body', function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.get('/api/persons', (request, response) => {
  response.status(200).json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    return response.status(200).send(`${person.name} - ${person.number}`);
  }
  return response.status(400).send('Not found');
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    persons = persons.filter((person) => person.id !== id);
    return response.status(200).send(`${person.name} deleted successfully`);
  }
  return response.status(400).send('Not found');
});

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body;
  if (!name) {
    return response.status(400).send('Please provide a name');
  }
  if (!number) {
    return response.status(400).send('Please provide a number');
  }
  if (persons.find((person) => person.name === name)) {
    return response.status(400).send(`${name} already exists in phone book`);
  }
  const id = Math.floor(Math.random() * 100000000);
  const newPerson = { id, name, number };
  persons.push(newPerson);
  return response.status(200).json(newPerson);
});

app.get('/info', (request, response) => {
  const personCount = persons.length;
  const time = new Date();
  const htmlString = `<p>Phonebook has info for ${personCount} people.</p><p>${time}</p>`;
  response.status(200).send(htmlString);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
