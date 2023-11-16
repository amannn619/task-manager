import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent implements OnInit{

  selectedListId!: string;
  taskId!: string;
  
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
    this.taskService.updateTask(this.taskId, task).subscribe((response) => {
      this.router.navigate(['/lists', this.selectedListId])
    })
  }
}
