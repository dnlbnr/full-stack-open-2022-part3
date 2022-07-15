const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

mongoose
  .connect(uri)
  .then(() => {
    console.log('Connected to database');
  })
  .catch((error) => {
    console.log(`Error connecting to database: ${error.message}`);
  });

const personSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /\d{2}-\d{6,}|\d{3}-\d{5,}|\d{8,}/.test(v),
      message: 'Incorrect format',
    },
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
