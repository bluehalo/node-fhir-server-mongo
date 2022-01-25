const url = new URL(window.location);
const currentPage = url.searchParams.get("_getpagesoffset");

const nextLink = document.getElementById("lnkNext");
nextLink.addEventListener("click", function () {
    goNext();
}, false);

const prevLink = document.getElementById("lnkPrevious");
prevLink.addEventListener("click", function () {
    goPrevious();
}, false);

if(!currentPage || currentPage === "0"){
    prevLink.closest(".page-item").classList.add("disabled");
} else {
    prevLink.closest(".page-item").classList.remove("disabled");
}

function goNext() {
    const nextPage = currentPage ? parseInt(currentPage) + 1 : 1;
    url.searchParams.set("_getpagesoffset", nextPage);
    url.searchParams.set("_count", 10);
    window.location.assign(url);
}
function goPrevious() {
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