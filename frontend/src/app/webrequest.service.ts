import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class WebrequestService {

  readonly ROOT_URL;

  constructor(private http: HttpClient) { 
    this.ROOT_URL = "https://task-manager-brown-ten.vercel.app";
    // this.ROOT_URL = "http://127.0.0.1:5000";
  }

  get(uri : string) {
    return this.http.get(`${this.ROOT_URL}/${uri}`);
  }
  post(uri: string, payload: object) {
    return this.http.post(`${this.ROOT_URL}/${uri}`, payload)
  }
  login(username: string, password: string) {
    return this.http.post(`${this.ROOT_URL}/login`, {
      username : username, password: password
    }, {
      observe: 'response'
    })
  }
  signup(name: string, username: string, password: string) {
    return this.http.post(`${this.ROOT_URL}/signup`, {
      name: name, username : username, password: password
    }, {
      observe: 'response'
    })
  }
}
