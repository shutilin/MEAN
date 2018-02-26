import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FanficsService } from '../../services/fanfics.service';
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'


@Component({
  selector: 'app-fanfics',
  templateUrl: './fanfics.component.html',
  styleUrls: ['./fanfics.component.css']
})
export class FanficsComponent implements OnInit {

  username;
  fanficPosts;

  constructor(
    private authService: AuthService,
    private fanficsService: FanficsService
  ) {
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


  isAuthorized() {
    return this.authService.loggedIn();
  }

  ngOnInit() {
  	if (this.isAuthorized()){
        this.authService.getProfile().subscribe(profile => {
        this.username = profile.user.username; 
      });
    }
      this.getAllFanfics();
  }

}
