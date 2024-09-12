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
    return fetch(url, {
        mode: 'no-cors'
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
    return `https://raw.githubusercontent.com/aryanpingle/Tunic-Manual-Pages/master/pages/${quality}/${language}/${pageIndex}.jpg`;
}

function calculatePreloadRange() {
    if (quality === "high-quality") return 0;
    return 2;
}

function setPage() {
    const currentPageIndex = getCurrentPageIndex();
    const pageUrl = getPageURL(currentPageIndex);
    document
        .querySelector(".manual-page")
        .style.setProperty("background-image", `url(${pageUrl})`);

    const PreloadRange = calculatePreloadRange();
    for (let i = -PreloadRange; i <= PreloadRange; ++i) {
        // Don't preload the current page
        if (i === 0) continue;

        const otherPageIndex = currentPageIndex + i;

        // Check if this page index is within bounds
        if (otherPageIndex < 0) continue;
        if (otherPageIndex >= NUM_PAGES) continue;

        preloadImage(getPageURL(otherPageIndex));
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
