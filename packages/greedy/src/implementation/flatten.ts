export const flatten = <T>(arr: T[][]): T[] => {
  const result = <T[]>[];
  arr.forEach(subArr => result.push(...subArr));
  return result;
};
