const NUM_PAGES = 56;

let language = "original";
function setLanguage(value) {
    language = value;
    setPage();
}

let quality = "low-quality";
function setQuality(value) {
    quality = value;
    setPage();
}

function preloadImage(url) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = resolve;
        image.onerror = reject;
        image.src = url;
    });
}

function setup() {
    setPage();

    // Keyboard events
    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight" || event.key === "d") {
            navigateNext();
        }
        if (event.key === "ArrowLeft" || event.key === "a") {
            navigatePrevious();
        }
    });

    // Mouse events
    document
        .querySelector(".navigation-bar--left")
        .addEventListener("click", navigatePrevious);
    document
        .querySelector(".navigation-bar--right")
        .addEventListener("click", navigateNext);
}
setup();

function getPageURL(pageIndex) {
    return `https://raw.githubusercontent.com/aryanpingle/Tunic-Manual-Pages/master/pages/${quality}/${language}/${pageIndex}.jpg`
}

function setPage() {
    const currentPageIndex = getCurrentPageIndex();
    const pageUrl = getPageURL(currentPageIndex);
    document
        .querySelector(".manual-page")
        .style.setProperty("background-image", `url(${pageUrl})`);

    const RANGE = 2;
    for (
        let i = currentPageIndex + 1;
        i <= Math.min(NUM_PAGES - 1, currentPageIndex + RANGE);
        ++i
    ) {
        preloadImage(getPageURL(i));
    }
    for (
        let i = currentPageIndex - 1;
        i >= Math.max(0, currentPageIndex - RANGE);
        --i
    ) {
        preloadImage(getPageURL(i));
    }
}

function getCurrentPageIndex() {
    const params = new URLSearchParams(window.location.search);
    let currentPageIndex = params.get("page") || "0";
    currentPageIndex = parseInt(currentPageIndex);
    return currentPageIndex;
}

function navigateNext() {
    const currentPageIndex = getCurrentPageIndex();
    if (currentPageIndex === NUM_PAGES - 1) {
        return;
    }
    const url = new URL(location.href);
    url.searchParams.set("page", currentPageIndex + 1);
    window.history.replaceState(null, "", url.href);

    setPage();
}

function navigatePrevious() {
    const currentPageIndex = getCurrentPageIndex();
    if (currentPageIndex === 0) {
        return;
    }

    const url = new URL(location.href);
    url.searchParams.set("page", currentPageIndex - 1);
    window.history.replaceState(null, "", url.href);

    setPage();
}
