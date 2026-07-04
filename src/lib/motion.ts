export function clampHandoff(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

export function smoothHandoff(t: number): number {
  return t * t * (3 - 2 * t);
}
