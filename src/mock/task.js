import {getRandomInteger} from '../utils.js';
import dayjs from "dayjs";

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
 * Генерирует случайную дату в пределах 2-х недель
 * @returns {null|Date}
 */
const generateDate = () => {
  const isDate = Boolean(getRandomInteger(0, 1));

  if (!isDate) {
    return null;
  }

  const maxDaysGap = 7;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);

  return dayjs().add(daysGap, 'day').toDate();
};

/**
 * Функция для генерации новой задачи
 * @returns {{isArchive: boolean, color: string, dueDate: Date, repeating: {tu: boolean, mo: boolean, su: boolean, th: boolean, fr: boolean, we: boolean, sa: boolean}, description: string, isFavorite: boolean}}
 */
export const generateTask = () => {
  const dueDate = generateDate();

  return {
    description: generateDescription(),
    dueDate,
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
  }
};
