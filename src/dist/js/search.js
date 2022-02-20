const formElement = document.getElementById('searchForm');
formElement.addEventListener('submit', searchSubmit);

const advSearchFormElement = document.getElementById('advSearchForm');
advSearchFormElement.addEventListener('submit', searchSubmit);

const resetButtonElement = document
  .getElementById('resetFormButton')
  .addEventListener('click', resetSubmit);

const dateRangeElement = document.getElementById('_lastUpdateRange');
const datepicker = new DateRangePicker(dateRangeElement, {
  autohide: true,
  format: 'yyyy-mm-dd',
  clearBtn: true,
  allowOneSidedRange: true,
});

const advSearchModalButton = document.getElementById('advSearchModalButton');
advSearchModalButton.addEventListener('click', searchSubmit);

const clearInputs = document.querySelectorAll('.clear-input');
for (const input of clearInputs) {
  input.addEventListener('click', clearInput);
}

const inputElements = document.querySelectorAll('.clear-allowed');
for (const input of inputElements) {
  input.addEventListener('change', toggleClearLink);
  input.addEventListener('keyup', toggleClearLink);
}

function toggleClearLink(e) {
  const inputElement = e.target;
  const clearLink = inputElement.offsetParent.querySelector('.clear-input');
  if (inputElement.value !== '') {
    clearLink.classList.add('showInputClearLink');
  } else {
    clearLink.classList.remove('showInputClearLink');
  }
}

function clearInput(e) {
  const clearClickElement = e.target;
  clearClickElement.offsetParent.querySelector('input').value = '';
  clearClickElement.classList.remove('showInputClearLink');
}

function resetSubmit() {
  const formAction = formElement.getAttribute('action');
  window.location.assign(formAction);
}

function searchSubmit(e) {
  if (e) {
    e.preventDefault();
  }
  const formAction = formElement.getAttribute('action');
  const formData = new FormData(formElement);
  const advFormData = new FormData(advSearchFormElement);
  advFormData.forEach((value, key) => {
    formData.append(key, value);
  });

  let params = new URLSearchParams();
  const data = {};
  formData.forEach((value, key) => {
    if (value !== '' && value !== null) {
      data[key] = value;
    }
  });

  if (data.identifier_system && data.identifier_value) {
    params.append('identifier', data.identifier_system + '|' + data.identifier_value);
  }
  delete data.identifier_system;
  delete data.identifier_value;

  if (data.lastUpdateStart) {
    params.append('_lastUpdated', 'ge' + data.lastUpdateStart);
    delete data.lastUpdateStart;
  }
  if (data.lastUpdateEnd) {
    params.append('_lastUpdated', 'le' + data.lastUpdateEnd);
    delete data.lastUpdateEnd;
  }

  Object.keys(data).forEach((key) => {
    params.append(key, data[key]);
  });

  window.location.assign(formAction + '?' + params.toString());
}
