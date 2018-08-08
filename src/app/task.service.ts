import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import { addDays } from 'date-fns';


import { Task } from './task';
import { TASKS } from './mock-tasks';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  tasks$ = new BehaviorSubject(TASKS);

  constructor(private messageService: MessageService) { }

  getTasks(): Observable<Task[]> {
    this.messageService.add('TasksService: fetched tasks');
    return this.tasks$;
    // return of(TASKS);
  }

  getTask(id: number): Observable<Task> {
    // TODO: send the message _after_ fetching the task
    this.messageService.add(`TaskService: fetched task id=${id}`);
    return of(TASKS.find(task => task.id === id));
  }

  doneTask(id: number): void {
    const currentTask = TASKS.find(task => task.id === id);
    currentTask.next = +addDays(Date.now(), currentTask.days);
    currentTask.done = Date.now();

    this.tasks$.next(TASKS);
  }
}
