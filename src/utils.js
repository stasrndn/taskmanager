import dayjs from 'dayjs';

/**
 * Генерирует случайное целое число
 * @param a
 * @param b
 * @returns {number}
 */
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

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

export {getRandomInteger, humanizeTaskDueDate, isTaskExpired};
