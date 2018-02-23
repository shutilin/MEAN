const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose


let titleLengthChecker = (title) => {
  if (!title) {
    return false; // Return error
  } else {
    // Check the length of title
    if (title.length < 5 || title.length > 50) {
      return false; // Return error if not within proper length
    } else {
      return true; // Return as valid title
    }
  }
};

// Validate Function to check if valid title format
let alphaNumericTitleChecker = (title) => {
  // Check if title exists
  if (!title) {
    return false; // Return error
  } else {
    // Regular expression to test for a valid title
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
    return regExp.test(title); // Return regular expression test results (true or false)
  }
};

// Array of Title Validators
const titleValidators = [
  // First Title Validator
  {
    validator: titleLengthChecker,
    message: 'Title must be more than 5 characters but no more than 50'
  },
  // Second Title Validator
  {
    validator: alphaNumericTitleChecker,
    message: 'Title must be alphanumeric'
  }
];

let descriptionLengthChecker = (description) => {
  // Check if body exists
  if (!description) {
    return false; // Return error
  } else {
    // Check length of body
    if (description.length < 5 || description.length > 500) {
      return false; // Return error if does not meet length requirement
    } else {
      return true; // Return as valid body
    }
  }
};

const descriptionValidators = [
  {
    validator: descriptionLengthChecker,
    message: 'Description must be more than 5 characters but no more than 500.'
  }
];

// Validate Function to check body length
let bodyLengthChecker = (body) => {
  // Check if body exists
  if (!body) {
    return false; // Return error
  } else {
    // Check length of body
    if (body.length < 5 || body.length > 10000) {
      return false; // Return error if does not meet length requirement
    } else {
      return true; // Return as valid body
    }
  }
};

// Array of Body validators
const bodyValidators = [
  // First Body validator
  {
    validator: bodyLengthChecker,
    message: 'Body must be more than 5 characters but no more than 10000.'
  }
];

// Validate Function to check comment length
let commentLengthChecker = (comment) => {
  // Check if comment exists
  if (!comment[0]) {
    return false; // Return error
  } else {
    // Check comment length
    if (comment[0].length < 1 || comment[0].length > 200) {
      return false; // Return error if comment length requirement is not met
    } else {
      return true; // Return comment as valid
    }
  }
};

// Array of Comment validators
const commentValidators = [
  // First comment validator
  {
    validator: commentLengthChecker,
    message: 'Comments may not exceed 200 characters.'
  }
];


const fanficSchema = new Schema({
  title: { type: String, required: true, validate: titleValidators },
  description: {type: String, required: true, validate: descriptionValidators },
  genre: { type: String, required: true },
  pictureUrl: { type: String },
  body: { type: String, required: true, validate: bodyValidators },
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now() },
  likes: { type: Number, default: 0 },
  likedBy: { type: Array },
  comments: [{
    comment: { type: String, validate: commentValidators },
    commentator: { type: String }
  }],
  tags: {type: Array}
});

// Export Module/Schema
module.exports = mongoose.model('Fanfic', fanficSchema);