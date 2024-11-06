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
