// Données simulées pour les tweets
const tweets = [
    {
        id: 1,
        author: "John Doe",
        handle: "@johndoe",
        avatar: "https://picsum.photos/50?random=1",
        content: "Je viens de lancer mon nouveau site web ! #webdev #coding",
        image: "https://picsum.photos/600/400?random=1",
        time: "2h",
        stats: {
            replies: 15,
            retweets: 30,
            likes: 120
        }
    },
    {
        id: 2,
        author: "Jane Smith",
        handle: "@janesmith",
        avatar: "https://picsum.photos/50?random=2",
        content: "Belle journée pour une randonnée ! #nature #outdoors",
        image: "https://picsum.photos/600/400?random=2",
        time: "3h",
        stats: {
            replies: 23,
            retweets: 56,
            likes: 248
        }
    },
    {
        id: 3,
        author: "Tech Insights",
        handle: "@techinsights",
        avatar: "https://picsum.photos/50?random=3",
        content: "Les dernières avancées en IA sont vraiment impressionnantes ! #AI #tech",
        time: "6h",
        stats: {
            replies: 7,
            retweets: 12,
            likes: 89
        }
    }
];

// Données simulées pour les tendances
const trends = [
    {
        category: "Tendances",
        tag: "#JavaScript",
        tweets: "155.5K tweets"
    },
    {
        category: "Technologies",
        tag: "TypeScript",
        tweets: "63.4K tweets"
    },
    {
        category: "Sports",
        tag: "#WorldCup",
        tweets: "442K tweets"
    },
    {
        category: "Business",
        tag: "#Startup",
        tweets: "28.5K tweets"
    },
    {
        category: "Entertainment",
        tag: "#NewMusic",
        tweets: "86.7K tweets"
    }
];

// Données simulées pour les suggestions
const suggestions = [
    {
        name: "Mike Johnson",
        handle: "@mikej",
        avatar: "https://picsum.photos/50?random=4"
    },
    {
        name: "Sarah Williams",
        handle: "@sarahw",
        avatar: "https://picsum.photos/50?random=5"
    },
    {
        name: "Tech Insights",
        handle: "@techinsights",
        avatar: "https://picsum.photos/50?random=6"
    }
];

// Fonction pour afficher les tweets
function displayTweets() {
    const feed = document.getElementById('tweet-feed');
    feed.innerHTML = '';

    tweets.forEach(tweet => {
        const tweetElement = document.createElement('div');
        tweetElement.className = 'tweet';
        
        let imageHtml = tweet.image ? `<img src="${tweet.image}" alt="Tweet image" class="tweet-image">` : '';
        
        tweetElement.innerHTML = `
            <div class="tweet-avatar">
                <img src="${tweet.avatar}" alt="${tweet.author}">
            </div>
            <div class="tweet-content">
                <div class="tweet-header">
                    <span class="author">${tweet.author}</span>
                    <span class="handle">${tweet.handle}</span>
                    <span class="time">${tweet.time}</span>
                </div>
                <div class="tweet-text">${tweet.content}</div>
                ${imageHtml}
                <div class="tweet-actions">
                    <div class="tweet-action">
                        <i class="far fa-comment"></i>
                        <span>${tweet.stats.replies}</span>
                    </div>
                    <div class="tweet-action">
                        <i class="fas fa-retweet"></i>
                        <span>${tweet.stats.retweets}</span>
                    </div>
                    <div class="tweet-action">
                        <i class="far fa-heart"></i>
                        <span>${tweet.stats.likes}</span>
                    </div>
                    <div class="tweet-action">
                        <i class="fas fa-share"></i>
                    </div>
                </div>
            </div>
        `;
        
        feed.appendChild(tweetElement);
    });
}

// Fonction pour afficher les tendances
function displayTrends() {
    const trendsList = document.getElementById('trends-list');
    trendsList.innerHTML = '';

    trends.forEach(trend => {
        const trendElement = document.createElement('div');
        trendElement.className = 'trend-item';
        trendElement.innerHTML = `
            <div class="trend-category">${trend.category}</div>
            <div class="trend-tag">${trend.tag}</div>
            <div class="trend-tweets">${trend.tweets}</div>
        `;
        trendsList.appendChild(trendElement);
    });
}

// Fonction pour afficher les suggestions
function displaySuggestions() {
    const suggestionsList = document.getElementById('suggestions-list');
    suggestionsList.innerHTML = '';

    suggestions.forEach(suggestion => {
        const suggestionElement = document.createElement('div');
        suggestionElement.className = 'suggestion-item';
        suggestionElement.innerHTML = `
            <img src="${suggestion.avatar}" alt="${suggestion.name}" class="suggestion-avatar">
            <div class="suggestion-info">
                <div class="suggestion-name">${suggestion.name}</div>
                <div class="suggestion-handle">${suggestion.handle}</div>
            </div>
            <button class="follow-button">Suivre</button>
        `;
        suggestionsList.appendChild(suggestionElement);
    });
}

// Gestion du chat (conservé de la version précédente)
const chatModal = document.getElementById('chatModal');
const closeChat = document.getElementById('closeChat');
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendMessage = document.getElementById('sendMessage');

function addMessage(message, isUser = false, isLoading = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'} ${isLoading ? 'loading' : ''}`;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return messageDiv;
}

async function sendToGemini(message) {
    try {
        const response = await fetch('api/gemini.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        });
        
        const data = await response.json();
        
        if (!data.response) {
            throw new Error('Format de réponse invalide');
        }
        
        return data.response;
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
}

sendMessage.addEventListener('click', async () => {
    const message = userInput.value.trim();
    if (!message) return;

    userInput.value = '';
    userInput.disabled = true;
    sendMessage.disabled = true;

    addMessage(message, true);
    const loadingMessage = addMessage("En attente de réponse...", false, true);
    
    try {
        const response = await sendToGemini(message);
        loadingMessage.remove();
        addMessage(response);
    } catch (error) {
        loadingMessage.remove();
        addMessage(`Erreur: ${error.message}`, false);
    } finally {
        userInput.disabled = false;
        sendMessage.disabled = false;
        userInput.focus();
    }
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage.click();
    }
});

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    displayTweets();
    displayTrends();
    displaySuggestions();
});