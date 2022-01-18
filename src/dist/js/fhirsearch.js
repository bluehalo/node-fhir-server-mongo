document.getElementById("search").addEventListener("click", function () {
    searchIt();
}, false);

function searchIt() {
    let url = "/4_0_0/Patient"
    let hasSearchItem = false;
    // Selecting the input element and get its value
    var inputName = document.getElementById("inputName").value;
    if (inputName) {
        url = url + (hasSearchItem ? "&" : "?") + "name=" + inputName
        hasSearchItem = true;
    }

    var inputNpi = document.getElementById("inputFamily").value;
    if (inputNpi) {
        url = url + (hasSearchItem ? "&" : "?") + "family=" + inputNpi
        hasSearchItem = true;
    }

    var inputSource = document.getElementById("inputSource").value;
    if (inputSource) {
        url = url + (hasSearchItem ? "&" : "?") + "source=" + inputSource
        hasSearchItem = true;
    }
    var inputIdentifierSystem = document.getElementById("inputIdentifierSystem").value;
    var inputIdentifierValue = document.getElementById("inputIdentifierValue").value;
    if (inputIdentifierSystem && inputIdentifierValue) {
        url = url + (hasSearchItem ? "&" : "?") + "identifier=" + inputIdentifierSystem + "|" + inputIdentifierValue
        hasSearchItem = true;
    }
    var inputLastUpdatedGreaterThan = document.getElementById("inputLastUpdatedGreaterThan").value;
    if (inputLastUpdatedGreaterThan) {
        url = url + (hasSearchItem ? "&" : "?") + "_lastUpdated=gt" + inputLastUpdatedGreaterThan
        hasSearchItem = true;
    }
    var inputLastUpdatedLessThan = document.getElementById("inputLastUpdatedLessThan").value;
    if (inputLastUpdatedLessThan) {
        url = url + (hasSearchItem ? "&" : "?") + "_lastUpdated=lt" + inputLastUpdatedLessThan
        hasSearchItem = true;
    }

    window.location.assign(url);
}