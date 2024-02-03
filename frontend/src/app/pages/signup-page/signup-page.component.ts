import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent {
  constructor(private authService: AuthService, private router: Router) { }

  loading: boolean = false;
  errorMessage: string = '';
  
  onSignupButtonClicked(name: string, username: string, password: string) {
    this.loading = true; 
    this.errorMessage = ''

    this.authService.signup(name, username, password)
    .pipe(
      catchError(error => {
        console.log(error)
        this.errorMessage = error.error.description; 
        console.log(this.errorMessage)
        return of(null);
      }),
      finalize(() => {
        this.loading = false; 
      })
      )
      .subscribe((response:  HttpResponse<any> | null) => {
      if (response && response.status === 200){
        this.router.navigate(['/lists'])
      }
    })
  }

  closeError() {
    this.errorMessage = ''; 
  }
}
