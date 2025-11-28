import { LifeCycleStage } from '../types';

export const getAgeDetails = (birthDateStr: string) => {
  const birthDate = new Date(birthDateStr);
  const today = new Date();

  let ageYears = today.getFullYear() - birthDate.getFullYear();
  let ageMonths = today.getMonth() - birthDate.getMonth();

  if (ageMonths < 0 || (ageMonths === 0 && today.getDate() < birthDate.getDate())) {
    ageYears--;
    ageMonths += 12;
  }

  // Logic adjustment for months if day hasn't passed
  if (today.getDate() < birthDate.getDate()) {
    ageMonths--;
  }

  // Normalize negative months if specific day calculation skewed it
  if (ageMonths < 0) {
    ageMonths += 12;
  }

  return { years: ageYears, months: ageMonths };
};

export const getLifeCycleStage = (birthDateStr: string): LifeCycleStage => {
  const { years } = getAgeDetails(birthDateStr);

  if (years < 1) return 'KITTEN';
  if (years >= 7) return 'SENIOR';
  return 'ADULT';
};

export const getStageColor = (stage: LifeCycleStage): string => {
  switch (stage) {
    case 'KITTEN': return 'text-pink-500';
    case 'ADULT': return 'text-primary';
    case 'SENIOR': return 'text-purple-500';
    default: return 'text-gray-500';
  }
};

export const getNextVaccineInfo = (birthDateStr: string) => {
  const birthDate = new Date(birthDateStr);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - birthDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const ageWeeks = diffDays / 7;

  let nextDate = new Date(birthDate);
  let title = '';

  if (ageWeeks < 9) {
    // 1st Round: ~8-9 weeks
    nextDate.setDate(birthDate.getDate() + (8 * 7));
    title = '1차 종합백신';
  } else if (ageWeeks < 13) {
    // 2nd Round: ~12-13 weeks
    nextDate.setDate(birthDate.getDate() + (12 * 7));
    title = '2차 종합백신';
  } else if (ageWeeks < 17) {
    // 3rd Round: ~16-17 weeks
    nextDate.setDate(birthDate.getDate() + (16 * 7));
    title = '3차 종합백신';
  } else {
    return null; // Basic series completed
  }

  const dDayTime = nextDate.getTime() - today.getTime();
  const dDay = Math.ceil(dDayTime / (1000 * 60 * 60 * 24));

  return {
    title,
    date: nextDate.toISOString().split('T')[0],
    dDay
  };
};
