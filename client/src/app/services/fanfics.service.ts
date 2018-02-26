import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class FanficsService {

  options;
  domain = this.authService.domain;

  constructor(
    private authService: AuthService,
    private http: Http
  ) { }

  
  createAuthenticationHeaders() {
    this.authService.loadToken(); 
    
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', 
        'authorization': this.authService.authToken 
      })
    });
  }

  
  newFanfic(fanfic) {
    this.createAuthenticationHeaders(); 
    return this.http.post(this.domain + 'fanfics/newFanfic', fanfic, this.options).map(res => res.json());
  }

  getAllFanfics() {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'fanfics/allFanfics', this.options).map(res => res.json());
  }

  getUserFanfics(username) {
     this.createAuthenticationHeaders();
     console.log('user fanfics' + username);
    return this.http.get(this.domain + 'fanfics/userFanfics/' + username, this.options).map(res => res.json());
  }

  getSingleFanfic(id) {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain +'fanfics/singleFanfic/' + id, this.options).map(res => res.json());
  }

  editFanfic(fanfic) {
    this.createAuthenticationHeaders(); 
    return this.http.put(this.domain + 'fanfics/updateFanfic/', fanfic, this.options).map(res => res.json());
  }

  deleteFanfic(id) {
    this.createAuthenticationHeaders(); 
    return this.http.delete(this.domain + 'fanfics/deleteFanfic/' + id, this.options).map(res => res.json());
  }

  likeFanfic(id) {
    const fanficData = { id: id };
    return this.http.put(this.domain + 'fanfics/likeFanfic/', fanficData, this.options).map(res => res.json());
  }

  postComment(id, comment) {
    this.createAuthenticationHeaders();
    const fanficData = {
      id: id,
      comment: comment
    }
    return this.http.post(this.domain+ 'fanfics/comment', fanficData, this.options).map(res => res.json);
  }

}
