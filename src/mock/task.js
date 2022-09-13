import dayjs from "dayjs";
import {nanoid} from 'nanoid';
import {getRandomInteger} from '../utils/common.js';
import {COLORS} from "../const";

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
 * Генерирует набор случайных повторений
 * @returns {{tu: boolean, mo: boolean, su: boolean, th: boolean, fr: boolean, we: boolean, sa: boolean}}
 */
const generateRepeating = () => ({
  mo: false,
  tu: false,
  we: Boolean(getRandomInteger(0, 1)),
  th: false,
  fr: Boolean(getRandomInteger(0, 1)),
  sa: false,
  su: false,
});

/**
 * Генерирует случайный цвет
 * @returns {string}
 */
const getRandomColor = () => {
  const randomIndex = getRandomInteger(0, COLORS.length - 1);

  return COLORS[randomIndex];
};

/**
 * Функция для генерации новой задачи
 * @returns {{isArchive: boolean, color: string, dueDate: Date, repeating: {tu: boolean, mo: boolean, su: boolean, th: boolean, fr: boolean, we: boolean, sa: boolean}, description: string, isFavorite: boolean}}
 */
export const generateTask = () => {
  const dueDate = generateDate();
  const repeating = dueDate === null
    ? generateRepeating()
    : {
      mo: false,
      tu: false,
      we: false,
      th: false,
      fr: false,
      sa: false,
      su: false,
    };

  return {
    id: nanoid(),
    description: generateDescription(),
    dueDate,
    repeating,
    color: getRandomColor(),
    isArchive: Boolean(getRandomInteger(0, 1)),
    isFavorite: Boolean(getRandomInteger(0, 1)),
  }
};
