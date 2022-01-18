document.getElementById("lnkNext").addEventListener("click", function () {
    goNext();
}, false);

document.getElementById("lnkNext").addEventListener("click", function () {
    goPrevious();
}, false);

function goNext() {
    const url = new URL(window.location);
    const currentPage = url.searchParams.get("_getpagesoffset");
    if (currentPage) {
        const nextPage = parseInt(currentPage) + 1;
        url.searchParams.set("_getpagesoffset", nextPage);
    }
    else {
        const nextPage = 1;
        url.searchParams.set("_getpagesoffset", nextPage);
    }
    url.searchParams.set("_count", 10);
    window.location.assign(url);
}
function goPrevious() {
    const url = new URL(window.location);
    const currentPage = url.searchParams.get("_getpagesoffset");
    if (currentPage) {
        const nextPage = parseInt(currentPage) - 1;
        if (nextPage >= 0) {
            url.searchParams.set("_getpagesoffset", nextPage);
        }
        else {
            return;
        }
    }
    else {
        const nextPage = 0;
        url.searchParams.set("_getpagesoffset", nextPage);
    }
    url.searchParams.set("_count", 10);
    window.location.assign(url);
}