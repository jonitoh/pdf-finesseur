export function normalizePercentage(percentage: number): number {
  if (percentage <= 0) {
    return 0;
  }
  if (percentage >= 100) {
    return 100;
  }
  return percentage;
}

export function generateInnerText(percentage: number): string {
  if (percentage < 100) {
    return '...Loading';
  }
  return 'Completed';
}

export function generateDynamicColorClass(percentage: number): string {
  if (percentage <= 25) {
    return 'stroke-good-level';
  }
  if (percentage >= 75) {
    return 'stroke-wrong-level';
  }
  return 'stroke-alright-level';
}

export type FileProgress = {
  percentage: number;
  state: 'initial' | 'loading' | 'success' | 'failure';
  filename: string;
};
