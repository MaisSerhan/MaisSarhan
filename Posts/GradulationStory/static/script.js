const pageFiles = [
    './pages/index-page.html',
    './pages/introduction.html',
    './pages/chapter1.html',
    './pages/chapter2.html',
    './pages/chapter3.html',
];

async function loadPages() {
    const flipbookElement = document.getElementById("flipbook");
    const hardCovers = flipbookElement.querySelectorAll('.hard');

    // إزالة صفحات الغلاف مؤقتًا
    hardCovers.forEach(cover => cover.remove());

    // تحميل الصفحات بالترتيب معكوس باستخدام prepend (لكي يبقى الترتيب في DOM معكوس)
    for (let i = 0; i < pageFiles.length; i++) {
        const file = pageFiles[i];
        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const pageContent = await response.text();
            const pageDiv = document.createElement('div');
            pageDiv.classList.add('page');
            pageDiv.innerHTML = pageContent;

            // إضافة رقم الصفحة أسفل الصفحة (يمكن تعديل حسب التصميم)
            const pageNumberDiv = document.createElement('div');
            pageNumberDiv.classList.add('page-number');
            pageNumberDiv.textContent = i + 1; // ترقيم يبدأ من 1
            pageDiv.appendChild(pageNumberDiv);

            // نضيف الصفحة باستخدام prepend لنعكس الترتيب
            flipbookElement.prepend(pageDiv);
        } catch (error) {
            console.error(`Error loading page ${file}:`, error);
        }
    }

    // إعادة صفحات الغلاف
    flipbookElement.prepend(hardCovers[0]);
    flipbookElement.append(hardCovers[1]);

    const totalPages = flipbookElement.querySelectorAll('.page').length;

    // إنشاء الـ flipbook مع الإعدادات
    const flipbook = new St.PageFlip(flipbookElement, {
        width: 400,
        height: 500,
        size: "fixed",
        maxShadowOpacity: 0.7,
        showCover: true,
        flippingTime: 800,
        usePortrait: true,
        mobileScrollSupport: false,
        startPage: totalPages - 1,
        direction: 'rtl'
    });

    flipbook.loadFromHTML(flipbookElement.querySelectorAll(".page"));
    window.flipbook = flipbook;

    document.getElementById('nextPageBtn')?.removeAttribute('disabled');
    document.getElementById('prevPageBtn')?.removeAttribute('disabled');
}

document.addEventListener('DOMContentLoaded', loadPages);

// إزالة التمييز من النصوص
function removeHighlights() {
    const pages = document.querySelectorAll('#flipbook .page');
    pages.forEach(page => {
        page.innerHTML = page.innerHTML.replace(/<span class="highlight">(.*?)<\/span>/g, '$1');
    });
}

let searchResults = [];
let currentSearchIndex = -1;

function performSearch(text) {
    if (!text) return;

    const pages = document.querySelectorAll('#flipbook .page:not(.hard)'); // استثناء صفحات الغلاف
    removeHighlights();
    searchResults = [];
    currentSearchIndex = -1;

    pages.forEach((page, index) => {
        const regex = new RegExp(text, 'gi');
        const matches = page.textContent.match(regex);
        const count = matches ? matches.length : 0;

        if (count > 0) {
            searchResults.push({ pageIndex: index, count, text });
            page.innerHTML = page.innerHTML.replace(regex, match => `<span class="highlight">${match}</span>`);
        }
    });

    if (searchResults.length === 0) {
        document.getElementById('searchCount').textContent = '0';
        alert(`لم يتم العثور على "${text}"`);
        return;
    }

    currentSearchIndex = 0;
    goToSearchResult(currentSearchIndex);
}

function goToSearchResult(index) {
    if (!searchResults.length) return;
    if (index < 0) index = searchResults.length - 1;
    if (index >= searchResults.length) index = 0;
    currentSearchIndex = index;

    const result = searchResults[index];
    if (!result) return;

    const hardCoversCount = 2; // عدد صفحات الغلاف (hard)

    if (window.flipbook) {
        // لأننا نستخدم prepend الصفحات بالترتيب معكوس
        // نحتاج نذهب إلى الصفحة: (totalPages - 1) - (pageIndex + hardCoversCount) + 1
        const totalPages = window.flipbook.getPageCount();
        const flipPageIndex = totalPages - (result.pageIndex + hardCoversCount);
        window.flipbook.flip(flipPageIndex);
    }

    document.getElementById('searchCount').textContent = `${currentSearchIndex + 1} / ${searchResults.length}`;
}

// الأحداث للأزرار
document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return;
    performSearch(query);
});

document.getElementById('nextSearchBtn').addEventListener('click', () => {
    if (!searchResults.length) return;
    currentSearchIndex++;
    if (currentSearchIndex >= searchResults.length) currentSearchIndex = 0;
    goToSearchResult(currentSearchIndex);
});

document.getElementById('prevSearchBtn').addEventListener('click', () => {
    if (!searchResults.length) return;
    currentSearchIndex--;
    if (currentSearchIndex < 0) currentSearchIndex = searchResults.length - 1;
    goToSearchResult(currentSearchIndex);
});
