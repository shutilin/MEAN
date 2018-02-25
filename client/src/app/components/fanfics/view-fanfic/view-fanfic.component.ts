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
    this.commentForm.get('comment').enable(); // Enable comment field
  }

  disableCommentForm() {
    this.commentForm.get('comment').disable(); // Disable comment field
  }

  postComment() {
   this.disableCommentForm(); // Disable form while saving comment to database
    //this.processing = true; // Lock buttons while saving comment to database
    const comment = this.commentForm.get('comment').value; 
    const id = this.currentUrl.id;// Get the comment value to pass to service function
    // Function to save the comment to the database
    this.fanficsService.postComment(id, comment).subscribe( data=> {
      this.getCurrentFanfic(id);
      this.enableCommentForm();
      this.commentForm.reset();
    });
    /*this.fanficsService.postComment(id, comment).subscribe(data => {
      //this.getAllFanfics(); // Refresh all blogs to reflect the new comment
      const index = this.newComment.indexOf(id); // Get the index of the blog id to remove from array
      this.newComment.splice(index, 1); // Remove id from the array
      this.enableCommentForm(); // Re-enable the form
      //this.commentForm.reset(); // Reset the comment form
      this.processing = false; // Unlock buttons on comment form
      //if (this.enabledComments.indexOf(id) < 0) this.expand(id); // Expand comments for user on comment submission
    });*/
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
