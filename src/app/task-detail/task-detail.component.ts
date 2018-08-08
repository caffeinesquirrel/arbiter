import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../task';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../task.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
  @Input() task: Task;
  newTask = false;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getTask();
  }

  getTask(): void {
    const id = +this.route.snapshot.paramMap.get('id');

    if (id) {
      this.taskService.getTask(id)
        .subscribe(task => this.task = task);
    } else {
      this.newTask = true;
      this.task = new Task();
    }
  }

  goBack(): void {
    this.location.back();
  }
}
