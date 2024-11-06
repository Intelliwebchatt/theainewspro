// Constants
const HACKER_NEWS_API = 'https://hacker-news.firebaseio.com/v0';
const NEWS_FEED_ELEMENT = document.getElementById('news-feed');

// Fetch top stories from HackerNews
async function fetchTopStories() {
    try {
        // Get top stories IDs
        const response = await fetch(`${HACKER_NEWS_API}/topstories.json`);
        const storyIds = await response.json();
        
        // Get first 20 stories
        const stories = await Promise.all(
            storyIds.slice(0, 20).map(fetchStoryDetails)
        );
        
        // Filter for AI-related stories
        const aiStories = stories.filter(story => 
            story && (
                story.title.toLowerCase().includes('ai') ||
                story.title.toLowerCase().includes('artificial intelligence') ||
                story.title.toLowerCase().includes('machine learning') ||
                story.title.toLowerCase().includes('deep learning')
            )
        );
        
        displayStories(aiStories);
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

// Display stories in the news feed
function displayStories(stories) {
    if (!stories.length) {
        NEWS_FEED_ELEMENT.innerHTML = `
            <div class="bg-white p-4 rounded-lg shadow">
                <p class="text-gray-600">No AI-related stories found at the moment.</p>
            </div>
        `;
        return;
    }

    NEWS_FEED_ELEMENT.innerHTML = stories.map(story => `
        <article class="news-item bg-white p-4 rounded-lg shadow hover:shadow-md">
            <h3 class="font-semibold text-lg mb-2">
                <a href="${story.url || `https://news.ycombinator.com/item?id=${story.id}`}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="text-gray-900 hover:text-blue-600">
                    ${story.title}
                </a>
            </h3>
            <div class="flex items-center space-x-4 text-sm text-gray-500">
                <span>${story.score} points</span>
                <span>by ${story.by}</span>
                <span>${formatTimeAgo(story.time)}</span>
                <a href="https://news.ycombinator.com/item?id=${story.id}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="hover:text-blue-600">
                    ${story.descendants || 0} comments
                </a>
            </div>
        </article>
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
