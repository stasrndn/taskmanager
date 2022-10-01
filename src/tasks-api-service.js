import ApiService from "./framework/api-service.js";

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class TasksApiService extends ApiService {
  /**
   * Метод для получения задач
   * @returns {Promise<Response>}
   */
  get tasks() {
    return this
      ._load({url: 'tasks'})
      .then(ApiService.parseResponse)
  }

  /**
   * Метод для обновления задач
   * @param task
   * @returns {Promise<JSON>}
   */
  updateTask = async (task) => {
    const response = await this._load({
      url: `tasks/${task.id}`,
      method: Method.PUT,
      body: JSON.stringify(task),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  };
}
