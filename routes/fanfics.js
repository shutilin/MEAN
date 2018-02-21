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
      if(!req.body.description){
        res.json({ success: false, message: 'Fanfic description is required.' }); 
      } else {
        if (!req.body.body) {
          res.json({ success: false, message: 'Fanfic body is required.' }); // Return error message
        } else {
          if (!req.body.createdBy) {
            res.json({ success: false, message: 'Fanfic creator is required.' }); // Return error
          } else {
            const fanfic = new Fanfic({
              title: req.body.title,
              description: req.body.description, // Title field
              body: req.body.body, // Body field
              createdBy: req.body.createdBy,
              tags: req.body.tags,
              genre: req.body.genre // CreatedBy field
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
                    if (err.errors.description) {
                      res.json({ success: false, message: err.errors.description.message });
                    } else {
                    // Check if validation error is in the body field
                      if (err.errors.body) {
                        res.json({ success: false, message: err.errors.body.message }); // Return error message
                      } else {
                        res.json({ success: false, message: err }); // Return general error message
                      }
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
                    fanfic.description = req.body.description; 
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

  router.delete('/deleteFanfic/:id', (req, res) => {
    if (!req.params.id) {
      res.json({ success: false, message: 'No id provided' });
    } else {
      Fanfic.findOne({ _id: req.params.id }, (err, fanfic) => {
        if (err) {
          res.json({ success: false, message: 'Invalid id'});
        } else {
          if (!fanfic) {
            res.json({ success: false, message: 'Fanfic was not found' });
          } else {
             User.findOne({ _id: req.decoded.userId }, (err, user) => {
              if (err) {
                res.json({ success: false, message: err }); 
              } else {
                if (!user) {
                  res.json({ success: false, message: 'Unable to authenticate user.' }); 
                } else {
                  if (user.username !== fanfic.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to delete this fanfic' }); 
                    } else {
                      fanfic.remove((err) => {
                        if (err) {
                          res.json({ success: false, message: err }); 
                        } else {
                          //console.log('ss');
                          res.json({ success: true, message: 'Fanfic deleted!' }); 
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
  });

  router.put('/likeFanfic', (req, res) => {
    if(!req.body.id) {
      res.json({ success: false, message: 'No id was provided '});
    } else {
      Fanfic.findOne({ _id: req.body.id }, (err, fanfic) => {
        if (err) {
          res.json({success:false, message: 'Invalid fanfic id' });
        } else {
          if (!fanfic) {
            res.json({ success:false, message: 'That fanfic was not found '});
          } else {
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              if (err) {
                res.json({ success: false, message: "Smth wrong" });
              } else {
                if (!user) {
                  res.json({ success: false, message: 'Could not auth user'});
                } else {
                  if (user.username === fanfic.createdBy) {
                    res.json({ success: false, messagse: 'Cannot like your own post.' });
                  } else {
                    if (fanfic.likedBy.includes(user.username)) {
                      fanfic.likes--;
                      //fanfic.likedBy.push(user.username);
                      const arrayIndex = fanfic.likedBy.indexOf(user.username); // Check where username is inside of the array
                      fanfic.likedBy.splice(arrayIndex, 1);

                      fanfic.save((err) => {
                          if (err) {
                            res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                          } else {
                            res.json({ success: true, message: 'Fanfic disliked!' }); // Return success message
                          }
                        });
                    } else {
                      fanfic.likes++;
                      fanfic.likedBy.push(user.username);

                      fanfic.save((err) => {
                          if (err) {
                            res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                          } else {
                            res.json({ success: true, message: 'Fanfic liked!' }); // Return success message
                          }
                        });
                    }
                  }
                }
             }
            })
          }
        }
      })
    }
  });

  router.post('/comment', (req, res) => {
    if (!req.body.comment) {
      res.json({ success: false, message: 'No comment provided' }); 
    } else {
      if (!req.body.id) {
        res.json({ success: false, message: 'No id was provided' }); //
      } else {
        Fanfic.findOne({ _id: req.body.id }, (err, fanfic) => {
          if (err) {
            res.json({ success: false, message: 'Invalid fanfic id' }); 
          } else {
            if (!fanfic) {
              res.json({ success: false, message: 'Fanfic not found.' }); 
            } else {
              User.findOne({ _id: req.decoded.userId }, (err, user) => {
                if (err) {
                  res.json({ success: false, message: 'Something went wrong' }); 
                } else {
                  if (!user) {
                    res.json({ success: false, message: 'User not found.' }); 
                  } else {
                    fanfic.comments.push({
                      comment: req.body.comment, 
                      commentator: user.username 
                    });
                    fanfic.save((err) => {
                      if (err) {
                        res.json({ success: false, message: 'Something went wrong.' }); 
                      } else {
                        res.json({ success: true, message: 'Comment saved' }); 
                      }
                    });
                  }
                }
              });
            }
          }
        });
      }
    }
  });


  return router;
};