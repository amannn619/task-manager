import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WebrequestService } from './webrequest.service';
import { Router } from '@angular/router';
import { shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private webReqService: WebrequestService, private router: Router, private http: HttpClient) { }

  signup(name: string, username: string, password: string) {
    return this.webReqService.signup(name, username, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        this.setSession(res.body.user_id, res.headers.get('x-access-token')!, res.headers.get('x-refresh-token')!);
        console.log('SignedUp');
      })
    )
  }

  login(username: string, password: string) {
    return this.webReqService.login(username, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        this.setSession(res.body.user_id, res.headers.get('x-access-token')!, res.headers.get('x-refresh-token')!);
        console.log('LoggedIn')
      })
    )
  }

  getNewAccessToken() {
    return this.http.get(`${this.webReqService.ROOT_URL}/generateAccessToken`, {
      headers: {
      'x-refresh-token': this.getRefreshToken() || '',
      'user-id': this.getUserId() || ''
      },
      observe: 'response'
    })
      .pipe(
      tap((res: HttpResponse<any>) => {
        this.setAccessToken(res.headers.get('x-access-token') || '')
      })
    )
  }

  logout() {
    this.removeSession();
    console.log('LoggedOut');
    this.router.navigateByUrl('/login');
  }

  private setSession(userId: string, accessToken: string, refreshToken: string) {
    localStorage.setItem('user-id', userId);
    localStorage.setItem('access-token', accessToken);
    localStorage.setItem('refresh-token', refreshToken);
  }

  private removeSession() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
  }

  getAccessToken() {
    return localStorage.getItem('access-token')
  }
  getRefreshToken() {
    return localStorage.getItem('refresh-token')
  }
  getUserId() {
    return localStorage.getItem('user-id')
  }
  setAccessToken(accessToken: string) {
    console.log(accessToken)
    return localStorage.setItem('access-token', accessToken)
  }
  
}
