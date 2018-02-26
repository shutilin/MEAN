const mongoose = require('mongoose'); 
mongoose.Promise = global.Promise; 
const Schema = mongoose.Schema; 


let titleLengthChecker = (title) => {
  if (!title) {
    return false; 
  } else {    
    if (title.length < 5 || title.length > 50) {
      return false; 
    } else {
      return true; 
    }
  }
};


let alphaNumericTitleChecker = (title) => {  
  if (!title) {
    return false; 
  } else {
    
    const regExp = new RegExp(/^[a-zA-Z0-9А-яа-я ]+$/);
    return regExp.test(title); 
  }
};


const titleValidators = [  
  {
    validator: titleLengthChecker,
    message: 'Title must be more than 5 characters but no more than 50'
  },
  
  {
    validator: alphaNumericTitleChecker,
    message: 'Title must be alphanumeric'
  }
];

let descriptionLengthChecker = (description) => {  
  if (!description) {
    return false; 
  } else {
    
    if (description.length < 5 || description.length > 500) {
      return false; 
    } else {
      return true; 
    }
  }
};

const descriptionValidators = [
  {
    validator: descriptionLengthChecker,
    message: 'Description must be more than 5 characters but no more than 500.'
  }
];


let bodyLengthChecker = (body) => {  
  if (!body) {
    return false; 
  } else {    
    if (body.length < 5 || body.length > 10000) {
      return false; 
    } else {
      return true; 
    }
  }
};


const bodyValidators = [
  
  {
    validator: bodyLengthChecker,
    message: 'Body must be more than 5 characters but no more than 10000.'
  }
];


let commentLengthChecker = (comment) => {
  if (!comment[0]) {
    return false; 
  } else { 
    if (comment[0].length < 1 || comment[0].length > 200) {
      return false; 
    } else {
      return true; 
    }
  }
};


const commentValidators = [
  {
    validator: commentLengthChecker,
    message: 'Comments may not exceed 200 characters.'
  }
];


const fanficSchema = new Schema({
  title: { type: String, required: true, validate: titleValidators },
  description: {type: String, required: true, validate: descriptionValidators },
  genre: { type: String, required: true },
  pictureURL: { type: String },
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


module.exports = mongoose.model('Fanfic', fanficSchema);