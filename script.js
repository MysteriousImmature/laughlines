// Initialize application state
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
let darkMode = localStorage.getItem('darkMode') === 'true';

// Function to fetch and display a new joke
function fetchJoke() {
    document.getElementById('status-indicator').classList.remove('hidden');
    
    fetch('https://icanhazdadjoke.com/slack', {
        headers: { 'Accept': 'application/json' }
    })
    .then(response => response.json())
    .then(jokeData => {
        const jokeText = jokeData.attachments[0].text;
        const jokeElement = document.getElementById('jokeElement');
        jokeElement.innerHTML = jokeText;
        
        // Update favorite button state
        updateFavoriteButtonState(jokeText);
        
        document.getElementById('status-indicator').classList.add('hidden');
    })
    .catch(() => {
        const jokeElement = document.getElementById('jokeElement');
        jokeElement.innerHTML = "Couldn't fetch a joke. Check your internet connection.";
        document.getElementById('status-indicator').classList.add('hidden');
    });
}

// Copy joke to clipboard
function copyJoke() {
    const jokeText = document.getElementById('jokeElement').innerText;
    navigator.clipboard.writeText(jokeText)
        .then(() => {
            // Visual feedback for copy success
            const copyButton = document.getElementById('copyButton');
            copyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="18" height="18"><path fill="currentColor" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>';
            
            setTimeout(() => {
                copyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="18" height="18"><path fill="currentColor" d="M208 0H332.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V336c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48zM48 128h80v64H64V448H256V416h64v48c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48z"/></svg>';
            }, 1500);
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
        });
}

// Toggle dark mode
function toggleDarkMode() {
    darkMode = !darkMode;
    if (darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode);
    updateDarkModeIcon(darkMode);
}

// Update dark mode icon
function updateDarkModeIcon(isDarkMode) {
    const darkModeIcon = document.getElementById('darkModeIcon');
    if (isDarkMode) {
        darkModeIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="14" height="14"><path fill="currentColor" d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z"/></svg>';
    } else {
        darkModeIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="14" height="14"><path fill="currentColor" d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"/></svg>';
    }
}

// Toggle favorite status
function toggleFavorite() {
    const jokeText = document.getElementById('jokeElement').innerText;
    const favoriteButton = document.getElementById('favoriteButton');
    
    const isFavorite = favorites.includes(jokeText);
    
    if (isFavorite) {
        // Remove from favorites
        favorites = favorites.filter(joke => joke !== jokeText);
        favoriteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="18" height="18"><path fill="currentColor" d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/></svg>';
        favoriteButton.title = "Add to favorites";
    } else {
        // Add to favorites
        favorites.push(jokeText);
        favoriteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="18" height="18"><path fill="currentColor" d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>';
        favoriteButton.title = "Remove from favorites";
    }
    
    saveFavorites();
}

// Update favorite button state based on current joke
function updateFavoriteButtonState(jokeText) {
    const favoriteButton = document.getElementById('favoriteButton');
    const isFavorite = favorites.includes(jokeText);
    
    if (isFavorite) {
        favoriteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="18" height="18"><path fill="currentColor" d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>';
        favoriteButton.title = "Remove from favorites";
    } else {
        favoriteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="18" height="18"><path fill="currentColor" d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/></svg>';
        favoriteButton.title = "Add to favorites";
    }
}

// Save favorites to localStorage
function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Load favorites from localStorage
function loadFavorites() {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
        favorites = JSON.parse(storedFavorites);
    }
}

// Show favorites panel
function showFavorites() {
    document.getElementById('favoritesPanel').classList.remove('hidden');
    
    if (favorites.length === 0) {
        showEmptyFavoritesState();
    } else {
        renderFavoritesList(favorites);
    }
}

// Close favorites panel
function closeFavorites() {
    document.getElementById('favoritesPanel').classList.add('hidden');
}

// Render favorites list
function renderFavoritesList(jokesToRender) {
    const favoritesList = document.getElementById('favoritesList');
    favoritesList.innerHTML = '';
    
    jokesToRender.forEach((joke, index) => {
        const favoriteItem = document.createElement('div');
        favoriteItem.className = 'favorite-item';
        
        // Create joke content
        const jokeContent = document.createElement('div');
        jokeContent.className = 'joke-content';
        jokeContent.textContent = joke;
        
        // Create action buttons
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'favorite-actions';
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-favorite';
        copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16"><path fill="currentColor" d="M208 0H332.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V336c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48zM48 128h80v64H64V448H256V416h64v48c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48z"/></svg>';
        copyBtn.title = 'Copy joke';
        copyBtn.setAttribute('data-joke', joke);
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-favorite';
        removeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16"><path fill="currentColor" d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/></svg>';
        removeBtn.title = 'Remove from favorites';
        removeBtn.setAttribute('data-index', index);
        
        actionsDiv.appendChild(copyBtn);
        actionsDiv.appendChild(removeBtn);
        
        favoriteItem.appendChild(jokeContent);
        favoriteItem.appendChild(actionsDiv);
        favoritesList.appendChild(favoriteItem);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.remove-favorite').forEach(button => {
        button.addEventListener('click', removeFavorite);
    });
    
    document.querySelectorAll('.copy-favorite').forEach(button => {
        button.addEventListener('click', copyFavoriteJoke);
    });
}

// Remove joke from favorites
function removeFavorite(e) {
    const index = parseInt(e.currentTarget.getAttribute('data-index'));
    favorites.splice(index, 1);
    saveFavorites();
    
    if (favorites.length === 0) {
        showEmptyFavoritesState();
    } else {
        renderFavoritesList(favorites);
    }
}

// Copy favorite joke to clipboard
function copyFavoriteJoke(e) {
    const joke = e.currentTarget.getAttribute('data-joke');
    
    navigator.clipboard.writeText(joke)
        .then(() => {
            // Visual feedback
            const originalIcon = e.currentTarget.innerHTML;
            e.currentTarget.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16"><path fill="currentColor" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>';
            
            setTimeout(() => {
                e.currentTarget.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16"><path fill="currentColor" d="M208 0H332.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V336c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48zM48 128h80v64H64V448H256V416h64v48c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48z"/></svg>';
            }, 1500);
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
        });
}

// Search favorites
function searchFavorites(event) {
    const searchQuery = event.target.value.toLowerCase().trim();
    
    if (searchQuery === '') {
        // If search is empty, show all favorites
        renderFavoritesList(favorites);
        return;
    }
    
    // Filter favorites by search query
    const filteredFavorites = favorites.filter(joke => 
        joke.toLowerCase().includes(searchQuery)
    );
    
    if (filteredFavorites.length === 0) {
        // Show no results message
        const favoritesList = document.getElementById('favoritesList');
        favoritesList.innerHTML = `
            <div class="empty-favorites">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="40" height="40" class="empty-icon">
                    <path fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                </svg>
                <p>No jokes found matching "${searchQuery}"</p>
            </div>
        `;
    } else {
        // Render filtered favorites
        renderFavoritesList(filteredFavorites);
    }
}

// Show empty favorites state
function showEmptyFavoritesState() {
    const favoritesList = document.getElementById('favoritesList');
    favoritesList.innerHTML = `
        <div class="empty-favorites">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="40" height="40" class="empty-icon">
                <path fill="currentColor" d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/>
            </svg>
            <p>No favorites yet!</p>
            <p>Use the heart button to add jokes you like.</p>
        </div>
    `;
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize dark mode
    if (darkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeToggle').checked = true;
    }
    updateDarkModeIcon(darkMode);
    
    // Initialize event listeners
    document.getElementById('copyButton').addEventListener('click', copyJoke);
    document.getElementById('favoriteButton').addEventListener('click', toggleFavorite);
    document.getElementById('refreshButton').addEventListener('click', fetchJoke);
    document.getElementById('darkModeToggle').addEventListener('change', toggleDarkMode);
    document.getElementById('showFavoritesButton').addEventListener('click', showFavorites);
    document.getElementById('closeFavoritesButton').addEventListener('click', closeFavorites);
    document.getElementById('searchFavorites').addEventListener('input', searchFavorites);
    
    // Load favorites from storage
    loadFavorites();
    
    // Fetch initial joke
    fetchJoke();
});
