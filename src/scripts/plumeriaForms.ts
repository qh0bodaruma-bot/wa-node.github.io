// Demo only: no endpoint, storage, or analytics receives field values.
export function initPlumeriaForms() {
  document.querySelectorAll<HTMLFormElement>('[data-pl-demo-form]').forEach((form) => {
    if (form.dataset.ready) return;
    form.dataset.ready = 'true';
    const fields = [...form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea')];
    const category = form.querySelector<HTMLSelectElement>('[name="category"]')!;
    const unit = form.querySelector<HTMLSelectElement>('[name="unit"]');
    const unitField = form.querySelector<HTMLElement>('[data-pl-unit-field]');
    const success = form.querySelector<HTMLElement>('[data-pl-success]')!;
    const summary = form.querySelector<HTMLElement>('[data-pl-form-error]')!;
    const query = new URLSearchParams(location.search);
    const service = query.get('service');
    if (form.dataset.plDemoForm === 'contact' && service && [...category.options].some((o) => o.value === service)) category.value = service;
    if (unit && ['1', '2'].includes(query.get('unit') || '') && category.value === 'housing') unit.value = query.get('unit')!;
    function updateUnit() {
      if (!unitField || !unit) return;
      unitField.hidden = category.value !== 'housing';
      unit.disabled = unitField.hidden;
      if (unit.disabled) unit.value = '';
    }
    updateUnit();
    category.addEventListener('change', updateUnit);
    const message = (field: typeof fields[number]) => {
      const value = field.value.trim();
      if (field.required && !value) return field instanceof HTMLSelectElement ? '項目を選択してください。' : 'この項目を入力してください。';
      if (field.name === 'contactInfo' && value) {
        const normalized = value.normalize('NFKC');
        const phone = normalized.replace(/[\s()（）‐‑–—ー−-]/g, '');
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) || /^0\d{9,10}$/.test(phone);
        if (!valid) return '電話番号（市外局番から10〜11桁）またはメールアドレスを入力してください。';
      }
      return '';
    };
    function validate(field: typeof fields[number]) {
      const error = field.disabled ? '' : message(field);
      field.setAttribute('aria-invalid', String(Boolean(error)));
      const target = form.querySelector<HTMLElement>(`[data-error-for="${field.name}"]`);
      if (target) { target.textContent = error; target.hidden = !error; }
      return !error;
    }
    const check = () => {
      success.hidden = true;
      const invalid = fields.filter((field) => !validate(field));
      summary.hidden = invalid.length === 0;
      if (invalid.length) invalid[0].focus();
      else { success.hidden = false; success.focus(); }
    };
    form.addEventListener('submit', (event) => { event.preventDefault(); check(); });
    form.querySelector('[data-pl-check]')?.addEventListener('click', check);
    form.addEventListener('input', (event) => {
      success.hidden = true;
      const field = event.target;
      if ((field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement) && field.hasAttribute('aria-invalid')) validate(field);
      if (!fields.some((f) => f.getAttribute('aria-invalid') === 'true')) summary.hidden = true;
    });
    // Enable only after the submit guard is installed. Without JS, no named field can submit.
    form.querySelector('fieldset')!.disabled = false;
  });
}
