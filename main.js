/* ===== 1. Вспомогательные функции ===== */
const $ = (s, r = document) => r.querySelector(s);

function setError(input, text) {
  const field = input.closest('.field');
  const box = field ? $('[data-error]', field) : $('#agree-error');
  if (field) field.classList.toggle('invalid', Boolean(text));
  if (box) box.textContent = text || '';
  return !text;
}
function showNotice(text) {
  const n = $('#notice');
  if (!n) return;
  n.textContent = text;
  n.hidden = false;
}
const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

/* ===== 2. Форма входа ===== */
const loginForm = $('#login-form');
if (loginForm) {
  $('#forgot').addEventListener('click', e => {
    e.preventDefault();
    showNotice('Ссылка для сброса пароля будет отправлена на указанный e-mail.');
  });
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = $('#email'), pass = $('#password');
    const ok = [
      setError(email, emailOk(email.value.trim()) ? '' : 'Введите e-mail в формате name@mail.ru'),
      setError(pass, pass.value ? '' : 'Введите пароль')
    ].every(Boolean);
    if (!ok) return;
    // Демо: администратор попадает в панель, остальные — на главную
    location.href = email.value.trim().toLowerCase().startsWith('admin') ? 'admin.html' : 'index.html';
  });
}

/* ===== 3. Форма регистрации ===== */
const regForm = $('#register-form');
if (regForm) {
  const phone = $('#phone');
  // Маска телефона: +7 999 123-45-67
  phone.addEventListener('input', () => {
    let d = phone.value.replace(/\D/g, '');
    if (d.startsWith('7') || d.startsWith('8')) d = d.slice(1);
    d = d.slice(0, 10);
    let out = '+7';
    if (d.length) out += ' ' + d.slice(0, 3);
    if (d.length > 3) out += ' ' + d.slice(3, 6);
    if (d.length > 6) out += '-' + d.slice(6, 8);
    if (d.length > 8) out += '-' + d.slice(8, 10);
    phone.value = d.length ? out : '';
  });

  regForm.addEventListener('submit', e => {
    e.preventDefault();
    const fio = $('#fio'), email = $('#email'), p1 = $('#password'), p2 = $('#password2'), agree = $('#agree');
    const ok = [
      setError(fio, fio.value.trim().split(/\s+/).length >= 2 ? '' : 'Укажите фамилию и имя'),
      setError(phone, phone.value.replace(/\D/g, '').length === 11 ? '' : 'Введите телефон полностью'),
      setError(email, emailOk(email.value.trim()) ? '' : 'Введите e-mail в формате name@mail.ru'),
      setError(p1, p1.value.length >= 8 ? '' : 'Пароль — не короче 8 символов'),
      setError(p2, p2.value === p1.value && p2.value ? '' : 'Пароли не совпадают'),
      setError(agree, agree.checked ? '' : 'Нужно согласие на обработку данных')
    ].every(Boolean);
    if (!ok) return;
    showNotice('Аккаунт создан. Перенаправляем на вход…');
    setTimeout(() => (location.href = 'login.html'), 1200);
  });
}

/* ===== 4. Админка: статусы и новый заказ ===== */
const orders = $('#orders');
if (orders) {
  const statusOptions = ['В работе', 'Принят', 'Готов к примерке', 'Готов к выдаче', 'Выдан'];
  const counter = $('#stat-work');
  const countWork = () => {
    counter.textContent = 7 + [...orders.querySelectorAll('[data-status]')].filter(s => s.value === 'В работе').length;
  };
  orders.addEventListener('change', e => { if (e.target.matches('[data-status]')) countWork(); });

  const dialog = $('#order-dialog');
  $('#new-order').addEventListener('click', () => dialog.showModal());
  $('#o-cancel').addEventListener('click', () => dialog.close());

  $('#order-form').addEventListener('submit', () => {
    const next = 101 + orders.rows.length;
    const tr = document.createElement('tr');
    const cells = [next, $('#o-client').value.trim(), $('#o-service').value, $('#o-date').value.trim(), $('#o-worker').value];
    cells.forEach(v => { const td = document.createElement('td'); td.textContent = v; tr.append(td); });
    const td = document.createElement('td');
    const sel = document.createElement('select');
    sel.dataset.status = '';
    statusOptions.forEach(s => sel.add(new Option(s, s, false, s === 'Принят')));
    td.append(sel); tr.append(td);
    orders.append(tr);
    $('#order-form').reset();
  });
}
