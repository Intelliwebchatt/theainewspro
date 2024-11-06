// Constants
const HACKER_NEWS_API = 'https://hacker-news.firebaseio.com/v0';
const NEWS_FEED_ELEMENT = document.getElementById('news-feed');
const FEATURED_STORIES_ELEMENT = document.getElementById('featured-stories');
const STORIES_COUNT_ELEMENT = document.getElementById('stories-count');
const LAST_UPDATED_ELEMENT = document.getElementById('last-updated');

// Fetch top stories from HackerNews
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
                    <span class="flex items-center">👆 ${story.score} points</span>
                    <span class="flex items-center">👤 ${story.by}</span>
                    <a href="https://news.ycombinator.com/item?id=${story.id}"
                       target="_blank"
                       rel="noopener noreferrer"
                       class="flex items-center hover:text-blue-600">
                        💬 ${story.descendants || 0} comments
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
            <h3 class="font-semibold text-lg mb-2">
                <a href="${story.url || `https://news.ycombinator.com/item?id=${story.id}`}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="text-gray-900 hover:text-blue-600 transition-colors">
                    ${story.title}
                </a>
            </h3>
            <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span class="flex items-center">👆 ${story.score} points</span>
                <span class="flex items-center">👤 ${story.by}</span>
                <span class="flex items-center">🕒 ${formatTimeAgo(story.time)}</span>
                <a href="https://news.ycombinator.com/item?id=${story.id}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="hover:text-blue-600">
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
    const loadingTemplate = `
        <div class="animate-pulse bg-white rounded-lg shadow-sm p-6 mb-4">
            <div class="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
    `;
    
    NEWS_FEED_ELEMENT.innerHTML = loadingTemplate.repeat(5);
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

// Update last updated time
function updateLastUpdated() {
    LAST_UPDATED_ELEMENT.textContent = new Date().toLocaleTimeString();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchTopStories();
    // Refresh every 5 minutes
    setInterval(fetchTopStories, 300000);
});
