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
  processing = false;
  username;

  constructor(
  	private formBuilder: FormBuilder,
    private authService: AuthService,
    private fanficsService: FanficsService
  ) {
  	this.createNewFanficForm();
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
        Validators.maxLength(500),
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

  alphaNumericValidation(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/); // Regular expression to perform test
    // Check if test returns false or true
    if (regExp.test(controls.value)) {
      return null; // Return valid
    } else {
      return { 'alphaNumericValidation': true } // Return error in validation
    }
  }

  newFanficForm() {
  	this.newFanfic = true;
  }

  reloadFanfics() {
  	this.loadingFanfics = true;

  	setTimeout(() => {
  	  this.loadingFanfics = false;	
  	}, 4000);
  }

  draftComment() {

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
 

  ngOnInit() {
  	// Get profile username on page load
      this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username; // Used when creating new blog posts and comments
    });
  }

}
