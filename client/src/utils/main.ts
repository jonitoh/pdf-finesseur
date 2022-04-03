/*
Utilities -- functions and types.
*/
import { v4 as uuidv4 } from 'uuid';
import { CSSProperties } from 'react';

export type EnumLike = Record<string, string>;

// Build resilient ids
function generateStrongId() {
  return uuidv4();
}

function generateWeakId(min: number = 1, max: number = 100) {
  return `${Math.floor(Math.random() * (max - min) + min)}`;
}

// manage data
function dataURLtoFile(dataURL: string, filename: string) {
  // mime extension extraction
  const mimeExtension = dataURL.split(',')[0].split(':')[1].split(';')[0];

  // Extract remaining part of URL and convert it to binary value
  const byteString = window.atob(dataURL.split(',')[1]);

  const blobArray = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i += 1) {
    blobArray[i] = byteString.charCodeAt(i);
  }

  return new File([blobArray], filename, {
    type: mimeExtension,
    lastModified: new Date().getTime(),
  });
}

function range(start: number, end: number, length: number = end - start + 1) {
  return Array.from({ length }, (_, i) => start + i);
}

function addDelay<T extends ((...args: any) => any) | (() => any)>(
  func: T,
  timing: number = 1000
): (...args: Parameters<typeof func>) => Promise<ReturnType<typeof func>> {
  async function delayedFunc(args: Parameters<typeof func>): Promise<ReturnType<typeof func>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(func(args));
      }, timing);
    });
  }
  return delayedFunc;
}

type AsyncReturnType<F extends Function> = F extends (...args: any) => Promise<infer A> ? A : never;

function addAsyncDelay<T extends ((...args: any) => any) | (() => any)>(
  func: T,
  timing: number = 1000
): (...args: Parameters<typeof func>) => Promise<AsyncReturnType<typeof func>> {
  async function delayedFunc(args: Parameters<typeof func>): Promise<AsyncReturnType<typeof func>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(func(args));
      }, timing);
    });
  }
  return delayedFunc;
}

function clearCanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
}

function calculateFlexBasis(flexBasis: CSSProperties['flexBasis']): CSSProperties['flexBasis'] {
  if (window.innerWidth >= 767) {
    return flexBasis;
  }
  if (window.innerWidth >= 480) {
    return '50%';
  }
  return '100%';
}

export {
  generateStrongId,
  generateWeakId,
  dataURLtoFile,
  range,
  addDelay,
  addAsyncDelay,
  clearCanvas,
  calculateFlexBasis,
};
