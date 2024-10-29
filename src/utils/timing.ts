export const daysSince = (start: Date, end: Date): number =>
  Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
