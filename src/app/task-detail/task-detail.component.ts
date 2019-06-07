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
  today = false;
  days:number;
  
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
        if (this.task) {
          this.nextDate = this.task.plan && new Date(this.task.plan[this.task.plan.length-1]);
          this.today = this.task.fact && isToday(this.task.fact[this.task.fact.length-1]);
          this.days = this.task.days;
        }
      
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
    const nextToSave = this.nextDate.setHours(0,0,0);

    if (this.newTask) {
      const plan = [];
      plan.push(nextToSave);

      const fact = [];
      if (this.today) {
        fact.push(new Date().setHours(0,0,0)); // do I need here 0 0 0 
      }

      this.taskService.addTask({
        id: Date.now(),
        name: this.task.name,
        days: this.days, 
        plan,
        fact,
      });
    } else {
      // plan 
      const oldDays = this.task.days === this.days;
      let plan = [];
      if (nextToSave > this.task.plan[this.task.plan.length-1] && oldDays) {
        plan.push(this.task.plan[this.task.plan.length-1]);
        plan.push(nextToSave);
      } else {
        plan.push(nextToSave);
      }

      // fact
      let fact = this.task.fact;
      if (this.today) {
        fact.push(new Date().setHours(0,0,0)); // do I need here 0 0 0 
      } else if (!this.today && fact && isToday(fact[fact.length-1])) {
        fact.pop();
      }

      this.taskService.updateTask({
        ...this.task, 
        days: this.days,
        fact,
        plan,
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
