import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.scss']
})
export class EditListComponent implements OnInit{

  selectedListId! : string;
  
  constructor(private route: ActivatedRoute, private taskService: TaskService, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.selectedListId = params['listId'];   
      }
    )
  }

  updateList(title: string) {
    this.taskService.updateList(this.selectedListId, title).subscribe((response) => {
      this.router.navigate(['/lists', this.selectedListId])
    })
  }
}
