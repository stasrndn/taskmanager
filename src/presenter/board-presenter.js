import {render, RenderPosition, remove} from '../framework/render.js';
import BoardView from '../view/board-view.js';
import SortView from '../view/sort-view.js';
import TaskListView from '../view/task-list-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import NoTaskView from '../view/no-task-view.js';
import TaskPresenter from './task-presenter.js';
import {updateItem} from '../utils/common.js';

const TASK_COUNT_PER_STEP = 8;

export default class BoardPresenter {
  #boardContainer = null;
  #tasksModel = null;

  #boardComponent = new BoardView();
  #taskListComponent = new TaskListView();
  #sortComponent = new SortView();
  #noTaskComponent = new NoTaskView();
  #loadMoreButtonComponent = new LoadMoreButtonView();

  #boardTasks = [];
  #renderedTaskCount = TASK_COUNT_PER_STEP;
  #taskPresenter = new Map();

  constructor(boardContainer, tasksModel) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;
  }

  init = () => {
    this.#boardTasks = [...this.#tasksModel.tasks];

    this.#renderBoard();
  };

  /**
   * Обработчик кнопки "Показать ещё"
   */
  #handleLoadMoreButtonClick = () => {
    this.#renderTasks(this.#renderedTaskCount, this.#renderedTaskCount + TASK_COUNT_PER_STEP);
    this.#renderedTaskCount += TASK_COUNT_PER_STEP;

    if (this.#renderedTaskCount >= this.#boardTasks.length) {
      remove(this.#loadMoreButtonComponent);
    }
  };

  /**
   * Обработчик изменения задачи
   * @param updatedTask
   */
  #handleTaskChange = (updatedTask) => {
    this.#boardTasks = updateItem(this.#boardTasks, updatedTask);
    this.#taskPresenter.get(updatedTask.id).init(updatedTask);
  };

  /**
   * Отрисовка компонента сортировки
   */
  #renderSort = () => {
    render(this.#sortComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  };

  /**
   * Отрисовка карточки задачи на доске
   * @param task
   */
  #renderTask = (task) => {
    const taskPresenter = new TaskPresenter(this.#taskListComponent.element, this.#handleTaskChange);
    taskPresenter.init(task);
    this.#taskPresenter.set(task.id, taskPresenter);
  };

  /**
   * Отрисовка порции карточек задач на доске
   * @param from
   * @param to
   */
  #renderTasks = (from, to) => {
    this.#boardTasks
      .slice(from, to)
      .forEach((task) => this.#renderTask(task));
  };

  /**
   * Отрисовка сообщения если нет задач
   * для отображения на доске
   */
  #renderNoTasks = () => {
    render(this.#noTaskComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  };

  /**
   * Отрисовка кнопки "Показать ещё"
   * и установка обработчика на эту кнопку
   */
  #renderLoadMoreButton = () => {
    render(this.#loadMoreButtonComponent, this.#boardComponent.element);
    this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreButtonClick);
  };

  /**
   * Очистка доски от карточек задач
   */
  #clearTaskList = () => {
    this.#taskPresenter.forEach((presenter) => presenter.destroy());
    this.#taskPresenter.clear();
    this.#renderedTaskCount = TASK_COUNT_PER_STEP;
    remove(this.#loadMoreButtonComponent);
  };

  /**
   * Отрисовка списка задач
   */
  #renderTaskList = () => {
    render(this.#taskListComponent, this.#boardComponent.element);
    this.#renderTasks(0, Math.min(this.#boardTasks.length, TASK_COUNT_PER_STEP));

    if (this.#boardTasks.length > TASK_COUNT_PER_STEP) {
      this.#renderLoadMoreButton();
    }
  };

  /**
   * Отрисовка доски
   */
  #renderBoard() {
    render(this.#boardComponent, this.#boardContainer);

    if (this.#boardTasks.every((task) => task.isArchive)) {
      this.#renderNoTasks();
      return;
    }

    this.#renderSort();
    this.#renderTaskList();
  };
}
