import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { FanficsService } from '../../services/fanfics.service';

@Component({
  selector: 'app-fanfics',
  templateUrl: './fanfics.component.html',
  styleUrls: ['./fanfics.component.css']
})
export class FanficsComponent implements OnInit {
  
  messageClass;
  message;
  newFanfic = false;
  loadingFanfics = false;
  form;
  commentForm;
  processing = false;
  username;
  fanficPosts;
  newComment = [];
  enabledComments = [];

  constructor(
  	private formBuilder: FormBuilder,
    private authService: AuthService,
    private fanficsService: FanficsService
  ) {
  	this.createNewFanficForm();
    this.createCommentForm();
   }
  
  createNewFanficForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5),
        this.alphaNumericValidation
      ])],
      body: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(10000),
        Validators.minLength(5)
      ])]
    })
  }

  enableFormNewFanficForm() {
    this.form.get('title').enable(); // Enable title field
    this.form.get('body').enable(); // Enable body field
  }

  // Disable new blog form
  disableFormNewFanficForm() {
    this.form.get('title').disable(); // Disable title field
    this.form.get('body').disable(); // Disable body field
  }

   createCommentForm() {
    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(200)
      ])]
    })
  }

  enableCommentForm() {
    this.commentForm.get('comment').enable(); // Enable comment field
  }

  disableCommentForm() {
    this.commentForm.get('comment').disable(); // Disable comment field
  }

  alphaNumericValidation(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/); // Regular expression to perform test
    // Check if test returns false or true
    if (regExp.test(controls.value)) {
      return null; // Return valid
    } else {
      return { 'alphaNumericValidation': true }; // Return error in validation
    }
  }

  newFanficForm() {
  	this.newFanfic = true;
  }

  reloadFanfics() {
  	this.loadingFanfics = true;
    this.getAllFanfics();
 
  	setTimeout(() => {
  	  this.loadingFanfics = false;	
  	}, 4000);
  }

  draftComment(id) {
    this.commentForm.reset();
    this.newComment = []; // Clear array so only one post can be commented on at a time
    this.newComment.push(id);
  }

   cancelSubmission(id) {
    const index = this.newComment.indexOf(id); // Check the index of the blog post in the array
    this.newComment.splice(index, 1); // Remove the id from the array to cancel post submission
    this.commentForm.reset(); // Reset  the form after cancellation
    this.enableCommentForm(); // Enable the form after cancellation
    this.processing = false; // Enable any buttons that were locked
  }

  goBack() {
  	window.location.reload();
  }

  onFanficSubmit() {
  	this.processing = true;
    this.disableFormNewFanficForm(); 

    const fanfic = {
      title: this.form.get('title').value, 
      body: this.form.get('body').value, 
      createdBy: this.username 
    }

    this.fanficsService.newFanfic(fanfic).subscribe(data => {
      // Check if blog was saved to database or not
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Return error class
        this.message = data.message; // Return error message
        this.processing = false; // Enable submit button
        this.enableFormNewFanficForm(); // Enable form
      } else {
        this.messageClass = 'alert alert-success'; // Return success class
        this.message = data.message; // Return success message
        // Clear form data after two seconds
        this.getAllFanfics();
        setTimeout(() => {
          this.newFanfic = false; // Hide form
          this.processing = false; // Enable submit button
          this.message = false; // Erase error/success message
          this.form.reset(); // Reset all form fields
          this.enableFormNewFanficForm(); // Enable the form fields
        }, 2000);
      }
    });
  }

  getAllFanfics() {
    this.fanficsService.getAllFanfics().subscribe(data => {
      this.fanficPosts = data.fanfics;
    })
  }
  
  likeFanfic(id) {
    this.fanficsService.likeFanfic(id).subscribe(data => {
      this.getAllFanfics(); 
    });
  }

  postComment(id) {
   this.disableCommentForm(); // Disable form while saving comment to database
    this.processing = true; // Lock buttons while saving comment to database
    const comment = this.commentForm.get('comment').value; // Get the comment value to pass to service function
    // Function to save the comment to the database
    this.fanficsService.postComment(id, comment).subscribe(data => {
      this.getAllFanfics(); // Refresh all blogs to reflect the new comment
      const index = this.newComment.indexOf(id); // Get the index of the blog id to remove from array
      this.newComment.splice(index, 1); // Remove id from the array
      this.enableCommentForm(); // Re-enable the form
      this.commentForm.reset(); // Reset the comment form
      this.processing = false; // Unlock buttons on comment form
      if (this.enabledComments.indexOf(id) < 0) this.expand(id); // Expand comments for user on comment submission
    });
  }

  expand(id) {
    this.enabledComments.push(id); // Add the current blog post id to array
  }

  // Collapse the list of comments
  collapse(id) {
    const index = this.enabledComments.indexOf(id); // Get position of id in array
    this.enabledComments.splice(index, 1); // Remove id from array
  }

  ngOnInit() {
  	// Get profile username on page load
      this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username; // Used when creating new blog posts and comments
    });
      this.getAllFanfics();
  }

}
