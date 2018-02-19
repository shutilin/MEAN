import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FanficsService } from '../../../services/fanfics.service';
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

@Component({
  selector: 'app-edit-fanfic',
  templateUrl: './edit-fanfic.component.html',
  styleUrls: ['./edit-fanfic.component.css']
})
export class EditFanficComponent implements OnInit {

  message;
  messageClass;	
  fanfic;
  processing = false;
  currentUrl;
  loading = true;
  values: string[];
  items = [];

  constructor(
  	private location: Location,
    private activatedRoute: ActivatedRoute,
    private fanficsService: FanficsService,
    private router: Router
  ) { }

  updateFanficSubmit() {
    this.processing = true;

     this.fanficsService.editFanfic(this.fanfic).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; 
        this.message = data.message; 
        this.processing = false; 
      } else {
        this.messageClass = 'alert alert-success'; 
        this.message = data.message; 
        setTimeout(() => {
          this.router.navigate(['/fanfics']); 
        }, 2000);
      }
    });

  }

  goBack() {
  	this.location.back();
  }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.fanficsService.getSingleFanfic(this.currentUrl.id).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = 'Fanfic not found.'; 
      } else {
        this.fanfic = data.fanfic;
        this.loading = false; 
      }
    });
  }

}
