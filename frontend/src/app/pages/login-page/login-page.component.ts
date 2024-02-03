import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {

  loading: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }
  
  onLoginButtonClicked(username: string, password: string) {
    this.loading = true; 
    this.errorMessage = ''

    this.authService.login(username, password)
    .pipe(
    catchError(error => {
      this.errorMessage = error.error.description; 
      return of(null); 
    }),
    finalize(() => {
      this.loading = false; 
    })
    )
      .subscribe((response: HttpResponse<any> | null) => {
        if (response && response.status === 200) {
        this.router.navigate(['/lists'])
      }
    })
  }

  closeError() {
    this.errorMessage = ''; 
  }
}
