// State Management
let currentFilter = {
    year: 'all',
    level: 'all',
    attribute: 'all',
    specialType: null
};

let yearlyFavorites = {
    1997: [],
    1998: [],
    1999: [],
    2000: [],
    2001: []
};

let currentContextDigimon = null;
let previewTimeout = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadFavorites();
    renderDigimonGrid();
    setupEventListeners();
    renderFavorites();
    setupImagePreview();
});

// Setup Event Listeners
function setupEventListeners() {
    // Year filter
    document.querySelectorAll('.year-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.year-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter.year = e.target.dataset.year;
            renderDigimonGrid();
        });
    });

    // Level filter
    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter.level = e.target.dataset.level;
            renderDigimonGrid();
        });
    });

    // Attribute filter
    document.querySelectorAll('.attribute-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.attribute-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter.attribute = e.target.dataset.attribute;
            renderDigimonGrid();
        });
    });

    // Special type filter
    document.querySelectorAll('.special-type-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const specialType = e.target.dataset.special;
            if (currentFilter.specialType === specialType) {
                currentFilter.specialType = null;
                e.target.classList.remove('active');
                restoreStandardFilters();
            } else {
                document.querySelectorAll('.special-type-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                currentFilter.specialType = specialType;
                showSpecialTypeFilters(specialType);
            }
            renderDigimonGrid();
        });
    });

    // Delete button
    document.getElementById('deleteBtn').addEventListener('click', deleteFavorites);

    // Close alternative window when clicking outside
    document.getElementById('alternativeWindow').addEventListener('click', (e) => {
        if (e.target.id === 'alternativeWindow') {
            closeAlternativeWindow();
        }
    });

    // Hide preview when moving away from images
    document.addEventListener('mousemove', (e) => {
        const preview = document.getElementById('imagePreview');
        if (!e.target.closest('.digimon-card img') && !e.target.closest('.yearly-favorite-slot img')) {
            preview.classList.remove('visible');
        }
    });
}

function setupImagePreview() {
    const preview = document.getElementById('imagePreview');
    
    document.addEventListener('mouseover', (e) => {
        if (e.target.tagName === 'IMG' && (e.target.closest('.digimon-card') || e.target.closest('.yearly-favorite-slot'))) {
            clearTimeout(previewTimeout);
            previewTimeout = setTimeout(() => {
                const img = e.target;
                const previewImg = document.getElementById('previewImage');
                previewImg.src = img.src;
                
                // Position preview at top with proper spacing
                const previewWidth = 300;
                const previewHeight = 300;
                let left = e.pageX + 15;
                
                // Keep preview from going off-screen horizontally
                if (left + previewWidth > window.innerWidth) {
                    left = window.innerWidth - previewWidth - 20;
                }
                
                preview.style.left = left + 'px';
                preview.style.top = '40px'; // Fixed top position instead of following mouse
                preview.classList.add('visible');
            }, 300);
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.tagName === 'IMG' && (e.target.closest('.digimon-card') || e.target.closest('.yearly-favorite-slot'))) {
            clearTimeout(previewTimeout);
            preview.classList.remove('visible');
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (preview.classList.contains('visible')) {
            // Keep preview at top but follow horizontally
            const previewWidth = 300;
            let left = e.pageX + 15;
            
            if (left + previewWidth > window.innerWidth) {
                left = window.innerWidth - previewWidth - 20;
            }
            
            preview.style.left = left + 'px';
        }
    });
}

function showSpecialTypeFilters(specialType) {
    const levelGroup = document.getElementById('levelFilterGroup');
    const attributeGroup = document.getElementById('attributeFilterGroup');

    if (specialType === 'armor') {
        attributeGroup.style.display = 'none';
        levelGroup.innerHTML = `
            <div class="filter-label">Armor Types:</div>
            <div class="button-row">
                <button class="armor-evolution-btn active" data-armor="all">All</button>
                <button class="armor-evolution-btn" data-armor="Courage">Courage</button>
                <button class="armor-evolution-btn" data-armor="Friendship">Friendship</button>
                <button class="armor-evolution-btn" data-armor="Love">Love</button>
                <button class="armor-evolution-btn" data-armor="Purity">Purity</button>
                <button class="armor-evolution-btn" data-armor="Knowledge">Knowledge</button>
                <button class="armor-evolution-btn" data-armor="Sincerity">Sincerity</button>
                <button class="armor-evolution-btn" data-armor="Hope">Hope</button>
                <button class="armor-evolution-btn" data-armor="Light">Light</button>
                <button class="armor-evolution-btn" data-armor="Kindness">Kindness</button>
                <button class="armor-evolution-btn" data-armor="Miracles">Miracles</button>
                <button class="armor-evolution-btn" data-armor="Fate">Fate</button>
            </div>
        `;
        setupArmorListeners();
    } else if (specialType === 'hybrid') {
        attributeGroup.style.display = 'none';
        levelGroup.innerHTML = `
            <div class="filter-label">Hybrid Types:</div>
            <div class="button-row">
                <button class="hybrid-evolution-btn active" data-hybrid="all">All</button>
                <button class="hybrid-evolution-btn" data-hybrid="Fire">Fire</button>
                <button class="hybrid-evolution-btn" data-hybrid="Light">Light</button>
                <button class="hybrid-evolution-btn" data-hybrid="Thunder">Thunder</button>
                <button class="hybrid-evolution-btn" data-hybrid="Wind">Wind</button>
                <button class="hybrid-evolution-btn" data-hybrid="Ice">Ice</button>
                <button class="hybrid-evolution-btn" data-hybrid="Dark">Dark</button>
                <button class="hybrid-evolution-btn" data-hybrid="Earth">Earth</button>
                <button class="hybrid-evolution-btn" data-hybrid="Wood">Wood</button>
                <button class="hybrid-evolution-btn" data-hybrid="Water">Water</button>
                <button class="hybrid-evolution-btn" data-hybrid="Steel">Steel</button>
            </div>
        `;
        setupHybridListeners();
    } else if (specialType === 'x') {
        attributeGroup.style.display = 'block';
        levelGroup.innerHTML = `
            <div class="filter-label">Levels:</div>
            <div class="button-row">
                <button class="level-btn active" data-level="all">All</button>
                <button class="level-btn" data-level="Baby I">Baby I</button>
                <button class="level-btn" data-level="Baby II">Baby II</button>
                <button class="level-btn" data-level="Child">Child</button>
                <button class="level-btn" data-level="Adult">Adult</button>
                <button class="level-btn" data-level="Perfect">Perfect</button>
                <button class="level-btn" data-level="Ultimate">Ultimate</button>
            </div>
        `;
        setupLevelListeners();
    }
}

function restoreStandardFilters() {
    const levelGroup = document.getElementById('levelFilterGroup');
    const attributeGroup = document.getElementById('attributeFilterGroup');

    levelGroup.innerHTML = `
        <div class="filter-label">Levels:</div>
        <div class="button-row">
            <button class="level-btn active" data-level="all">All</button>
            <button class="level-btn" data-level="Baby I">Baby I</button>
            <button class="level-btn" data-level="Baby II">Baby II</button>
            <button class="level-btn" data-level="Child">Child</button>
            <button class="level-btn" data-level="Adult">Adult</button>
            <button class="level-btn" data-level="Perfect">Perfect</button>
            <button class="level-btn" data-level="Ultimate">Ultimate</button>
            <button class="level-btn" data-level="No Profile">No Profile</button>
        </div>
    `;

    attributeGroup.innerHTML = `
        <div class="filter-label">Attributes:</div>
        <div class="button-row">
            <button class="attribute-btn active" data-attribute="all">All</button>
            <button class="attribute-btn" data-attribute="Vaccine">Vaccine</button>
            <button class="attribute-btn" data-attribute="Data">Data</button>
            <button class="attribute-btn" data-attribute="Virus">Virus</button>
            <button class="attribute-btn" data-attribute="Free">Free</button>
            <button class="attribute-btn" data-attribute="Unknown">Unknown</button>
        </div>
    `;

    attributeGroup.style.display = 'block';
    setupEventListeners();
}

function setupArmorListeners() {
    document.querySelectorAll('.armor-evolution-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.armor-evolution-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter.armorType = e.target.dataset.armor;
            renderDigimonGrid();
        });
    });
}

function setupHybridListeners() {
    document.querySelectorAll('.hybrid-evolution-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.hybrid-evolution-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter.hybridType = e.target.dataset.hybrid;
            renderDigimonGrid();
        });
    });
}

function setupLevelListeners() {
    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter.level = e.target.dataset.level;
            renderDigimonGrid();
        });
    });
}

// Filter and Render Digimon
function getFilteredDigimon() {
    return digimonDatabase.filter(digimon => {
        let passed = true;

        // Year filter
        if (currentFilter.year !== 'all' && digimon.year !== parseInt(currentFilter.year)) {
            passed = false;
        }

        // Special Type Filter
        if (currentFilter.specialType === 'armor' && digimon.type !== 'armor') {
            passed = false;
        }
        if (currentFilter.specialType === 'hybrid' && digimon.type !== 'hybrid') {
            passed = false;
        }
        if (currentFilter.specialType === 'x' && digimon.type !== 'x') {
            passed = false;
        }

        // Armor Type Filter
        if (currentFilter.armorType && currentFilter.armorType !== 'all' && digimon.armor_type !== currentFilter.armorType) {
            passed = false;
        }

        // Hybrid Type Filter
        if (currentFilter.hybridType && currentFilter.hybridType !== 'all' && digimon.hybrid_type !== currentFilter.hybridType) {
            passed = false;
        }

        // Level filter
        if (!currentFilter.specialType) {
            if (currentFilter.level !== 'all' && digimon.level !== currentFilter.level) {
                passed = false;
            }

            // Attribute filter
            if (currentFilter.attribute !== 'all' && digimon.attribute !== currentFilter.attribute) {
                passed = false;
            }
        } else if (currentFilter.specialType === 'x') {
            if (currentFilter.level !== 'all' && digimon.level !== currentFilter.level) {
                passed = false;
            }
            if (currentFilter.attribute !== 'all' && digimon.attribute !== currentFilter.attribute) {
                passed = false;
            }
        }

        return passed;
    });
}

function renderDigimonGrid() {
    const grid = document.getElementById('digimonGrid');
    const filtered = getFilteredDigimon();

    grid.innerHTML = filtered.map(digimon => `
        <div class="digimon-card" data-id="${digimon.id}" data-name="${digimon.name}">
            <img src="${digimon.image}" alt="${digimon.name}" data-alt-url="${digimon.altImage}">
            <div class="digimon-name">${digimon.name}</div>
        </div>
    `).join('');

    // Add click listeners
    document.querySelectorAll('.digimon-card').forEach(card => {
        card.addEventListener('click', (e) => addToFavorites(e, card));
        
        // Add context menu for opening in new tab with alt image
        card.querySelector('img').addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const altUrl = e.target.dataset.altUrl;
            if (altUrl) {
                window.open(altUrl, '_blank');
            }
        });
    });
}

function addToFavorites(e, card) {
    const digimonId = parseInt(card.dataset.id);
    const digimon = digimonDatabase.find(d => d.id === digimonId);

    if (!digimon) return;

    const year = digimon.year;
    
    // Check if already in yearly favorites
    if (!yearlyFavorites[year]) {
        yearlyFavorites[year] = [];
    }
    
    // Max 12 per year
    if (yearlyFavorites[year].length < 12) {
        if (!yearlyFavorites[year].includes(digimonId)) {
            yearlyFavorites[year].push(digimonId);
            renderFavorites();
        }
    } else {
        alert('You can only select 12 Digimon per year!');
        return;
    }
}

function renderFavorites() {
    const favoritesYearly = document.getElementById('favoritesYearly');
    
    let html = '';
    
    const years = [1997, 1998, 1999, 2000, 2001];
    
    years.forEach(year => {
        const yearFavorites = yearlyFavorites[year] || [];
        
        html += `
            <div class="yearly-section">
                <div class="yearly-header">
                    Year ${year}
                    <span class="yearly-count">${yearFavorites.length} / 12</span>
                </div>
                <div class="yearly-grid" data-year="${year}">
                    ${createYearlySlots(year, yearFavorites)}
                </div>
            </div>
        `;
    });
    
    favoritesYearly.innerHTML = html;
    
    // Add click listeners to yearly favorite slots
    document.querySelectorAll('.yearly-favorite-slot.filled').forEach(slot => {
        slot.addEventListener('click', (e) => {
            e.preventDefault();
            const year = parseInt(slot.dataset.year);
            const digimonId = parseInt(slot.dataset.digimonId);
            
            // Remove from favorites
            yearlyFavorites[year] = yearlyFavorites[year].filter(id => id !== digimonId);
            
            renderFavorites();
        });
        
        // Add context menu for images in yearly section
        const img = slot.querySelector('img');
        if (img) {
            img.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                const altUrl = img.dataset.altUrl;
                if (altUrl) {
                    window.open(altUrl, '_blank');
                }
            });
        }
    });
    
    // Auto-save to localStorage
    const data = { yearlyFavorites };
    localStorage.setItem('digimonFavorites', JSON.stringify(data));
}

function createYearlySlots(year, yearFavorites) {
    let html = '';
    
    // Create 12 slots for each year
    for (let i = 0; i < 12; i++) {
        if (i < yearFavorites.length) {
            const digimonId = yearFavorites[i];
            const digimon = digimonDatabase.find(d => d.id === digimonId);
            
            if (digimon) {
                html += `
                    <div class="yearly-favorite-slot filled" data-year="${year}" data-digimon-id="${digimonId}" title="${digimon.name}">
                        <img src="${digimon.image}" alt="${digimon.name}" data-alt-url="${digimon.altImage}">
                    </div>
                `;
            }
        } else {
            html += `
                <div class="yearly-favorite-slot empty" data-year="${year}" data-digimon-id="null"></div>
            `;
        }
    }
    
    return html;
}

function closeAlternativeWindow() {
    document.getElementById('alternativeWindow').classList.remove('visible');
    currentContextDigimon = null;
}

function deleteFavorites() {
    if (confirm('Are you sure you want to delete all favorites?')) {
        yearlyFavorites = {
            1997: [],
            1998: [],
            1999: [],
            2000: [],
            2001: []
        };
        localStorage.removeItem('digimonFavorites');
        renderFavorites();
    }
}

function loadFavorites() {
    const saved = localStorage.getItem('digimonFavorites');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            yearlyFavorites = data.yearlyFavorites || yearlyFavorites;
        } catch (e) {
            console.error('Error loading favorites:', e);
        }
    }
}
