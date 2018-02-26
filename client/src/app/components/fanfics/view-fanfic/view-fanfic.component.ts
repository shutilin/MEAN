import { Component, OnInit } from '@angular/core';
import { FanficsService } from '../../../services/fanfics.service';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-view-fanfic',
  templateUrl: './view-fanfic.component.html',
  styleUrls: ['./view-fanfic.component.css']
})
export class ViewFanficComponent implements OnInit {

  message;
  messageClass;
  foundFanfic = false;
  fanfic;
  currentUrl;
  commentForm;
  processing = false;
  newComment = [];

  constructor(
    private formBuilder: FormBuilder,
  	private fanficsService: FanficsService,
    private authService: AuthService,
  	private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.createCommentForm();
   }

  isAuthorized() {
    return this.authService.loggedIn();
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

  getCurrentFanfic(id) {
    this.fanficsService.getSingleFanfic(id).subscribe(data => {
      this.fanfic = data.fanfic;
    })
  }

  enableCommentForm() {
    this.commentForm.get('comment').enable(); 
  }

  disableCommentForm() {
    this.commentForm.get('comment').disable(); 
  }

  postComment() {
   this.disableCommentForm(); 
    
    const comment = this.commentForm.get('comment').value; 
    const id = this.currentUrl.id;
    
    this.fanficsService.postComment(id, comment).subscribe( data=> {
      this.getCurrentFanfic(id);
      this.enableCommentForm();
      this.commentForm.reset();
    });
  }


  ngOnInit() {
  	this.currentUrl = this.activatedRoute.snapshot.params;
    this.fanficsService.getSingleFanfic(this.currentUrl.id).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      } else {
        this.fanfic = {
          title: data.fanfic.title,
          body: data.fanfic.body,
          createdBy: data.fanfic.createdBy,
          createdAt: data.fanfic.createdAt,
          comments: data.fanfic.comments,
          genre: data.fanfic.genre,
          pictureURL: data.fanfic.pictureURL
        }
        this.foundFanfic = true;
      }
    });
  }
}
