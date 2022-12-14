import {render, RenderPosition, remove} from '../framework/render.js';
import BoardView from '../view/board-view.js';
import SortView from '../view/sort-view.js';
import TaskListView from '../view/task-list-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import NoTaskView from '../view/no-task-view.js';
import TaskPresenter from './task-presenter.js';
import TaskNewPresenter from './task-new-presenter.js';
import {sortTaskUp, sortTaskDown} from '../utils/task.js';
import {filter} from '../utils/filter.js';
import {SortType, UpdateType, UserAction, FilterType} from '../const.js';

const TASK_COUNT_PER_STEP = 8;

export default class BoardPresenter {
  #boardContainer = null;
  #tasksModel = null;
  #filterModel = null;

  #boardComponent = new BoardView();
  #taskListComponent = new TaskListView();
  #noTaskComponent = null;
  #sortComponent = null;
  #loadMoreButtonComponent = null;

  #renderedTaskCount = TASK_COUNT_PER_STEP;
  #taskPresenter = new Map();
  #taskNewPresenter = null;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;

  constructor(boardContainer, tasksModel, filterModel) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;
    this.#filterModel = filterModel;

    this.#taskNewPresenter = new TaskNewPresenter(this.#taskListComponent.element, this.#handleViewAction);

    this.#tasksModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get tasks() {
    this.#filterType = this.#filterModel.filter;
    const tasks = this.#tasksModel.tasks;
    const filteredTasks = filter[this.#filterType](tasks);

    switch (this.#currentSortType) {
      case SortType.DATE_UP:
        return filteredTasks.sort(sortTaskUp);
      case SortType.DATE_DOWN:
        return filteredTasks.sort(sortTaskDown);
    }

    return filteredTasks;
  }

  init = () => {
    this.#renderBoard();
  };

  createTask = (callback) => {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
    this.#taskNewPresenter.init(callback);
  };

  #handleLoadMoreButtonClick = () => {
    const taskCount = this.tasks.length;
    const newRenderedTaskCount = Math.min(taskCount, this.#renderedTaskCount + TASK_COUNT_PER_STEP);
    const tasks = this.tasks.slice(this.#renderedTaskCount, newRenderedTaskCount);

    this.#renderTasks(tasks);
    this.#renderedTaskCount = newRenderedTaskCount;

    if (this.#renderedTaskCount >= taskCount) {
      remove(this.#loadMoreButtonComponent);
    }
  };

  #handleModeChange = () => {
    this.#taskNewPresenter.destroy();
    this.#taskPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_TASK:
        this.#tasksModel.updateTask(updateType, update);
        break;
      case UserAction.ADD_TASK:
        this.#tasksModel.addTask(updateType, update);
        break;
      case UserAction.DELETE_TASK:
        this.#tasksModel.deleteTask(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#taskPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedTaskCount: true, resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard({resetRenderedTaskCount: true});
    this.#renderBoard();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#sortComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderTask = (task) => {
    const taskPresenter = new TaskPresenter(this.#taskListComponent.element, this.#handleViewAction, this.#handleModeChange);
    taskPresenter.init(task);
    this.#taskPresenter.set(task.id, taskPresenter);
  };

  #renderTasks = (tasks) => {
    tasks.forEach((task) => this.#renderTask(task));
  };

  #renderNoTasks = () => {
    this.#noTaskComponent = new NoTaskView(this.#filterType);
    render(this.#noTaskComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderLoadMoreButton = () => {
    this.#loadMoreButtonComponent = new LoadMoreButtonView();
    this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreButtonClick);

    render(this.#loadMoreButtonComponent, this.#boardComponent.element);
  };

  #clearBoard = ({resetRenderedTaskCount = false, resetSortType = false} = {}) => {
    const taskCount = this.tasks.length;

    this.#taskNewPresenter.destroy();
    this.#taskPresenter.forEach((presenter) => presenter.destroy());
    this.#taskPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadMoreButtonComponent);

    if (this.#noTaskComponent) {
      remove(this.#noTaskComponent);
    }

    if (resetRenderedTaskCount) {
      this.#renderedTaskCount = TASK_COUNT_PER_STEP;
    } else {
      // ???? ????????????, ???????? ?????????????????????? ?????????? ??????????????
      // ?????????????????????? ???????????????????? ?????????? (????????????????, ???????????????? ?????? ?????????????? ?? ??????????)
      // ?????????? ?????????????????????????????? ?????????? ???????????????????? ??????????
      this.#renderedTaskCount = Math.min(taskCount, this.#renderedTaskCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderBoard = () => {
    const tasks = this.tasks;
    const taskCount = tasks.length;

    render(this.#boardComponent, this.#boardContainer);

    if (taskCount === 0) {
      this.#renderNoTasks();
      return;
    }

    this.#renderSort();
    render(this.#taskListComponent, this.#boardComponent.element);

    // ????????????, ?????????? #renderBoard ???????????????? ?????????? ???? ???????????? ???? ????????????,
    // ???? ?? ???? ???????? ???????????? ????????????????????, ?????????? ????????????????
    // ?????????????????? TASK_COUNT_PER_STEP ???? ???????????????? #renderedTaskCount,
    // ?????????? ?? ???????????? ?????????????????????? ?????????????????? N-???????????????????? ????????????????
    this.#renderTasks(tasks.slice(0, Math.min(taskCount, this.#renderedTaskCount)));

    if (taskCount > this.#renderedTaskCount) {
      this.#renderLoadMoreButton();
    }
  };
}
