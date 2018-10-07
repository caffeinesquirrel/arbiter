import { Component, Input, OnInit } from '@angular/core';
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
  ) { }

  ngOnInit(): void {
    this.getTask();
  }

  getTask(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.taskService.getTask(id)
        .subscribe((task) => {
          this.task = task;
          this.nextDate = new Date(task.next);
        });
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
      this.taskService.addTask(this.task, this.nextDate.getTime());
    } else {
      this.taskService.updateTask(this.task, this.nextDate.getTime());
    }
  }

  saveAndBack(): void {
    this.save();
    this.goBack();
  } 

  delete(): void {
    this.taskService.deleteTask(this.task.id);
    this.router.navigate([`/dashboard`]);
  }
}
