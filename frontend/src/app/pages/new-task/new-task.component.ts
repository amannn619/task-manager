import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit{

  listId: string = '';

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(){
    this.route.params.subscribe(
      (params: Params) => {
        this.listId = params['listId']
      })
  }

  createTask(title: string) {
    if (!isNaN(parseInt(this.listId))) {
      this.taskService.createTask(parseInt(this.listId), title).subscribe((response: any) => {
        this.router.navigate(["../"], { relativeTo: this.route })
      })
    }
  }
}
