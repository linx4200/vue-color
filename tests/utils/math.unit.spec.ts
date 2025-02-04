import { describe, it, expect } from 'vitest';
import { getFractionDigit, clamp } from '../../src/utils/math';

describe('getFractionDigit', () => {
  it('should return 0 for integer values', () => {
    expect(getFractionDigit(10)).toBe(0);
    expect(getFractionDigit('100')).toBe(0);
  });

  it('should return correct fraction digit count', () => {
    expect(getFractionDigit(10.5)).toBe(1);
    expect(getFractionDigit('3.1415')).toBe(4);
    expect(getFractionDigit(0.123456)).toBe(6);
  });
});

describe('clamp', () => {
  it('should return the value itself if it is within range', () => {
    expect(clamp(5, 1, 10)).toBe(5);
    expect(clamp(10, 0, 20)).toBe(10);
  });

  it('should return min if value is less than min', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(1, 5, 15)).toBe(5);
  });

  it('should return max if value is greater than max', () => {
    expect(clamp(50, 0, 10)).toBe(10);
    expect(clamp(100, 30, 80)).toBe(80);
  });
});