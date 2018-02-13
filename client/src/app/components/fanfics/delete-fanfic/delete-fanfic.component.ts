import { Component, OnInit } from '@angular/core';
import { FanficsService } from '../../../services/fanfics.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-delete-fanfic',
  templateUrl: './delete-fanfic.component.html',
  styleUrls: ['./delete-fanfic.component.css']
})
export class DeleteFanficComponent implements OnInit {

  message;
  messageClass;
  foundFanfic = false;
  processing = false;
  fanfic;
  currentUrl;

  constructor( 
  	private fanficsService: FanficsService,
  	private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  deleteFanfic(){
  	this.processing = true;
  	this.fanficsService.deleteFanfic(this.currentUrl.id).subscribe(data => {
  	  if (!data.success) {
        this.messageClass = 'alert alert-danger'; 
        this.message = data.message; 
      } else {
        this.messageClass = 'alert alert-success'; 
        this.message = data.message;      
        setTimeout(() => {
          this.router.navigate(['/fanfics']); 
        }, 2000);
      }
  	})
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
          createdAt: data.fanfic.createdAt
        }
        this.foundFanfic = true;
      }
    });
  }

}
