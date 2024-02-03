import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent implements OnInit{

  selectedListId!: string;
  taskId!: string;
  loading: boolean = false;
  errorMessage: string = '';
  
  constructor(private route: ActivatedRoute, private taskService: TaskService, private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.selectedListId = params['listId'];   
        this.taskId = params['taskId']
      }
    )
  }
  updateTask(task: string) {
    this.taskService.updateTask(this.taskId, task)
    .pipe(
      catchError(error => {
        this.errorMessage = error.error.description; 
        return of(null); 
      }),
      finalize(() => {
        this.loading = false; 
      })
      )
      .subscribe((response) => {
        if (response) {
          this.router.navigate(['/lists', this.selectedListId])
        }
    })
  }

  closeError() {
    this.errorMessage = '';
  }
}
