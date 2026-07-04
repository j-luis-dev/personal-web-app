import { describe, expect, it } from 'vitest';
import { isFormFieldInput, isHTMLElement, isSubmitButton } from './client-dom';

describe('isHTMLElement', () => {
  it('returns true for HTMLElements and false otherwise', () => {
    const div = document.createElement('div');
    const text = document.createTextNode('hello');

    expect(isHTMLElement(div)).toBe(true);
    expect(isHTMLElement(text)).toBe(false);
    expect(isHTMLElement(null)).toBe(false);
  });
});

describe('isFormFieldInput', () => {
  it('returns true for input and textarea elements', () => {
    const input = document.createElement('input');
    const textarea = document.createElement('textarea');
    const button = document.createElement('button');

    expect(isFormFieldInput(input)).toBe(true);
    expect(isFormFieldInput(textarea)).toBe(true);
    expect(isFormFieldInput(button)).toBe(false);
  });
});

describe('isSubmitButton', () => {
  it('returns true for button elements and false otherwise', () => {
    const button = document.createElement('button');
    const input = document.createElement('input');

    expect(isSubmitButton(button)).toBe(true);
    expect(isSubmitButton(input)).toBe(false);
    expect(isSubmitButton(null)).toBe(false);
  });
});
