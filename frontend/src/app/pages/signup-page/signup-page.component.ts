import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent {
  constructor(private authService: AuthService, private router: Router) { }
  
  onSignupButtonClicked(name: string, username: string, password: string) {
    this.authService.signup(name, username, password).subscribe((response) => {
      if (response.status === 200){
        this.router.navigate(['/lists'])
      }
    })
  }
}
