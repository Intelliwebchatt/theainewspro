// Constants
const HACKER_NEWS_API = 'https://hacker-news.firebaseio.com/v0';
const NEWS_FEED_ELEMENT = document.getElementById('news-feed');
const FEATURED_STORIES_ELEMENT = document.getElementById('featured-stories');
const STORIES_COUNT_ELEMENT = document.getElementById('stories-count');
const LAST_UPDATED_ELEMENT = document.getElementById('last-updated');

// Fetch top stories from HackerNews
async function fetchTopStories() {
    updateLastUpdated();
    try {
        const response = await fetch(`${HACKER_NEWS_API}/topstories.json`);
        const storyIds = await response.json();
        
        const stories = await Promise.all(
            storyIds.slice(0, 40).map(fetchStoryDetails)
        );
        
        const aiStories = stories.filter(story => 
            story && story.title && (
                story.title.toLowerCase().includes('ai') ||
                story.title.toLowerCase().includes('artificial intelligence') ||
                story.title.toLowerCase().includes('machine learning') ||
                story.title.toLowerCase().includes('deep learning') ||
                story.title.toLowerCase().includes('gpt') ||
                story.title.toLowerCase().includes('openai') ||
                story.title.toLowerCase().includes('anthropic') ||
                story.title.toLowerCase().includes('claude')
            )
        );

        // Update stories count
        STORIES_COUNT_ELEMENT.textContent = aiStories.length;
        
        // Split stories into featured and regular
        const featuredStories = aiStories.slice(0, 3);
        const regularStories = aiStories.slice(3);
        
        displayFeaturedStories(featuredStories);
        displayStories(regularStories);
    } catch (error) {
        console.error('Error fetching stories:', error);
        displayError();
    }
}

// Display featured stories
function displayFeaturedStories(stories) {
    if (!stories.length) return;

    FEATURED_STORIES_ELEMENT.innerHTML = stories.map(story => `
        <article class="bg-white rounded-lg shadow-sm overflow-hidden card-hover">
            <div class="p-6">
                <h3 class="text-xl font-semibold mb-2">
                    <a href="${story.url || `https://news.ycombinator.com/item?id=${story.id}`}" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="text-gray-900 hover:text-blue-600 transition-colors">
                        ${story.title}
                    </a>
                </h3>
                <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-4">
                    <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12.586l4.293-4.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L10 12.586z"/>
                        </svg>
                        ${story.score} points
                    </span>
                    <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"/>
                        </svg>
                        ${story.descendants || 0} comments
                    </span>
                    <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
                        </svg>
                        ${formatTimeAgo(story.time)}
                    </span>
                </div>
            </div>
        </article>
    `).join('');
}

// Display regular stories
function displayStories(stories) {
    if (!stories.length) {
        NEWS_FEED_ELEMENT.innerHTML = `
            <div class="bg-white rounded-lg shadow-sm p-6">
                <p class="text-gray-600">No AI-related stories found at the moment. Refreshing soon...</p>
            </div>
        `;
        return;
    }

    NEWS_FEED_ELEMENT.innerHTML = stories.map(story => `
        <article class="news-item bg-white rounded-lg shadow-sm p-6">
            <h3 class="font-semibold text-lg mb-2">
                <a href="${story.url || `https://news.ycombinator.com/item?id=${story.id}`}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="text-gray-900 hover:text-blue-600 transition-colors">
                    ${story.title}
                </a>
            </h3>
            <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12.586l4.293-4.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L10 12.586z"/>
                    </svg>
                    ${story.score} points
                </span>
                <span class
                // Constants
const HACKER_NEWS_API = 'https://hacker-news.firebaseio.com/v0';
const NEWS_FEED_ELEMENT = document.getElementById('news-feed');
const FEATURED_STORIES_ELEMENT = document.getElementById('featured-stories');
const STORIES_COUNT_ELEMENT = document.getElementById('stories-count');
const LAST_UPDATED_ELEMENT = document.getElementById('last-updated');

// Fetch and display stories
async function fetchTopStories() {
    showLoadingState();
    updateLastUpdated();
    
    try {
        const response = await fetch(`${HACKER_NEWS_API}/topstories.json`);
        const storyIds = await response.json();
        
        const stories = await Promise.all(
            storyIds.slice(0, 40).map(fetchStoryDetails)
        );
        
        const aiStories = stories.filter(story => 
            story && story.title && (
                story.title.toLowerCase().includes('ai') ||
                story.title.toLowerCase().includes('artificial intelligence') ||
                story.title.toLowerCase().includes('machine learning') ||
                story.title.toLowerCase().includes('deep learning') ||
                story.title.toLowerCase().includes('gpt') ||
                story.title.toLowerCase().includes('openai') ||
                story.title.toLowerCase().includes('anthropic') ||
                story.title.toLowerCase().includes('claude')
            )
        );
        
        STORIES_COUNT_ELEMENT.textContent = aiStories.length;
        
        // Split stories into featured and regular
        const featuredStories = aiStories.slice(0, 3);
        const regularStories = aiStories.slice(3);
        
        displayFeaturedStories(featuredStories);
        displayStories(regularStories);
    } catch (error) {
        console.error('Error fetching stories:', error);
        displayError();
    }
}

// Fetch individual story details
async function fetchStoryDetails(id) {
    try {
        const response = await fetch(`${HACKER_NEWS_API}/item/${id}.json`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching story ${id}:`, error);
        return null;
    }
}

// Display featured stories
function displayFeaturedStories(stories) {
    if (!stories.length) return;

    FEATURED_STORIES_ELEMENT.innerHTML = stories.map(story => `
        <article class="bg-white rounded-lg shadow-sm overflow-hidden card-hover">
            <div class="p-6">
                <div class="flex items-center justify-between mb-4">
                    <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Featured</span>
                    <span class="text-sm text-gray-500">${formatTimeAgo(story.time)}</span>
                </div>
                <h3 class="text-xl font-semibold mb-3">
                    <a href="${story.url || `https://news.ycombinator.com/item?id=${story.id}`}" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="text-gray-900 hover:text-blue-600 transition-colors">
                        ${story.title}
                    </a>
                </h3>
                <div class="flex items-center gap-4 text-sm text-gray-500">
                    <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21l-8-9h6v-12h4v12h6l-8 9z"/>
                        </svg>
                        ${story.score}
                    </span>
                    <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                        </svg>
                        ${story.descendants || 0}
                    </span>
                    <a href="https://news.ycombinator.com/item?id=${story.id}"
                       target="_blank"
                       rel="noopener noreferrer"
                       class="flex items-center text-blue-600 hover:text-blue-800">
                        Discuss
                        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                        </svg>
                    </a>
                </div>
            </div>
        </article>
    `).join('');
}

// Display regular stories
function displayStories(stories) {
    if (!stories.length) {
        NEWS_FEED_ELEMENT.innerHTML = `
            <div class="bg-white rounded-lg shadow-sm p-6">
                <p class="text-gray-600">No AI-related stories found at the moment. Refreshing soon...</p>
            </div>
        `;
        return;
    }

    NEWS_FEED_ELEMENT.innerHTML = stories.map(story => `
        <article class="news-item bg-white rounded-lg shadow-sm p-6 mb-4">
            <div class="flex items-center justify-between mb-2">
                <h3 class="font-semibold text-lg">
                    <a href="${story.url || `https://news.ycombinator.com/item?id=${story.id}`}" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="text-gray-900 hover:text-blue-600 transition-colors">
                        ${story.title}
                    </a>
                </h3>
            </div>
            <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span class="flex items-center">👆 ${story.score} points</span>
                <span class="flex items-center">👤 ${story.by}</span>
                <span class="flex items-center">🕒 ${formatTimeAgo(story.time)}</span>
                <a href="https://news.ycombinator.com/item?id=${story.id}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="flex items-center hover:text-blue-600">
                    💬 ${story.descendants || 0} comments
                </a>
            </div>
        </article>
    `).join('');

    // Add refresh message
    NEWS_FEED_ELEMENT.innerHTML += `
        <div class="text-center text-sm text-gray-500 mt-8">
            Updates automatically every 5 minutes
        </div>
    `;
}

// Show loading state
function showLoadingState() {
    FEATURED_STORIES_ELEMENT.innerHTML = Array(3).fill(0).map(() => `
        <div class="animate-pulse bg-white rounded-lg shadow-sm p-6">
            <div class="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div class="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
    `).join('');
}

// Display error message
function displayError() {
    NEWS_FEED_ELEMENT.innerHTML = `
        <div class="bg-red-50 rounded-lg shadow-sm p-6">
            <div class="flex items-center">
                <svg class="w-6 h-6 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p class="text-red-800">Error loading news. Retrying soon...</p>
            </div>
        </div>
    `;
}

// Update last updated time
function updateLastUpdated() {
    LAST_UPDATED_ELEMENT.textContent = new Date().toLocaleTimeString();
}

// Format timestamp to "time ago"
function formatTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() / 1000) - timestamp);
    
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
        }
    }
    
    return 'just now';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Starting AI News Pro...');
    fetchTopStories();
    // Refresh every 5 minutes
    setInterval(fetchTopStories, 300000);
});
