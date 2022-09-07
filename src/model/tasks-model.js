import {generateTask} from '../mock/task.js';

/**
 * Модель рыба для списка задач
 */
export default class TasksModel {
  #tasks = Array.from({length: 22}, generateTask);

  get tasks() {
    return this.#tasks;
  }
}
