// Constants
const HACKER_NEWS_API = 'https://hacker-news.firebaseio.com/v0';
const NEWS_PREVIEW_ELEMENT = document.getElementById('news-preview');

// Fetch top AI-related stories
async function fetchTopStories() {
    try {
        const response = await fetch(`${HACKER_NEWS_API}/topstories.json`);
        const storyIds = await response.json();
        
        const stories = await Promise.all(
            storyIds.slice(0, 20).map(fetchStoryDetails)
        );
        
        const aiStories = stories.filter(story => 
            story && story.title && (
                story.title.toLowerCase().includes('ai') ||
                story.title.toLowerCase().includes('artificial intelligence') ||
                story.title.toLowerCase().includes('machine learning') ||
                story.title.toLowerCase().includes('gpt') ||
                story.title.toLowerCase().includes('openai') ||
                story.title.toLowerCase().includes('anthropic')
            )
        ).slice(0, 3);
        
        if (NEWS_PREVIEW_ELEMENT) {
            displayNewsPreview(aiStories);
        }
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

// Display news preview
function displayNewsPreview(stories) {
    if (!stories.length) {
        NEWS_PREVIEW_ELEMENT.innerHTML = `
            <div class="bg-gray-800 rounded-lg p-6">
                <p class="text-gray-400">No AI-related stories found at the moment.</p>
            </div>
        `;
        return;
    }

    NEWS_PREVIEW_ELEMENT.innerHTML = stories.map(story => `
        <a href="${story.url || `https://news.ycombinator.com/item?id=${story.id}`}" 
           target="_blank" 
           rel="noopener noreferrer" 
           class="block bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
            <h3 class="text-lg font-medium text-white mb-2">${story.title}</h3>
            <div class="flex items-center gap-4 text-sm text-gray-400">
                <span>${story.score} points</span>
                <span>${formatTimeAgo(story.time)}</span>
            </div>
        </a>
    `).join('');
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
    fetchTopStories();
    // Refresh every 5 minutes
    setInterval(fetchTopStories, 300000);
});
