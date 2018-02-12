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

  return router;
};