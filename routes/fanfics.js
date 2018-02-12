const User = require('../models/user'); // Import User Model Schema
const Fanfic = require('../models/fanfic'); // Import Fanfic Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/database'); // Import database configuration

module.exports = (router) => {

  /* ===============================================================
     CREATE NEW FANFIC
  =============================================================== */
  router.post('/newFanfic', (req, res) => {
    if (!req.body.title) {
      res.json({ success: false, message: 'Fanfic title is required.' }); // Return error message
    } else {
      if (!req.body.body) {
        res.json({ success: false, message: 'Fanfic body is required.' }); // Return error message
      } else {
        if (!req.body.createdBy) {
          res.json({ success: false, message: 'Fanfic creator is required.' }); // Return error
        } else {
          const fanfic = new Fanfic({
            title: req.body.title, // Title field
            body: req.body.body, // Body field
            createdBy: req.body.createdBy // CreatedBy field
          });
          // Save Fanfic into database
          fanfic.save((err) => {
            // Check if error
            if (err) {
              // Check if error is a validation error
              if (err.errors) {
                // Check if validation error is in the title field
                if (err.errors.title) {
                  res.json({ success: false, message: err.errors.title.message }); // Return error message
                } else {
                  // Check if validation error is in the body field
                  if (err.errors.body) {
                    res.json({ success: false, message: err.errors.body.message }); // Return error message
                  } else {
                    res.json({ success: false, message: err }); // Return general error message
                  }
                }
              } else {
                res.json({ success: false, message: err }); // Return general error message
              }
            } else {
              res.json({ success: true, message: 'Fanfic saved!' }); // Return success message
            }
          });
        }
      }
    }
  });

  router.get('/allFanfics', (req, res) => {
    Fanfic.find({}, (err, fanfics) => {
      if (err) {
        res.json({ success: false, message: err });
      } else {
        if (!fanfics) {
          res.json({ success: false, message: "No fanfics found"});
        } else{
          res.json({ success: true, fanfics: fanfics });
        }
      }
    }).sort({ '_id' : -1 });
  })

  router.get('/singleFanfic/:id', (req, res) => {
    if(!req.params.id) {
      res.json({ success:false, message: "No fanfic ID"})
    } else {
      Fanfic.findOne({ _id: req.params.id }, (err, fanfic) => {
         if (err) {
           res.json({ success: false, message: "Not a valid ID" });
         } else {
          if (!fanfic) {
            res.json({ success: false, message: "Fanfic not found"});
          } else{
             User.findOne({ _id: req.decoded.userId }, (err, user) => {
              if (err) {
                res.json({ success: false, message: err }); 
              } else {
                if (!user) {
                  res.json({ success: false, message: 'Unable to authenticate user' });
                } else {
                  if (user.username !== fanfic.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to edit this fanfic.' });
                  } else {
                    res.json({ success: true, fanfic: fanfic }); 
                  }
                }
              }
            });
          }
        }
      });
    }  
  });

  router.put('/updateFanfic', (req, res) => {
    if(!req.body._id) {
      res.json({ success: false, message: 'No fanfic id provided'});
    } else {
      Fanfic.findOne({ _id: req.body._id }, (err, fanfic) => {
        if (err) {
          res.json({ success: false, message: 'Not a valid fanfic id' }); 
        } else {         
          if (!fanfic) {
            res.json({ success: false, message: 'Fanfic id was not found.' }); 
          } else {      
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              if (err) {
                res.json({ success: false, message: err }); 
              } else {
                if (!user) {
                  res.json({ success: false, message: 'Unable to authenticate user.' }); 
                } else {               
                  if (user.username !== fanfic.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to edit this fanfic post.' }); // Return error message
                  } else {
                    fanfic.title = req.body.title; 
                    fanfic.body = req.body.body; 
                    fanfic.save((err) => {
                      if (err) {
                        if (err.errors) {
                          res.json({ success: false, message: 'Please ensure form is filled out properly' });
                        } else {
                          res.json({ success: false, message: err }); 
                        }
                      } else {
                        res.json({ success: true, message: 'Fanfic Updated!' }); 
                      }
                    });
                  }
                }
              }
            });
          }
        }
      });
    }
  })

  return router;
};