export function isHTMLElement(node: Element | null): node is HTMLElement {
  return node instanceof HTMLElement;
}

export function isFormFieldInput(
  node: Element,
): node is HTMLInputElement | HTMLTextAreaElement {
  return node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement;
}

export function isSubmitButton(node: Element | null): node is HTMLButtonElement {
  return node instanceof HTMLButtonElement;
}
