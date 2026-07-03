export function initContactForm(): void {
  const form = document.getElementById('contact-form') as HTMLFormElement | null;
  const success = document.getElementById('form-success');

  function validateField(field: Element): boolean {
    const input = field.querySelector('.input, .textarea') as
      | HTMLInputElement
      | HTMLTextAreaElement
      | null;
    if (!input) return true;
    const valid = input.checkValidity();
    field.classList.toggle('is-invalid', !valid);
    return valid;
  }

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = form.querySelectorAll('.field');
    let allValid = true;
    fields.forEach((f) => {
      if (!validateField(f)) allValid = false;
    });
    if (!allValid) return;
    const submit = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    if (submit) submit.disabled = true;
    success?.classList.add('is-visible');
  });

  form.querySelectorAll('.input, .textarea').forEach((input) => {
    input.addEventListener('blur', () => {
      const field = input.closest('.field');
      if (field) validateField(field);
    });
  });
}

initContactForm();
