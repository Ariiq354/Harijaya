import { clsx, type ClassValue } from 'clsx';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
  y?: number;
  x?: number;
  start?: number;
  duration?: number;
};

export const flyAndScale = (
  node: Element,
  params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
  const style = getComputedStyle(node);
  const transform = style.transform === 'none' ? '' : style.transform;

  const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
    const [minA, maxA] = scaleA;
    const [minB, maxB] = scaleB;

    const percentage = (valueA - minA) / (maxA - minA);
    const valueB = percentage * (maxB - minB) + minB;

    return valueB;
  };

  const styleToString = (style: Record<string, number | string | undefined>): string => {
    return Object.keys(style).reduce((str, key) => {
      if (style[key] === undefined) return str;
      return str + `${key}:${style[key]};`;
    }, '');
  };

  return {
    duration: params.duration ?? 200,
    delay: 0,
    css: (t) => {
      const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
      const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
      const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

      return styleToString({
        transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        opacity: t
      });
    },
    easing: cubicOut
  };
};

export function getDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so we add 1
  const day = String(currentDate.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

export function getDashedDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so we add 1
  const day = String(currentDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getLastMonths(month: number) {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  const currentMonth = new Date().getMonth(); // 0-11
  const lastFourMonths = [];

  for (let i = 1; i <= month; i++) {
    let monthIndex = currentMonth - i;
    if (monthIndex < 0) {
      monthIndex += 12;
    }
    lastFourMonths.push(monthNames[monthIndex]);
  }

  return lastFourMonths.reverse(); // Optional: reverse to get in chronological order
}

export function getCurrentMonth() {
  const currentDate = new Date();
  return (currentDate.getMonth() + 1).toString().padStart(2, '0');
}

export function getCurrentMonthName() {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  const currentMonth = new Date().getMonth(); // 0-11
  return monthNames[currentMonth];
}

export function getCurrentYear() {
  const currentDate = new Date();
  return currentDate.getFullYear().toString();
}

export function getYears(startYear: number) {
  const currentYear = new Date().getFullYear();
  const yearsArray: number[] = [];

  for (let year = startYear; year <= currentYear; year++) {
    yearsArray.push(year);
  }

  return yearsArray.reverse();
}

export const tipeAkun = [
  'kas & setara kas',
  'piutang usaha',
  'persediaan barang',
  'aktiva tetap',
  'aktiva lainnya',
  'utang usaha',
  'utang lainnya',
  'modal usaha',
  'pendapatan usaha',
  'pendapatan lainnya',
  'biaya usaha',
  'biaya lainnya'
];
