import {render, RenderPosition, replace, remove} from "../framework/render.js";
import BoardView from '../view/board-view.js';
import SortView from '../view/sort-view.js';
import TaskListView from '../view/task-list-view.js';
import TaskView from '../view/task-view.js';
import TaskEditView from '../view/task-edit-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import NoTaskView from "../view/no-task-view";

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
    const taskComponent = new TaskView(task);
    const taskEditComponent = new TaskEditView(task);

    const replaceCardToForm = () => {
      replace(taskEditComponent, taskComponent);
    };

    const replaceFormToCard = () => {
      replace(taskComponent, taskEditComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    taskComponent.setEditClickHandler(() => {
      replaceCardToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    taskEditComponent.setFormSubmitHandler(() => {
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(taskComponent, this.#taskListComponent.element);
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
