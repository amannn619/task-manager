import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit{

  listId: string = '';
  loading: boolean = false;
  errorMessage: string = '';

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(){
    this.route.params.subscribe(
      (params: Params) => {
        this.listId = params['listId']
      })
  }

  createTask(title: string) {
    if (!isNaN(parseInt(this.listId))) {
      this.taskService.createTask(parseInt(this.listId), title)
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
            this.router.navigate(["../"], { relativeTo: this.route })
          }
      })
    }
  }

  closeError() {
    this.errorMessage = ''; 
  }
}
