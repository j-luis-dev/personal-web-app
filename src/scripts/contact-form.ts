import { isFormFieldInput, isSubmitButton } from './client-dom.ts';

function validateField(field: Element): boolean {
  const input = field.querySelector('.input, .textarea');
  if (!input || !isFormFieldInput(input)) return true;
  const valid = input.checkValidity();
  field.classList.toggle('is-invalid', !valid);
  return valid;
}

export function initContactForm(): void {
  if (globalThis.window === undefined) return;

  const form = document.getElementById('contact-form');
  if (!(form instanceof HTMLFormElement)) return;

  const success = document.getElementById('form-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = form.querySelectorAll('.field');
    let allValid = true;
    for (const field of fields) {
      if (!validateField(field)) allValid = false;
    }
    if (!allValid) return;
    const submit = form.querySelector('button[type="submit"]');
    if (isSubmitButton(submit)) submit.disabled = true;
    success?.classList.add('is-visible');
  });

  for (const input of form.querySelectorAll('.input, .textarea')) {
    input.addEventListener('blur', () => {
      const field = input.closest('.field');
      if (field) validateField(field);
    });
  }
}

initContactForm();
