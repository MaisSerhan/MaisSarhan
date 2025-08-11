const pageFiles = [    // This would be the last content page in reading order.
    './pages/index-page.html',       // This is your 'Fahras' (table of contents) page.
    './pages/introduction.html',
    './pages/chapter1.html',
    './pages/chapter2.html',
    './pages/chapter3.html',
];
async function loadPages() {
    const flipbookElement = document.getElementById("flipbook");
    const hardCovers = flipbookElement.querySelectorAll('.hard');
    
    hardCovers.forEach(cover => cover.remove());

    for (const file of pageFiles) {
        try {
            const response = await fetch(file);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const pageContent = await response.text();
            const pageDiv = document.createElement('div');
            pageDiv.classList.add('page');
            pageDiv.innerHTML = pageContent;
            
            flipbookElement.prepend(pageDiv);
        } catch (error) {
            console.error(`Error loading page ${file}:`, error);
        }
    }

    flipbookElement.prepend(hardCovers[0]); 
    flipbookElement.append(hardCovers[1]);  

    // Calculate total pages dynamically
    const totalPages = flipbookElement.querySelectorAll('.page').length;

    const flipbook = new St.PageFlip(flipbookElement, {
        width: 400,
        height: 500,
        size: "fixed",
        maxShadowOpacity: 0.7,
        showCover: true,
        flippingTime: 800,
        usePortrait: true,
        mobileScrollSupport: false,
        // ⭐ Set startPage to the last page (the front cover) ⭐
        startPage: totalPages - 1, 
        // ⭐ Crucial for right-to-left flipping ⭐
        direction: 'rtl' 
    });

    flipbook.loadFromHTML(flipbookElement.querySelectorAll(".page"));

    window.flipbook = flipbook;

    document.getElementById('nextPageBtn').disabled = false;
    document.getElementById('prevPageBtn').disabled = false;
}

function goToPage(index) {
    if (window.flipbook) {
        window.flipbook.flip(pageFiles.length+1-index);
    } else {
        console.warn("Flipbook not yet initialized. Please wait.");
    }
}

document.addEventListener('DOMContentLoaded', loadPages);

function removeHighlights() {
    const pages = document.querySelectorAll('#flipbook .page');
    pages.forEach(page => {
        page.innerHTML = page.innerHTML.replace(/<span class="highlight">(.*?)<\/span>/g, '$1');
    });
}

function highlightTextAndGoToPage(text) {
    if (!text) return;
    const pages = document.querySelectorAll('#flipbook .page');
    let foundPageIndex = -1; // لتخزين رقم الصفحة التي تحتوي الكلمة أول مرة
    
    pages.forEach((page, index) => {
        // التعبير العادي للبحث
        const regex = new RegExp(text, 'gi');
        
        // هل الصفحة تحتوي الكلمة؟
        if (regex.test(page.textContent) && foundPageIndex === -1) {
            foundPageIndex = index;
        }
        
        // استبدال النصوص لتظليل الكلمة
        page.innerHTML = page.innerHTML.replace(regex, match => `<span class="highlight">${match}</span>`);
    });

    if (foundPageIndex !== -1 && window.flipbook) {
        // الانتقال إلى الصفحة التي وجدت فيها الكلمة (index يبدأ من 0)
        // حسب طريقة الترقيم في PageFlip (عادة تبدأ من 1)
        window.flipbook.flip(foundPageIndex + 1);
    }
}

document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value.trim();
    removeHighlights();  // إزالة التظليل القديم
    if (query !== '') {
        highlightTextAndGoToPage(query);
    }
});



