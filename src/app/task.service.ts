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

  addTask(task: Task, next: number): void {
    TASKS.push({
      id: Date.now(),
      name: task.name,
      days: task.days, 
      next,
    });
  }

  updateTask(task: Task, next: number): void {
    const el = TASKS.find(task => task.id === task.id);
    el.name = task.name;
    el.days = task.days;
    el.next = next;
  }

  deleteTask(id: number): void {
    const el = TASKS.find(task => task.id === id);
    const index = TASKS.indexOf(el);
    TASKS.splice(index, 1);
  }
}
