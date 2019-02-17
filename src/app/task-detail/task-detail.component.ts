import { Component, Input, OnInit } from '@angular/core';
import { addDays, isToday } from 'date-fns';
import { Task } from '../task';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../task.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
  @Input() task: Task;
  newTask = false;
  nextDate = new Date();
  
  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private location: Location,
    public router: Router,
  ) { 
  }

  ngOnInit(): void {
    this.getTask();
  }

  getTask(): void {
    const id = +this.route.snapshot.paramMap.get('id');  
    if (id) {
      this.taskService.data$.subscribe(data => {
        this.task = data.tasks.find(task => task.id === id);
        this.nextDate = this.task && new Date(this.task.next[this.task.next.length-1]);
      })
    } else {
      this.newTask = true;
      this.task = new Task();
    }
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.newTask) {
      const next = [];
      next.push(this.nextDate.getTime());
      this.taskService.addTask({
        id: Date.now(),
        name: this.task.name,
        days: this.task.days, 
        next,
      });
    } else {
      const newDate = this.nextDate.setHours(0,0,0);
      const lastNext = this.task.next[(this.task.next.length - 1)]; 
      // this.task.next.push(this.nextDate.setHours(0,0,0));
      this.taskService.updateTask({
        ...this.task, 
        next: this.task.next,
      });
    }
  }

  saveAndBack(): void {
    this.save();
    this.goBack();
  } 

  delete(): void {
    this.taskService.removeTask(this.task.id);
    this.router.navigate([`/dashboard`]);
  }

  onDoneChange(): void {
    if (isToday(this.task.done)) {
      console.log('was true');
      this.task.done = 0;
      this.unDoneTask();
    } else {
      console.log('false');
      this.task.done = new Date().setHours(0,0,0);
      this.doneTask();
    }
  }

  unDoneTask(): void {
    const countOfNext = this.task.next.length;
    if (!this.newTask || countOfNext > 1) {
      console.log('nextDate', new Date(this.task.next[countOfNext - 2]));
     this.nextDate = new Date(this.task.next[countOfNext - 2]);
    }
  }

  doneTask(): void {
    if (!this.newTask) {
      console.log('done task',Date.now() );
      this.nextDate = new Date(addDays(Date.now(), this.task.days).setHours(0,0,0));
    }
  }

  checkDone(): Boolean {
    return isToday(this.task.done);
  }
}
