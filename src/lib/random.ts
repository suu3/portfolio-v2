export const getRandomIntegerInRange = (start: number, end: number) => {
  return Math.floor(Math.random() * (end - start) + start);
};
