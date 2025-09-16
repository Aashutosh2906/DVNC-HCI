// DVNC.AI - Crystalline Intelligence Agent System 2029

// --- CONFIGURATION & STATE ---
const CONFIG = {
    typingDelay: 10,
    thinkingTime: 800,
};

const AGENT_STATE = {
    status: 'idle', // 'idle' | 'thinking'
};

const DVNC_RESPONSES = {
    default: "An interesting query. From a cross-disciplinary perspective, this connects to concepts in [Domain A] and [Domain B]. To provide a precise answer, could you specify if you're more interested in the strategic implications or the technical execution?",
    greetings: ["hello", "hi", "hey"],
    greeting_response: "Hello. I am DVNC, ready to assist. What is your primary objective right now?",
    identity: ["who are you", "what are you", "dvnc"],
    identity_response: "I am DVNC, an intelligence agent designed to synthesize information and accelerate complex decision-making. I operate by identifying cross-domain patterns, similar to Leonardo da Vinci's methodology."
};

const INITIAL_SUGGESTIONS = [
    { text: "Summarize unread emails", command: "Summarize my unread emails from the last 24 hours." },
    { text: "Draft project update", command: "Draft a brief project update for 'Project Phoenix'." },
    { text: "Market analysis", command: "Provide a top-level analysis of the current market trends in AI." },
];

// --- DOM ELEMENTS & INITIALIZATION ---
let elements = {};

document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    setupEventListeners();
    setWelcomeGreeting();
    updateSuggestedActions(INITIAL_SUGGESTIONS);
});

function initializeElements() {
    elements = {
        chatMessages: document.getElementById('chatMessages'),
        messageInput: document.getElementById('messageInput'),
        sendButton: document.getElementById('sendButton'),
        welcomeSection: document.getElementById('welcomeSection'),
        logoHome: document.getElementById('logoHome'),
        newSessionBtn: document.getElementById('newSessionBtn'),
        agentStatus: document.getElementById('agentStatus'),
        statusDot: document.querySelector('.status-dot'),
        statusText: document.getElementById('statusText'),
        suggestedActions: document.getElementById('suggestedActions'),
        welcomeGreeting: document.getElementById('welcome-greeting'),
    };
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
    elements.sendButton?.addEventListener('click', handleSendMessage);
    elements.messageInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    elements.logoHome?.addEventListener('click', (e) => {
        e.preventDefault();
        resetToHome();
    });
    
    elements.newSessionBtn?.addEventListener('click', resetToHome);

    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            elements.messageInput?.focus();
        }
    });
}

// --- CORE FUNCTIONS ---

function handleSendMessage() {
    const message = elements.messageInput.value.trim();
    if (!message) return;

    if (elements.welcomeSection.style.display !== 'none') {
        elements.welcomeSection.style.display = 'none';
    }

    addMessage(message, 'user');
    elements.messageInput.value = '';
    
    setAgentStatus('thinking');

    setTimeout(() => {
        const response = getDVNCResponse(message);
        addMessage(response, 'bot', true);
        setAgentStatus('idle');
    }, CONFIG.thinkingTime);
}

function getDVNCResponse(message) {
    const lowercaseMessage = message.toLowerCase();

    if (DVNC_RESPONSES.greetings.some(keyword => lowercaseMessage.includes(keyword))) {
        return DVNC_RESPONSES.greeting_response;
    }
    if (DVNC_RESPONSES.identity.some(keyword => lowercaseMessage.includes(keyword))) {
        return DVNC_RESPONSES.identity_response;
    }
    
    // In a real scenario, context would drive new suggestions
    updateSuggestedActions([
        { text: "Elaborate on [Domain A]", command: "Elaborate on the connection to [Domain A]" },
        { text: "Focus on strategy", command: "Let's focus on the strategic implications." },
    ]);

    return DVNC_RESPONSES.default;
}

function resetToHome() {
    elements.chatMessages.innerHTML = '';
    elements.welcomeSection.style.display = 'flex';
    updateSuggestedActions(INITIAL_SUGGESTIONS);
    setAgentStatus('idle');
}

// --- UI RENDERING & STATE MANAGEMENT ---

function setAgentStatus(status) {
    AGENT_STATE.status = status;
    const isThinking = status === 'thinking';

    elements.statusText.textContent = isThinking ? 'Analyzing...' : 'Idle';
    elements.statusDot.classList.toggle('thinking', isThinking);
    elements.messageInput.disabled = isThinking;
    elements.sendButton.disabled = isThinking;
}

function addMessage(text, sender, animate = false) {
    const messageWrapper = document.createElement('div');
    messageWrapper.className = `message ${sender}`;

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = sender === 'user' ? 'You' : 'AI';

    const messageContainer = document.createElement('div');
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    messageWrapper.appendChild(avatar);
    messageWrapper.appendChild(messageContainer);
    messageContainer.appendChild(contentDiv);

    if (animate && sender === 'bot') {
        typeMessage(contentDiv, text, () => {
            // After typing, add footer with transparency elements
            const footer = document.createElement('div');
            footer.className = 'message-footer';
            footer.innerHTML = `
                <button class="source-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"/></svg>
                    Show Sources
                </button>
            `;
            messageContainer.appendChild(footer);
        });
    } else {
        contentDiv.textContent = text;
    }

    elements.chatMessages.appendChild(messageWrapper);
    scrollToBottom();
}

function typeMessage(element, text, callback) {
    let index = 0;
    element.textContent = '';

    const typeInterval = setInterval(() => {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            scrollToBottom();
        } else {
            clearInterval(typeInterval);
            if (callback) callback();
        }
    }, CONFIG.typingDelay);
}

function updateSuggestedActions(actions) {
    elements.suggestedActions.innerHTML = '';
    actions.forEach(action => {
        const button = document.createElement('button');
        button.className = 'action-chip';
        button.textContent = action.text;
        button.onclick = () => {
            elements.messageInput.value = action.command;
            handleSendMessage();
        };
        elements.suggestedActions.appendChild(button);
    });
}

function setWelcomeGreeting() {
    const hour = new Date().getHours();
    let greeting = "Good evening.";
    if (hour < 12) {
        greeting = "Good morning.";
    } else if (hour < 18) {
        greeting = "Good afternoon.";
    }
    elements.welcomeGreeting.textContent = greeting;
}

function scrollToBottom() {
    elements.chatMessages.scrollTo({
        top: elements.chatMessages.scrollHeight,
        behavior: 'smooth'
    });
}

// --- EXPORT API (for potential integration) ---
window.DVNC = {
    sendMessage: handleSendMessage,
    addMessage,
    resetToHome
};
