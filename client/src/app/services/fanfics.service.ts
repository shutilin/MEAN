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

  // Function to create headers, add token, to be used in HTTP requests
  createAuthenticationHeaders() {
    this.authService.loadToken(); // Get token so it can be attached to headers
    // Headers configuration options
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // Format set to JSON
        'authorization': this.authService.authToken // Attach token
      })
    });
  }

  // Function to create a new blog post
  newFanfic(fanfic) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.post(this.domain + 'fanfics/newFanfic', fanfic, this.options).map(res => res.json());
  }

  getAllFanfics() {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'fanfics/allFanfics', this.options).map(res => res.json());
  }

  getSingleFanfic(id) {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain +'fanfics/singleFanfic/' + id, this.options).map(res => res.json());
  }

   editFanfic(fanfic) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.put(this.domain + 'fanfics/updateFanfic/', fanfic, this.options).map(res => res.json());
  }

  deleteFanfic(id) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.delete(this.domain + 'fanfics/deleteFanfic/' + id, this.options).map(res => res.json());
  }

  likeFanfic(id) {
    const fanficData = { id: id };
    return this.http.put(this.domain + 'fanfics/likeFanfic/', fanficData, this.options).map(res => res.json());
  }

}
