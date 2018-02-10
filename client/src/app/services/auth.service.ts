import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {

	domain = "http://localhost:8080";
	authToken;
	user;
	options;
	
	constructor(
		private http: Http
		) { }

	createAuthenticationHeaders() {
		this.loadToken(); // Get token so it can be attached to headers
    // Headers configuration options
    	this.options = new RequestOptions({
    	 	headers: new Headers({
        		'Content-Type': 'application/json', // Format set to JSON
                'authorization': this.authToken // Attach token
      		})
    	});
	}

	loadToken() {
		this.authToken = localStorage.getItem('token');
	}

	registerUser(user) {
		return this.http.post(this.domain + '/authentication/register', user).map(res => res.json());
	}

	checkUsername(username) {
		return this.http.get(this.domain + '/authentication/checkUsername/' + username).map(res => res.json());
	}

  // Function to check if e-mail is taken
	checkEmail(email) {
	 	return this.http.get(this.domain + '/authentication/checkEmail/' + email).map(res => res.json());
    }

    login(user) {
    	return this.http.post(this.domain + '/authentication/login', user).map(res => res.json());
  	}

  	logout() {
  		this.authToken = null;
  		this.user = null;
  		localStorage.clear();
  	}

    storeUserData(token, user) {
    	localStorage.setItem('token', token); // Set token in local storage
   		localStorage.setItem('user', JSON.stringify(user)); // Set user in local storage as string
   		this.authToken = token; // Assign token to be used elsewhere
    	this.user = user; // Set user to be used elsewhere
    }

    getProfile() {
    	this.createAuthenticationHeaders(); // Create headers before sending to API
   		return this.http.get(this.domain + '/authentication/profile', this.options).map(res => res.json());
    }

    loggedIn() {
   		return tokenNotExpired();
  	}
}
