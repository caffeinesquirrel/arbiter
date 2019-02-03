import { Injectable } from '@angular/core';
import * as LocalForage from 'localforage'
import {BehaviorSubject, Observable, of} from 'rxjs';
import { addDays } from 'date-fns';
import { Task } from './task';
import { TASKS } from './mock-tasks';
import { MessageService } from './message.service';


LocalForage.setDriver([LocalForage.INDEXEDDB, LocalForage.WEBSQL, LocalForage.LOCALSTORAGE])
LocalForage.config({
  // driver      : localforage.WEBSQL, // Force WebSQL same as using setDriver()
  name: 'arbitor',
  version: 1.0,
  // size        : 4980736, // Size of database, in bytes. WebSQL-only for now.
  storeName: 'arbitor',
  // description : 'some description'
})

export interface AppData {
  tasks: Task[],
}

const DATA_KEY = 'data'
const defaultDataState: AppData = {
  tasks: [],
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private _data: AppData = {...defaultDataState}
  private _data$ = new BehaviorSubject<AppData>(this._data)

  tasks$ = new BehaviorSubject(TASKS);

  constructor(private messageService: MessageService) {
    this.updateData()
   }

  updateData() {
    return this.loadData()
    .then(data => {
      this._data = data,
      this._data$.next(this._data)
      return this._data
    })
  }

  loadData(): Promise<AppData> {
    return LocalForage.getItem(DATA_KEY)
    .then(data => data as AppData || {...defaultDataState})
    .catch(function (err) {
      console.error('data reading', err)
      return {...defaultDataState}
    })
  }

  saveData(data: AppData): Promise<AppData> {
    return LocalForage.setItem(DATA_KEY, data)
    .then(data => this.updateData())
  }

  get data$() {
    return this._data$.asObservable()
  }

  addTask(newTask): Promise<AppData> {
    return this.loadData()
    .then(data => ({
      ...data,
      tasks: [...data.tasks, newTask],
    }))
    .then(data => this.saveData(data))
  }

  updateTask(task: Task): Promise<AppData>  {
    // const el = TASKS.find(task => task.id === task.id);
    // el.name = task.name;
    // el.days = task.days;
    // el.next = next;

    return this.loadData()
    .then(data => ({
      ...data,
      tasks: data.tasks.map(item => 
        item.id === task.id ? task : item),
    }))
    .then(data => this.saveData(data))
  }

  removeTask(taskId): Promise<AppData> {
    return this.loadData()
    .then(data => ({
      ...data,
      tasks: data.tasks.filter(s => s.id !== taskId),
    }))
    .then(data => this.saveData(data))
  }

  doneTask(id: number): void {
    const currentTask = this._data.tasks.find(task => task.id === id);
    currentTask.next = +addDays(Date.now(), currentTask.days);
    currentTask.done = Date.now();

    this._data$.next(this._data);
  }
}
