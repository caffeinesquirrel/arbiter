import { Component, OnInit } from '@angular/core';
import { Task } from '../task';
import { TaskService } from '../task.service';
import { isToday, startOfToday, isTomorrow, endOfTomorrow, endOfDay, addWeeks } from 'date-fns';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  tasks: Task[];
  today: Task[] = [];
  overdue: Task[] = [];
  tomorrow: Task[] = [];
  nextWeek: Task[] = [];
  others: Task[] = [];
  
  constructor(
    private taskService: TaskService,) { 
    this.taskService.data$.subscribe(data => {
      this.getTasks(data.tasks);
    })
  }

  getTasks(tasks: Task[]): void {
    const nextWeek = endOfDay(addWeeks(Date.now(), 1));
    this.today = tasks.filter( task => isToday(task.next));
    this.overdue = tasks.filter( task => new Date(task.next) < startOfToday());
    this.tomorrow = tasks.filter( task => isTomorrow(task.next));
    this.nextWeek = tasks
      .filter( task => new Date(task.next) > endOfTomorrow() && new Date(task.next) <= nextWeek);
    this.others =  tasks.filter( task => new Date(task.next) > nextWeek);

  }
}
