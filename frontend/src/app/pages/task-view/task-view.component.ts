import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { TaskService } from './../../task.service';
import { Component, OnInit } from '@angular/core';
import { Task } from 'src/app/models/task.model';
import { List } from 'src/app/models/list.model';
import { AuthService } from 'src/app/auth.service';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit{

  lists: List[] = [];
  tasks: Task[] | undefined;
  selectedListId!: string;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router, private authService: AuthService) { }
  
  ngOnInit() {
    this.loading = true;  
    this.errorMessage = ''
    this.route.params
    .subscribe(
      (params: Params) => {
        if (!isNaN(parseInt(params['listId']))){
          this.selectedListId = params['listId'];
          this.taskService.getTasks(params['listId'])
            .subscribe((response: any) => {
              this.tasks = response;
            })}
        else {
          this.tasks = undefined
        }
      }
    )
    
    this.taskService.getLists()
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
      this.lists = response;
      
    })
  }

  onTaskClick(task: Task) {
    this.loading = true;
    if (task.completed) {
      this.taskService.restartTask(task.task_id)
        .subscribe((response: any) => {
        this.loading = false;
        task.completed = false;
      })
    }
    else {
      this.taskService.completeTask(task.task_id).subscribe((response: any) => {
        task.completed = true
        this.loading = false;
      })
    }
  }

  onDeleteListClick() {
    this.taskService.deleteList(this.selectedListId).subscribe((response: any) => {
      this.router.navigate(['/lists'])
      console.log("delete List")
    })
  }
  
  onDeleteTaskClick(taskId: string) {
    console.log(taskId)
    this.taskService.deleteTask(taskId).subscribe((response) => {
      console.log(response)
      this.tasks = this.tasks?.filter(task => task.task_id !== taskId)
    })
  }

  logoutButtonClick() {
    this.authService.logout();
  }

  closeError() {
    this.errorMessage = ''; 
  }
  
} 
