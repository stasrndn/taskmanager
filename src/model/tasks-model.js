import {generateTask} from '../mock/task.js';

/**
 * Модель рыба для списка задач
 */
export default class TasksModel {
  tasks = Array.from({length: 3}, generateTask);

  getTasks = () => this.tasks;
}
