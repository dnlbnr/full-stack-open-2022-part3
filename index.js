require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

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

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.status(200).json(persons);
    })
    .catch((error) => next(error));
});

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) {
        response.status(200).json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  Person.findByIdAndRemove(id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body;
  if (!name) {
    return response.status(400).send('Please provide a name');
  }
  if (!number) {
    return response.status(400).send('Please provide a number');
  }

  Person.findOne({ name }).then((existingPerson) => {
    if (existingPerson) {
      return response.status(400).send(`${name} already exists in phone book`);
    }
    return new Person({ name, number })
      .save()
      .then((newPerson) => {
        response.status(200).json(newPerson);
      })
      .catch((error) => next(error));
  });
});

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  const person = request.body;
  Person.findByIdAndUpdate(id, person, { new: true })
    .then((newPerson) => {
      response.status(200).json(newPerson);
    })
    .catch((error) => next(error));
});

app.get('/info', (request, response, next) => {
  Person.find({})
    .then((persons) => {
      const personCount = persons.length;
      const time = new Date();
      const htmlString = `<p>Phonebook has info for ${personCount} people.</p><p>${time}</p>`;
      response.status(200).send(htmlString);
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.log(error);

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'id has wrong format' });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
