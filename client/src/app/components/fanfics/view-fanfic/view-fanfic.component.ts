import { Component, OnInit } from '@angular/core';
import { FanficsService } from '../../../services/fanfics.service';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(
  	private fanficsService: FanficsService,
  	private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

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
