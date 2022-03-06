const formElement = document.getElementById('searchForm');
const advSearchFormElement = document.getElementById('advSearchForm');
const resetButtonElement = document.getElementById('resetFormButton');
resetButtonElement.addEventListener('click', resetSubmit);
formElement.addEventListener('submit', submitSearchForm);

const dateRangeElement = document.getElementById('_lastUpdateRange');
const datepicker = new DateRangePicker(dateRangeElement, {
    autohide: true,
    format: 'yyyy-mm-dd',
    clearBtn: true,
    allowOneSidedRange: true,
});

const advSearchModalButton = document.getElementById('advSearchModalButton');
advSearchModalButton.addEventListener('click', advSearch);

function advSearch(event) {
    if (event) {
        event.preventDefault();
    }
    Array.from(advSearchFormElement.querySelectorAll('input'))
        .filter((i) => i.value !== '')
        .forEach((advInput) => {
            formElement.querySelector(`input[name="${advInput.name}:contains"]`).value =
                advInput.value;
        });
    submitSearchForm(null, true);
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

function submitSearchForm(event, resetIndex = true) {
    if (event) {
        event.preventDefault();
    }
    const notEmpty = Array.from(
        formElement.querySelectorAll('input:not(.search-pagination)')
    ).filter((input) => input.value !== '');
    if (notEmpty.length === 0) {
        const noSearchUrl = formElement.action.replace('/_search', '');
        window.location.assign(noSearchUrl);
    } else {
        if (resetIndex) {
            formElement.querySelector('input[name="_getpagesoffset"]').value = '';
        }
        formElement.submit();
    }
}

function clearInput(e) {
    const clearClickElement = e.target;
    const inputElement = clearClickElement.offsetParent.querySelector('input');
    inputElement.value = '';
    clearClickElement.classList.remove('showInputClearLink');
    const advElement = formElement.querySelector(`input[name="${inputElement.name}:contains"]`);
    if (advElement) {
        advElement.value = '';
    }
    submitSearchForm(null, true);
}

function resetSubmit() {
    const allInputs = formElement.querySelectorAll('input');
    allInputs.forEach((input) => {
        input.value = '';
    });
    submitSearchForm(null, true);
}
