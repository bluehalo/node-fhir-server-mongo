const formElement = document.getElementById('searchForm');
formElement.addEventListener('submit', searchSubmit);
const resetButtonElement = document
  .getElementById('resetFormButton')
  .addEventListener('click', resetSubmit);

const elem = document.getElementById('_lastUpdated');
const datepicker = new Datepicker(elem, {
  autohide: true,
  format: 'yyyy-mm-dd',
  clearBtn: true,
});

function getSearchParams(resourceName) {
  fetch('/json/search-parameters.json')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const found = data.entry.filter((entry) => {
        return entry.resource.base.includes(resourceName) && entry.resource.type === 'string';
      });
      console.log(found);
    });
}

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
  getSearchParams('Patient');
  // window.location.assign(formAction);
}

function searchSubmit(e) {
  if (e) {
    e.preventDefault();
  }
  const formAction = e.target.getAttribute('action');
  const formData = new FormData(e.target);
  const data = {};
  formData.forEach((value, key) => {
    if (value !== '' && value !== null) {
      data[key] = value;
    }
  });
  if (data.identifier_system && data.identifier_value) {
    data.identifier = data.identifier_system + '|' + data.identifier_value;
  }
  delete data.identifier_system;
  delete data.identifier_value;

  if (data._lastUpdated) {
    data._lastUpdated = data.before_after + data._lastUpdated;
  }
  delete data.before_after;

  window.location.assign(formAction + '?' + jsonToQueryString(data));
}

function jsonToQueryString(jsonObj) {
  var queryString = [];
  for (var x in jsonObj) {
    if (jsonObj.hasOwnProperty(x)) {
      queryString.push(encodeURIComponent(x) + '=' + encodeURIComponent(jsonObj[x]));
    }
  }
  return queryString.join('&');
}
