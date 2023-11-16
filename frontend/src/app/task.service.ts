import { WebrequestService } from './webrequest.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private webReqService: WebrequestService) { }

  createList(title: string) {
    return this.webReqService.post('addList', { title })
  }

  getLists() {
    return this.webReqService.post('getList', {})
  }

  createTask(listId: number, task: string) {
    return this.webReqService.post('addTask', {list_id: listId, task: task})
  }

  getTasks(listId: number) {
    return this.webReqService.post('getTasks', { list_id: listId })
  }

  completeTask(task_id : string) {
    return this.webReqService.post('completeTask', {task_id : task_id})
  }

  restartTask(task_id : string) {
    return this.webReqService.post('restartTask', {task_id : task_id})
  }
  
  updateList(list_id: string, title: string) {
    return this.webReqService.post('updateList', {list_id: list_id, title: title})
  }

  deleteList(list_id: string) {
    return this.webReqService.post('deleteList', {list_id: list_id})
  }

  updateTask(task_id: string, task: string) {
    return this.webReqService.post('updateTask', {task_id: task_id, task: task})
  }

  deleteTask(task_id: string) {
    return this.webReqService.post('deleteTask', {task_id: task_id})
  }
}
