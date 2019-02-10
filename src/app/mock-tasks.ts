import { Task } from './task';

export const TASKS: Task[] = [
  { id: 11, name: '----clean bathroom', days: 1, next: [1527544800000]},
  { id: 12, name: 'clean stove', days: 1, done: 1527544800000, next: [1527631200000] },
  { id: 13, name: 'change toothbrush', days: 8, done: 1527544800000,  next: [1528581600000]},
  { id: 14, name: 'dust', days: 1, next: [1527285600000]},
  { id: 15, name: 'wash the floor', days: 12, next: [1529964000000] },
  { id: 16, name: 'wash the refrigerator', days: 30, next: [1522015200000]},
  { id: 17, name: 'wash the windows', days: 10, next:  [1527890400000]},
  { id: 18, name: 'change filter', days: 10, next: [1535148000000] },
  { id: 19, name: 'change towels', days: 10, next: [1532469600000] },
  { id: 20, name: 'change bed linen', days: 10, next: [1528149600000]}
];
