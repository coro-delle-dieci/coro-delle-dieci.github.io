document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const noResults = document.getElementById('noResults');
    const letteraGruppi = document.querySelectorAll('.lettera-gruppo');
    
    // Create clear button
    const clearBtn = document.createElement('button');
    clearBtn.innerHTML = '&times;';
    clearBtn.classList.add('clear-search');
    clearBtn.setAttribute('title', 'Cancella ricerca');
    clearBtn.style.display = 'none';
    
    // Create search icon
    const searchIcon = document.createElement('span');
    searchIcon.innerHTML = '🔍';
    searchIcon.classList.add('search-icon');
    
    // Add elements to DOM
    const searchContainer = document.querySelector('.search-container');
    searchContainer.appendChild(searchIcon);
    searchContainer.appendChild(clearBtn);
    
    // Store original content for reset
    const originalContents = new Map();
    document.querySelectorAll('.canto-link a').forEach(link => {
        originalContents.set(link, link.innerHTML);
    });
    
    // Search function with highlighting
    function performSearch(term) {
        let hasResults = false;
        term = term.toLowerCase().trim();
        
        // Reset all groups and links
        letteraGruppi.forEach(gruppo => {
            gruppo.classList.remove('hidden');
            gruppo.querySelector('h3').style.display = 'block';
        });
        
        // Reset highlights
        document.querySelectorAll('.canto-link a').forEach(link => {
            const original = originalContents.get(link);
            link.innerHTML = original;
        });
        
        // Hide no results by default
        noResults.style.display = 'none';
        
        if (term === '') {
            clearBtn.style.display = 'none';
            return;
        }
        
        let anyGroupVisible = false;
        
        // Process each group
        letteraGruppi.forEach(gruppo => {
            const h3 = gruppo.querySelector('h3');
            const links = gruppo.querySelectorAll('.canto-link a');
            let groupHasMatches = false;
            
            links.forEach(link => {
                const original = originalContents.get(link);
                const text = link.textContent.toLowerCase();
                
                if (text.includes(term)) {
                    groupHasMatches = true;
                    hasResults = true;
                    
                    // Highlight matching text
                    const regex = new RegExp(`(${term})`, 'gi');
                    link.innerHTML = original.replace(regex, '<span class="highlight">$1</span>');
                } else {
                    link.parentNode.classList.add('hidden');
                }
            });
            
            if (groupHasMatches) {
                anyGroupVisible = true;
            } else {
                gruppo.classList.add('hidden');
                h3.style.display = 'none';
            }
        });
        
        // Show no results if no matches
        if (!anyGroupVisible) {
            noResults.style.display = 'block';
            noResults.textContent = `Nessun canto trovato per "${term}"`;
        }
        
        clearBtn.style.display = 'block';
    }
    
    // Event listeners
    searchInput.addEventListener('input', function() {
        performSearch(this.value);
    });
    
    clearBtn.addEventListener('click', function() {
        searchInput.value = '';
        performSearch('');
        this.style.display = 'none';
        searchInput.focus();
    });
    
    // Alphabet links reset
    document.querySelectorAll('.alfabeto-nav a').forEach(link => {
        link.addEventListener('click', function() {
            searchInput.value = '';
            performSearch('');
            clearBtn.style.display = 'none';
        });
    });
});