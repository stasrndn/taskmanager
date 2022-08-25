import {getRandomInteger} from '../utils.js';

/**
 * Получить рандомное описание задачи
 * @returns {string}
 */
const generateDescription = () => {
  const descriptions = [
    'Изучить теорию',
    'Сделать домашку',
    'Пройти интенсив на соточку',
  ];

  const randomIndex = getRandomInteger(0, descriptions.length - 1);

  return descriptions[randomIndex];
};

/**
 * Функция для генерации новой задачи
 * @returns {{isArchive: boolean, color: string, dueDate: null, repeating: {tu: boolean, mo: boolean, su: boolean, th: boolean, fr: boolean, we: boolean, sa: boolean}, description: string, isFavorite: boolean}}
 */
export const generateTask = () => ({
  description: generateDescription(),
  dueDate: null,
  repeating: {
    mo: false,
    tu: false,
    we: false,
    th: false,
    fr: false,
    sa: false,
    su: false,
  },
  color: 'black',
  isArchive: false,
  isFavorite: false,
});
