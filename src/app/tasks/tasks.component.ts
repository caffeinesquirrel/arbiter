import {Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { isToday } from 'date-fns';


import { Task } from '../task';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  @Input() tasks: Task[];

  constructor(public router: Router,
              private taskService: TaskService) { }

  ngOnInit() {
    console.log('tasks', this.tasks);
  }

  addTask() {
    const id = Date.now();
    this.tasks.push({
      id,
      name: ''
    });
    this.router.navigate([`/detail/${id}`]);
  }

  taskDone(task: Task) {
    this.taskService.doneTask(task.id);
  }
  
  checkDone(task: any): Boolean {
    return isToday(task.fact[task.fact.length - 1]);
  }
}
