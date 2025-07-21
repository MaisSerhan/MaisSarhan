const pageFiles = [
    './pages/index-page.html',       // This is your 'Fahras' (table of contents) page.
    './pages/start-linkedin.html',
    './pages/profile-setup.html',
    './pages/personal-photos.html',
    './pages/headline.html',
    './pages/connections.html',
    './pages/contact-info.html',
    './pages/education-section.html',
    './pages/end-chapter.html'       // This would be the last content page in reading order.
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