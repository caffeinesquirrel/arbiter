import { Component, OnInit } from '@angular/core';
import { Task } from '../task';
import { TaskService } from '../task.service';
import { isToday, startOfToday, isTomorrow, endOfTomorrow, endOfDay, addWeeks } from 'date-fns';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  today: Task[] = [];
  overdue: Task[] = [];
  tomorrow: Task[] = [];
  nextWeek: Task[] = [];
  others: Task[] = [];

  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.getTasks();
  }

  getTasks(): void {
    this.taskService.getTasks()
      .subscribe(tasks => {
        const nextWeek = endOfDay(addWeeks(Date.now(), 1));
        this.today = tasks.filter( task => isToday(task.next));
        this.overdue = tasks.filter( task => new Date(task.next) < startOfToday());
        this.tomorrow = tasks.filter( task => isTomorrow(task.next));
        this.nextWeek = tasks
          .filter( task => new Date(task.next) > endOfTomorrow() && new Date(task.next) <= nextWeek);
        this.others =  tasks.filter( task => new Date(task.next) > nextWeek);
      });
  }

  addTask() {
    // this.taskService.addTask
    // const id = Date.now();
    // this.tasks.push({
    //   id,
    //   name: ''
    // });
    // this.router.navigate([`/detail/${id}`]);
  }
}
