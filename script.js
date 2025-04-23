 // Smooth scrolling for navigation links (only for anchor links starting with '#')
document.querySelectorAll('nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
        // else allow normal navigation for other links
    });
});

// Function to play audio
function playAudio(audioFile) {
    const audio = new Audio(audioFile);
    audio.play();
}

// Language toggle functionality
document.getElementById('language-toggle')?.addEventListener('click', function() {
    // Logic to switch between Arabic and French content
    alert('Language toggle functionality is not yet implemented.');
});

// Proverbs data for sayings.html
const proverbs = [
    {
        id: 1,
        category: "friends",
        image: "assets/proverbs/proverb1.jpg"
    },
    {
        id: 2,
        category: "wisdom",
        image: "assets/proverbs/proverb2.jpg"
    },
    {
        id: 3,
        category: "friends",
        image: "assets/proverbs/proverb3.jpg"
    },
    {
        id: 4,
        category: "time",
        image: "assets/proverbs/proverb4.jpg"
    },
    {
        id: 5,
        category: "wisdom",
        image: "assets/proverbs/proverb5.jpg"
    },
    {
        id: 6,
        category: "wisdom",
        image: "assets/proverbs/proverb6.jpg"
    },
    {
        id: 7,
        category: "time",
        image: "assets/proverbs/proverb7.jpg"
    },
    {
        id: 8,
        category: "friends",
        image: "assets/proverbs/proverb8.jpg"
    },
    {
        id: 9,
        category: "friends",
        image: "assets/proverbs/proverb9.jpg"
    },
    {
        id: 10,
        category: "friends",
        image: "assets/proverbs/proverb10.jpg"
    },
    {
        id: 11,
        category: "wisdom",
        image: "assets/proverbs/proverb11.jpg"
    },
    {
        id: 12,
        category: "friends",
        image: "assets/proverbs/proverb12.jpg"
    },
];

// LocalStorage key for favorites
const FAVORITES_KEY = 'favoriteProverbs';

// Get favorites from localStorage
function getFavorites() {
    const favs = localStorage.getItem(FAVORITES_KEY);
    return favs ? JSON.parse(favs) : [];
}

// Save favorites to localStorage
function saveFavorites(favs) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
}

// Check if a proverb is favorite
function isFavorite(id) {
    const favs = getFavorites();
    return favs.includes(id);
}

// Toggle favorite status
function toggleFavorite(id, button) {
    let favs = getFavorites();
    if (favs.includes(id)) {
        favs = favs.filter(favId => favId !== id);
        button.classList.remove('active');
    } else {
        favs.push(id);
        button.classList.add('active');
    }
    saveFavorites(favs);
}

function downloadImage(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


function shareProverb(text, imgPath) {
    const fullUrl = window.location.origin + '/' + imgPath.replace(/^\/+/, '');

    if (navigator.share) {
        navigator.share({
            title: 'مثل جزائري',
            text: text,
            url: fullUrl
        }).catch(err => {
            console.error('Error sharing:', err);
            alert('فشل المشاركة');
        });
    } else {
        // Fallback
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;
        window.open(shareUrl, '_blank');
    }
}


// Render proverbs cards
function renderProverbs(filterCategory = 'all', searchTerm = '') {
    console.log('renderProverbs called with filter:', filterCategory, 'search:', searchTerm);
    const container = document.getElementById('proverbsGrid');
    container.innerHTML = '';

    let filtered = [...proverbs];


    // Filter by category
    if (filterCategory === 'favorites') {
        const favs = getFavorites();
        filtered = filtered.filter(p => favs.includes(p.id));
    } else if (filterCategory === 'random') {
        filtered = filtered.sort(() => Math.random() - 0.5);
    } else if (filterCategory !== 'all') {
        filtered = filtered.filter(p => p.category === filterCategory);
    }

    // Filter by search term
    if (searchTerm.trim() !== '') {
        const term = searchTerm.trim();
        // Since text and meaning are removed, skip filtering by them
        // filtered = filtered.filter(p => p.text.includes(term) || p.meaning.includes(term));
    }

    if (filtered.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#666;">لا توجد أمثال مطابقة للمعايير.</p>';
        return;
    }

    filtered.forEach(proverb => {
        const card = document.createElement('article');
        card.className = 'proverb-card';
        card.setAttribute('tabindex', '0');
        // Remove aria-label referencing missing text
        card.removeAttribute('aria-label');

        card.innerHTML = `
            <img src="${proverb.image}" alt="صورة عن المثل" class="proverb-image" />
            <div class="proverb-content">
              <div class="card-actions">
    <button class="favorite" aria-label="إضافة إلى المفضلة" title="إضافة إلى المفضلة">
        <i class="fas fa-heart"></i>
    </button>

            <button class="download" aria-label="تحميل الصورة" title="تحميل الصورة">
                <i class="fas fa-file-image"></i>
            </button>

    <button class="share" aria-label="مشاركة المثل" title="مشاركة المثل">
        <i class="fas fa-share-alt"></i>
    </button>
</div>

        `;

        // Favorite button toggle
        const favBtn = card.querySelector('.favorite');
        if (isFavorite(proverb.id)) {
            favBtn.classList.add('active');
        }
        favBtn.addEventListener('click', () => toggleFavorite(proverb.id, favBtn));
        console.log('Favorite button event listener attached for:', proverb.id);

        // Download button
        const downloadBtn = card.querySelector('.download');
        downloadBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            console.log('Download button clicked for:', proverb.image);
            downloadImage(proverb.image, `proverb-${proverb.id}.jpg`);
        });
        console.log('Download button event listener attached for:', proverb.id);

        // Share button
        const shareBtn = card.querySelector('.share');
        shareBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            console.log('Share button clicked for:', proverb.image);
            shareProverb(proverb.text, proverb.image);
        });
        console.log('Share button event listener attached for:', proverb.id);

        container.appendChild(card);
    });
}

// Event listeners for filter and search
document.addEventListener('DOMContentLoaded', () => {
    const filterSelect = document.getElementById('categoryFilter');
    const searchInput = document.getElementById('searchInput');

    function updateDisplay() {
        const category = filterSelect.value;
        const searchTerm = searchInput.value;
        renderProverbs(category, searchTerm);
    }

    filterSelect.addEventListener('change', updateDisplay);
    searchInput.addEventListener('input', updateDisplay);

    // Initial render
    renderProverbs();
});
function toggleMenu() {
    const navList = document.querySelector("nav ul");
    navList.classList.toggle("show");
  }