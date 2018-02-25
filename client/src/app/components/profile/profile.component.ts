import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FanficsService } from '../../services/fanfics.service';
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ImageUploadModule } from "angular2-image-upload";
import { UploadEvent, UploadFile } from 'ngx-file-drop';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  username = '';
  email = '';
  fanficPosts;
  messageClass;
  message;
  newFanfic = false;
  loadingFanfics = false;
  form;
  processing = false;
  items = [];
  genre;
  pictureURI;
  image;
  pic;

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
      description: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(5)
      ])],
      tags: [''],
      genre: [''],
      body: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(10000),
        Validators.minLength(5)
      ])]
    })
  }

  enableFormNewFanficForm() {
    this.form.get('title').enable(); 
    this.form.get('description').enable();// Enable title field
    this.form.get('body').enable(); // Enable body field
  }

  // Disable new blog form
  disableFormNewFanficForm() {
    this.form.get('title').disable(); // Disable title field
    this.form.get('description').disable();
    this.form.get('body').disable(); // Disable body field
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


  goBack() {
    this.newFanfic = false;
  }

  onFanficSubmit() {
    this.processing = true;
    this.disableFormNewFanficForm(); 

    const fanfic = {
      title: this.form.get('title').value, 
      description: this.form.get('description').value,
      body: this.form.get('body').value, 
      createdBy: this.username,
      tags: this.items,
      genre: this.genre,
      picture: this.pic 
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
        //this.getAllFanfics();
        this.getUserFanfics(this.username);
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

 /*  getBase64(file) {
     var reader = new FileReader();
     reader.readAsDataURL(file);
     reader.onload = function () {
       console.log(reader.result);
     };
     reader.onerror = function (error) {
       console.log('Error: ', error);
     };
  }*/

  changeListener($event) : void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    var preview = document.querySelector('img');
    var file:File = inputValue.files[0];
    var myReader:FileReader = new FileReader();
    console.log(file);
    myReader.onloadend = (e) => {
      preview.src = myReader.result;
      this.pic = myReader.result;
      console.log(this.pic);
    }
    myReader.readAsDataURL(file);
  }

 
  public files: UploadFile[] = [];
 
  public dropped(event: UploadEvent) {
    this.files = event.files;
    for (const file of event.files) {
    var myReader:FileReader = new FileReader();
    // myReader.onloadend = (e) => {
    //   //preview.src = myReader.result;
    //   this.pic = myReader.result;
    //   console.log(this.pic);
    // }
    //myReader.readAsDataURL(file.);
      /*file.fileEntry.file(info => {
        console.log(info);
      });*/
    }
  }
 
  public fileOver(event){
    console.log(event);
  }
 
  public fileLeave(event){
    console.log(event);
  }

  getUserFanfics(username) {
    this.fanficsService.getUserFanfics(username).subscribe(data => {
      this.fanficPosts = data.fanfics;
    })
  }

  ngOnInit() {
    // Once component loads, get user's data to display on profile
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username; // Set username
      this.email = profile.user.email;
      this.getUserFanfics(this.username); // Set e-mail
    });
  }

}