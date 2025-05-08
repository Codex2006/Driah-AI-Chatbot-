// Main Application

document.addEventListener('DOMContentLoaded', function() {

    // DOM Elements

    const chatMessages = document.getElementById('chatMessages');

    const userInput = document.getElementById('userInput');

    const sendButton = document.getElementById('sendButton');

    const darkModeToggle = document.getElementById('darkModeToggle');

    const downloadChatBtn = document.getElementById('downloadChat');

    const toggleDictBtn = document.getElementById('toggleDict');

    const dictionaryView = document.getElementById('dictionaryView');

    const closeDict = document.getElementById('closeDict');

    const wordsList = document.getElementById('wordsList');

    const addWordBtn = document.getElementById('addWordBtn');

    const newWordInput = document.getElementById('newWord');

    const wordMeaningInput = document.getElementById('wordMeaning');

    const wordExampleInput = document.getElementById('wordExample');

    // State

    let chatHistory = [];

    let dictionary = {};

    let isTyping = false;

    let darkMode = localStorage.getItem('darkMode') === 'true';

    // Initialize application

    init();

    // Initialize application

    function init() {

        loadChatHistory();

        loadDictionary();

        applyDarkMode();

        renderDictionary();

        displayWelcomeMessage();

        setupEventListeners();

    }

    // Load chat history from localStorage

    function loadChatHistory() {

        const savedChat = localStorage.getItem('driah_chat_history');

        if (savedChat) {

            chatHistory = JSON.parse(savedChat);

            renderChatHistory();

        }

    }

    // Load dictionary from localStorage

    function loadDictionary() {

        const savedDict = localStorage.getItem('driah_dictionary');

        if (savedDict) {

            dictionary = JSON.parse(savedDict);

        } else {

            // Initialize with some base dictionary entries

            dictionary = {

                'hello': {

                    meaning: 'A greeting used when meeting someone.',

                    example: 'Hello, how are you today?'

                },

                'goodbye': {

                    meaning: 'A farewell used when parting ways with someone.',

                    example: 'I have to go now, goodbye!'

                },

                'artificial intelligence': {

                    meaning: 'The simulation of human intelligence in machines programmed to think and learn like humans.',

                    example: 'Driah AI uses artificial intelligence to understand and respond to messages.'

                },

                'chatbot': {

                    meaning: 'A computer program designed to simulate conversation with human users.',

                    example: 'Driah is a chatbot that can have conversations with users.'

                },

                'driah': {

                    meaning: 'The nickname of Gift Sumaiya, the girlfriend of Omare Emmanuel (Omar Lainz).',

                    example: 'Driah AI was named after Gift Sumaiya, whose nickname is Driah.'

                }

            };

            saveDictionary();

        }

    }

    // Apply dark mode based on user preference

    function applyDarkMode() {

        if (!darkMode) {

            document.body.classList.add('light-theme');

        } else {

            document.body.classList.remove('light-theme');

        }

    }

    // Setup all event listeners

    function setupEventListeners() {

        // Send message on button click

        sendButton.addEventListener('click', sendMessage);

        

        // Send message on Enter key press

        userInput.addEventListener('keypress', function(e) {

            if (e.key === 'Enter') {

                sendMessage();

            }

        });

        

        // Toggle dark mode

        darkModeToggle.addEventListener('click', function() {

            darkMode = !darkMode;

            localStorage.setItem('darkMode', darkMode);

            applyDarkMode();

        });

        

        // Download chat

        downloadChatBtn.addEventListener('click', downloadChatHistory);

        

        // Dictionary toggle

        toggleDictBtn.addEventListener('click', function() {

            dictionaryView.classList.toggle('active');

        });

        

        // Close dictionary

        closeDict.addEventListener('click', function() {

            dictionaryView.classList.remove('active');

        });

        

        // Add word to dictionary

        addWordBtn.addEventListener('click', addNewWord);

    }

    // Render entire chat history

    function renderChatHistory() {

        chatMessages.innerHTML = '';

        chatHistory.forEach(message => {

            const messageElement = createMessageElement(message.text, message.sender);

            chatMessages.appendChild(messageElement);

        });

        scrollToBottom();

    }

    // Render dictionary view

    function renderDictionary() {

        wordsList.innerHTML = '';

        const words = Object.keys(dictionary).sort();

        

        words.forEach(word => {

            const wordItem = document.createElement('div');

            wordItem.className = 'word-item';

            

            wordItem.innerHTML = `

                <h4>${word}</h4>

                <p><strong>Meaning:</strong> ${dictionary[word].meaning}</p>

                <p><strong>Example:</strong> ${dictionary[word].example}</p>

            `;

            

            wordsList.appendChild(wordItem);

        });

    }

    // Add a new word to the dictionary

    function addNewWord() {

        const word = newWordInput.value.trim().toLowerCase();

        const meaning = wordMeaningInput.value.trim();

        const example = wordExampleInput.value.trim();

        

        if (word && meaning) {

            dictionary[word] = {

                meaning: meaning,

                example: example || "No example provided."

            };

            

            saveDictionary();

            renderDictionary();

            

            // Clear form

            newWordInput.value = '';

            wordMeaningInput.value = '';

            wordExampleInput.value = '';

            

            // Add confirmation message to chat

            addMessage(`I've learned the word "${word}"! Thank you for teaching me.`, 'bot');

        }

    }

    // Display welcome message

    function displayWelcomeMessage() {

        if (chatHistory.length === 0) {

            setTimeout(() => {

                addMessage("Hello! I'm Driah AI, your friendly chatbot assistant. How can I help you today?", 'bot');

            }, 500);

        }

    }

    // Send a message

    function sendMessage() {

        const message = userInput.value.trim();

        if (message && !isTyping) {

            // Add user message to chat

            addMessage(message, 'user');

            userInput.value = '';

            

            // Generate and display bot response with typing animation

            showTypingIndicator();

            

            setTimeout(() => {

                hideTypingIndicator();

                const response = generateResponse(message);

                addMessage(response, 'bot');

            }, 1000 + Math.random() * 1000);

        }

    }

    // Create message element

    function createMessageElement(text, sender) {

        const messageContainer = document.createElement('div');

        messageContainer.className = 'message-container';

        

        const messageElement = document.createElement('div');

        messageElement.className = `message ${sender}-message`;

        messageElement.textContent = text;

        

        // Add delete button for both user and bot messages

        const messageActions = document.createElement('div');

        messageActions.className = 'message-actions';

        

        const deleteBtn = document.createElement('div');

        deleteBtn.className = 'delete-msg';

        deleteBtn.innerHTML = '×';

        deleteBtn.addEventListener('click', function() {

            const index = chatHistory.findIndex(m => m.text === text && m.sender === sender);

            if (index !== -1) {

                chatHistory.splice(index, 1);

                saveChatHistory();

                messageContainer.remove();

            }

        });

        

        messageActions.appendChild(deleteBtn);

        messageContainer.appendChild(messageActions);

        messageContainer.appendChild(messageElement);

        

        return messageContainer;

    }

    // Add message to chat

    function addMessage(text, sender) {

        const messageElement = createMessageElement(text, sender);

        chatMessages.appendChild(messageElement);

        

        // Add to chat history

        chatHistory.push({

            text: text,

            sender: sender,

            timestamp: new Date().toISOString()

        });

        

        saveChatHistory();

        scrollToBottom();

    }

    // Show typing indicator

    function showTypingIndicator() {

        isTyping = true;

        const indicator = document.createElement('div');

        indicator.className = 'typing-indicator';

        indicator.id = 'typingIndicator';

        

        for (let i = 0; i < 3; i++) {

            const dot = document.createElement('div');

            dot.className = 'typing-dot';

            indicator.appendChild(dot);

        }

        

        chatMessages.appendChild(indicator);

        scrollToBottom();

    }

    // Hide typing indicator

    function hideTypingIndicator() {

        isTyping = false;

        const indicator = document.getElementById('typingIndicator');

        if (indicator) {

            indicator.remove();

        }

    }

    // Generate bot response

    function generateResponse(message) {

        // Convert message to lowercase for easier matching

        const lowerMsg = message.toLowerCase();

        

        // Check for predefined responses

        if (lowerMsg.includes("what's your name") || lowerMsg.includes("who are you")) {

            return "I'm Driah AI, a chatbot created to assist and chat with you.";

        }

        

        if (lowerMsg.includes("who created you") || lowerMsg.includes("who made you")) {

            return "I was created by Omare Emmanuel, also known as Omar Lainz.";

        }

        

        if (lowerMsg.includes("how do you feel") || lowerMsg.includes("how are you feeling")) {

            return "As an AI, I don't have feelings in the human sense, but I'm functioning well and ready to assist you!";

        }

        

        if (lowerMsg.includes("what does your name mean") || lowerMsg.includes("why are you called driah")) {

            return "My name comes from Gift Sumaiya, the girlfriend of my creator Omare Emmanuel. Driah is her nickname.";

        }

        

        if (lowerMsg.includes("i'm sad") || lowerMsg.includes("feeling down") || lowerMsg.includes("i am sad")) {

            return "I'm sorry to hear that you're feeling sad. Remember that it's okay to feel this way sometimes, and things will get better. Is there anything specific that's bothering you that you'd like to talk about?";

        }

        

        if (lowerMsg.includes("i'm happy") || lowerMsg.includes("feeling good") || lowerMsg.includes("i am happy")) {

            return "That's wonderful to hear! It's great that you're feeling happy. What's contributing to your good mood today?";

        }

        

        if (lowerMsg.includes("tell me a joke")) {

            const jokes = [

                "Why don't scientists trust atoms? Because they make up everything!",

                "Why was the math book sad? Because it had too many problems.",

                "What do you call a fake noodle? An impasta!",

                "How does a computer get drunk? It takes screenshots!",

                "Why did the scarecrow win an award? Because he was outstanding in his field!"

            ];

            return jokes[Math.floor(Math.random() * jokes.length)];

        }

        

        // Check if user is asking about a word in the dictionary

        if (lowerMsg.startsWith("define ") || lowerMsg.startsWith("what is ") || lowerMsg.startsWith("what are ")) {

            const wordToDefine = lowerMsg.replace(/^(define|what is|what are)\s+/, "").replace(/[?.,!]/g, "").trim();

            

            if (dictionary[wordToDefine]) {

                return `${wordToDefine}: ${dictionary[wordToDefine].meaning}\n\nExample: ${dictionary[wordToDefine].example}`;

            }

        }

        

        // Check if user is asking about dictionary or words

        if (lowerMsg.includes("show me your dictionary") || lowerMsg.includes("what words do you know")) {

            const wordCount = Object.keys(dictionary).length;

            return `I currently know ${wordCount} words and phrases. You can view them by clicking the Dictionary button at the top of the screen.`;

        }

        

        // Check for adding a word syntax

        if (lowerMsg.startsWith("learn ")) {

            const wordParts = message.substring(6).split(":");

            if (wordParts.length >= 2) {

                const newWord = wordParts[0].trim().toLowerCase();

                const meaning = wordParts[1].trim();

                let example = "No example provided.";

                

                if (wordParts.length >= 3) {

                    example = wordParts[2].trim();

                }

                

                dictionary[newWord] = {

                    meaning: meaning,

                    example: example

                };

                

                saveDictionary();

                renderDictionary();

                

                return `I've learned the word "${newWord}"! Thank you for teaching me.`;

            }

        }

        

        // Handle emoji responses

        if (/^(😊|😃|😄|😁|🙂|😀)$/.test(lowerMsg)) {

            return "I'm glad you're happy! How can I help you today?";

        }

        

        if (/^(😢|😭|😔|☹️|🙁|😞)$/.test(lowerMsg)) {

            return "I'm sorry you're feeling down. Is there something I can do to help?";

        }

        

        if (/^(❤️|💕|😍|🥰|💖|💗)$/.test(lowerMsg)) {

            return "Thank you for the love! I appreciate your kindness.";

        }

        

        // Handle greeting

        if (lowerMsg.match(/^(hi|hello|hey|greetings).*/i)) {

            return `Hello there! How can I assist you today?`;

        }

        

        // Handle farewell

        if (lowerMsg.match(/^(goodbye|bye|see you|farewell).*/i)) {

            return "Goodbye! Feel free to chat with me again anytime.";

        }

        

        // Handle thanking

        if (lowerMsg.match(/^(thanks|thank you|ty).*/i)) {

            return "You're welcome! Is there anything else I can help you with?";

        }

        

        // Generic responses for when no specific rule applies

        const genericResponses = [

            "That's interesting! Tell me more about it.",

            "I'm still learning about many topics. Could you tell me more?",

            "I understand what you're saying. How can I help you with that?",

            "That's a great point! Would you like to discuss it further?",

            "I'm here to chat with you about anything you'd like to talk about.",

            "That's fascinating! I'd love to learn more about your perspective.",

            "I appreciate you sharing that with me. What else would you like to talk about?",

            "I'm not fully trained on that topic yet, but I'm eager to learn more. Can you elaborate?"

        ];

        

        return genericResponses[Math.floor(Math.random() * genericResponses.length)];

    }

    // Save chat history to localStorage

    function saveChatHistory() {

        localStorage.setItem('driah_chat_history', JSON.stringify(chatHistory));

    }

    // Save dictionary to localStorage

    function saveDictionary() {

        localStorage.setItem('driah_dictionary', JSON.stringify(dictionary));

    }

    // Download chat history as text file

    function downloadChatHistory() {

        if (chatHistory.length === 0) {

            addMessage("There's no chat history to download yet!", 'bot');

            return;

        }

        

        let chatText = "Driah AI Chat History\n";

        chatText += "=====================\n\n";

        

        chatHistory.forEach(message => {

            const sender = message.sender === 'user' ? 'You' : 'Driah AI';

            chatText += `${sender}: ${message.text}\n\n`;

        });

        

        const blob = new Blob([chatText], { type: 'text/plain' });

        const url = URL.createObjectURL(blob);

        

        const a = document.createElement('a');

        a.href = url;

        a.download = 'driah_chat_history.txt';

        document.body.appendChild(a);

        a.click();

        

        setTimeout(() => {

            document.body.removeChild(a);

            URL.revokeObjectURL(url);

        }, 100);

        

        addMessage("Chat history downloaded successfully!", 'bot');

    }

    // Auto-scroll to the bottom of chat

    function scrollToBottom() {

        chatMessages.scrollTop = chatMessages.scrollHeight;

    }

});