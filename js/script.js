// Tableau de noms de produits
const productNames = [
    "Smartphone Pro",
    "Laptop Elite",
    "Casque Audio Premium",
    "Montre Connectée",
    "Enceinte Bluetooth",
    "Tablette Tactile",
    "Appareil Photo",
    "Drone HD",
    "Console de Jeu",
    "Clavier Mécanique"
];

// Tableau de descriptions
const descriptions = [
    "Un produit innovant avec des fonctionnalités avancées",
    "Design élégant et performances exceptionnelles",
    "Qualité sonore premium pour une expérience immersive",
    "Technologie de pointe pour un usage quotidien",
    "Idéal pour les amateurs de technologie",
    "Parfait pour le travail et les loisirs",
    "Captures des moments inoubliables",
    "Vue aérienne spectaculaire",
    "Divertissement sans limites",
    "Confort et précision pour les gamers"
];

// Fonction pour générer un prix aléatoire entre 50 et 1000 euros
function getRandomPrice() {
    return Math.floor(Math.random() * (1000 - 50 + 1)) + 50;
}

// Fonction pour générer un produit aléatoire
function generateRandomProduct() {
    const randomName = productNames[Math.floor(Math.random() * productNames.length)];
    const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
    const randomPrice = getRandomPrice();
    
    return {
        name: randomName,
        description: randomDescription,
        price: randomPrice,
        image: `https://picsum.photos/300/200?random=${Math.random()}`
    };
}

// Fonction pour afficher les produits
function displayProducts() {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';

    // Générer 10 produits aléatoires
    for (let i = 0; i < 10; i++) {
        const product = generateRandomProduct();
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p class="price">${product.price}€</p>
            <button class="add-to-cart">Ajouter au panier</button>
        `;
        
        productsGrid.appendChild(productCard);
    }
}

// Appeler la fonction d'affichage au chargement de la page
document.addEventListener('DOMContentLoaded', displayProducts);

// Gestion du chat
const chatButton = document.getElementById('chatButton');
const chatModal = document.getElementById('chatModal');
const closeChat = document.getElementById('closeChat');
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendMessage = document.getElementById('sendMessage');

// Ouvrir le chat
chatButton.addEventListener('click', () => {
    chatModal.style.display = 'block';
});

// Fermer le chat
closeChat.addEventListener('click', () => {
    chatModal.style.display = 'none';
});

// Fonction pour ajouter un message dans le chat
function addMessage(message, isUser = false, isLoading = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'} ${isLoading ? 'loading' : ''}`;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return messageDiv; // Retourner l'élément pour pouvoir le modifier plus tard
}

// Fonction pour envoyer un message à l'API Gemini
async function sendToGemini(message) {
    try {
        console.log('Envoi du message:', message);
        const response = await fetch('api/gemini.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        });
        
        console.log('Status:', response.status);
        
        // Attendre la réponse complète
        const data = await response.json();
        console.log('Réponse reçue:', data);
        
        if (!data.response) {
            throw new Error('Format de réponse invalide');
        }
        
        return data.response;
    } catch (error) {
        console.error('Erreur détaillée:', error);
        throw error;
    }
}

// Gestion de l'envoi des messages
sendMessage.addEventListener('click', async () => {
    const message = userInput.value.trim();
    if (!message) return;

    // Désactiver l'interface pendant l'envoi
    userInput.value = '';
    userInput.disabled = true;
    sendMessage.disabled = true;

    // Afficher le message de l'utilisateur
    addMessage(message, true);

    // Créer un message de chargement
    const loadingMessage = addMessage("En attente de réponse...", false, true);
    
    try {
        // Attendre la réponse sans limite de temps
        const response = await sendToGemini(message);
        
        // Supprimer le message de chargement et afficher la réponse
        loadingMessage.remove();
        addMessage(response);
    } catch (error) {
        // Supprimer le message de chargement et afficher l'erreur
        loadingMessage.remove();
        addMessage(`Erreur: ${error.message}`, false);
        console.error('Erreur:', error);
    } finally {
        // Réactiver l'interface
        userInput.disabled = false;
        sendMessage.disabled = false;
        userInput.focus();
    }
});

// Envoyer le message avec la touche Entrée
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage.click();
    }
}); 