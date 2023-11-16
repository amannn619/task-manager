import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { TaskService } from './../../task.service';
import { Component, OnInit } from '@angular/core';
import { Task } from 'src/app/models/task.model';
import { List } from 'src/app/models/list.model';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit{

  lists: List[] = [];
  tasks: Task[] | undefined;
  selectedListId!: string;

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router, private authService: AuthService) { }
  
  ngOnInit() {
    
    this.route.params.subscribe(
      (params: Params) => {
        if (!isNaN(parseInt(params['listId']))){
          this.selectedListId = params['listId'];
          this.taskService.getTasks(params['listId']).subscribe((response: any) => {
          this.tasks = response;
        })}
        else {
          this.tasks = undefined
        }
      }
    )
    
    this.taskService.getLists().subscribe((response: any) => {
      this.lists = response;
      
      // console.log(this.lists);
    })
  }

  onTaskClick(task: Task) {
    if (task.completed) {
      this.taskService.restartTask(task.task_id).subscribe((response: any) => {
        task.completed = false;
        // console.log(task)
      })
    }
    else {
      this.taskService.completeTask(task.task_id).subscribe((response: any) => {
        task.completed = true
        // console.log(task)
      })
    }
    
  }

  onDeleteListClick() {
    this.taskService.deleteList(this.selectedListId).subscribe((response: any) => {
      this.router.navigate(['/lists'])
      console.log(response)
    })
  }
  
  onDeleteTaskClick(taskId: string) {
    console.log(taskId)
    this.taskService.deleteTask(taskId).subscribe((response) => {
      console.log(response)
    })
  }

  logoutButtonClick() {
    this.authService.logout();
  }
  
} 
