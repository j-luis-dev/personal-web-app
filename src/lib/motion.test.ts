import { describe, expect, it } from 'vitest';
import { clampHandoff, smoothHandoff } from './motion';

describe('clampHandoff', () => {
  it('clamps values below minimum, above maximum, and within range', () => {
    expect(clampHandoff(-1, 0, 1)).toBe(0);
    expect(clampHandoff(2, 0, 1)).toBe(1);
    expect(clampHandoff(0.5, 0, 1)).toBe(0.5);
  });
});

describe('smoothHandoff', () => {
  it('returns 0 and 1 at the endpoints', () => {
    expect(smoothHandoff(0)).toBe(0);
    expect(smoothHandoff(1)).toBe(1);
  });
});
