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

export {
  humanizeTaskDueDate,
  isTaskExpired,
  isTaskRepeating,
};
