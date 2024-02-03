import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.scss']
})
export class NewListComponent implements OnInit{

  constructor(private taskService: TaskService, private router: Router) { }
  loading: boolean = false;
  errorMessage: string = '';
  
  ngOnInit() {
      
  }

  createList(title: string) {
    this.taskService.createList(title)
    .pipe(
      catchError(error => {
        this.errorMessage = error.error.description;
        console.log(this.errorMessage)
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
      })
      )
      .subscribe((response: any) => {
        if (response) {
          this.router.navigate(['/lists', response.list_id])
        }
      
    })
  }

  closeError() {
    this.errorMessage = '';
  }

}
