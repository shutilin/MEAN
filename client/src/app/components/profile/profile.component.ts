import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FanficsService } from '../../services/fanfics.service';
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ImageUploadModule } from "angular2-image-upload";


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
    this.form.get('description').enable();
    this.form.get('body').enable(); 
  }

  
  disableFormNewFanficForm() {
    this.form.get('title').disable(); 
    this.form.get('description').disable();
    this.form.get('body').disable(); 
  }


  alphaNumericValidation(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9А-Яа-я ]+$/); 
    
    if (regExp.test(controls.value)) {
      return null; 
    } else {
      return { 'alphaNumericValidation': true }; 
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
      
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; 
        this.message = data.message; 
        this.processing = false; 
        this.enableFormNewFanficForm(); 
      } else {
        this.messageClass = 'alert alert-success'; 
        this.message = data.message; 
        
        
        this.getUserFanfics(this.username);
        setTimeout(() => {
          this.newFanfic = false; 
          this.processing = false; 
          this.message = false; 
          this.form.reset(); 
          this.enableFormNewFanficForm(); 
        }, 2000);
      }
    });
  }

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

  getUserFanfics(username) {
    this.fanficsService.getUserFanfics(username).subscribe(data => {
      this.fanficPosts = data.fanfics;
    })
  }

  ngOnInit() {
    
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username; 
      this.email = profile.user.email;
      this.getUserFanfics(this.username); 
    });
  }

}