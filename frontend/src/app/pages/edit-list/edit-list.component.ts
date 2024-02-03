import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.scss']
})
export class EditListComponent implements OnInit{

  selectedListId! : string;
  loading: boolean = false;
  errorMessage: string = '';
  
  constructor(private route: ActivatedRoute, private taskService: TaskService, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.selectedListId = params['listId'];   
      }
    )
  }

  updateList(title: string) {
    this.taskService.updateList(this.selectedListId, title)
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
