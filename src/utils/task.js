import dayjs from 'dayjs';

/**
 * Форматирование даты по шаблону
 * @param dueDate
 * @returns {string}
 */
const humanizeTaskDueDate = (dueDate) => dayjs(dueDate).format('D MMMM');

/**
 * Определяет просрочена ли задача
 * @param dueDate
 * @returns {boolean}
 */
const isTaskExpired = (dueDate) => dueDate && dayjs().isAfter(dueDate, 'D');

/**
 * Определяет, повторяющаяся ли задача
 * @param repeating
 * @returns {boolean}
 */
const isTaskRepeating = (repeating) => Object.values(repeating).some(Boolean);

/**
 * Проверяет, подходит ли дата просрочки сегодня
 * @param dueDate
 * @returns {boolean}
 */
const isTaskExpiringToday = (dueDate) => dueDate && dayjs(dueDate).isSame(dayjs(), 'D');

/**
 * Функция помещает задачи без даты в конце списка,
 * возвращая нужный вес для колбэка sort
 * @param dateA
 * @param dateB
 * @returns {null|number}
 */
const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

/**
 * Сортировка по возрастанию
 * @param taskA
 * @param taskB
 * @returns {number|number}
 */
const sortTaskUp = (taskA, taskB) => {
  const weight = getWeightForNullDate(taskA.dueDate, taskB.dueDate);

  return weight ?? dayjs(taskA.dueDate).diff(dayjs(taskB.dueDate));
};

/**
 * Сортировка по убыванию
 * @param taskA
 * @param taskB
 * @returns {number|number}
 */
const sortTaskDown = (taskA, taskB) => {
  const weight = getWeightForNullDate(taskA.dueDate, taskB.dueDate);

  return weight ?? dayjs(taskB.dueDate).diff(dayjs(taskA.dueDate));
};

export {
  humanizeTaskDueDate,
  isTaskExpired,
  isTaskRepeating,
  isTaskExpiringToday,
  sortTaskUp,
  sortTaskDown,
};
