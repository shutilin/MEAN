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

}
