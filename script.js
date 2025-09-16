// DVNC.AI - Crystalline Intelligence Agent System 2029 (v2)

// --- CONFIGURATION & STATE ---
const CONFIG = {
    typingDelay: 10,
    thinkingTime: 2500, // Increased to allow for animation
    neuralParticles: 30,
};

const DVNC_RESPONSES = {
    default: "A fascinating challenge. By synthesizing principles from biomechanics and materials science, we can conceptualize a solution. The primary structure should optimize for load distribution, mimicking the trabecular architecture of bone. For the actuation system, we could explore electro-active polymers for silent, fluid motion. Would you like to model the kinetic chain or explore material composites first?",
    greetings: ["hello", "hi", "hey"],
    greeting_response: "Greetings. I am DVNC. How may I assist your inquiry today?",
    identity: ["who are you", "what are you", "dvnc"],
    identity_response: "I am DVNC, an intelligence agent. I process challenges by integrating knowledge from a vast corpus of scientific and artistic domains, inspired by Leonardo da Vinci's polymathic approach."
};

const INITIAL_SUGGESTIONS = [
    { text: "Develop a water pump system...", command: "Develop a portable water pump system inspired by fluid dynamics principles." },
    { text: "Design an exoskeleton suit...", command: "Design an exoskeleton suit that enhances joint articulation for heavy lifting." },
    { text: "Create a wearable device...", command: "Create a wearable device that monitors the circulatory system during exercise." },
];

const DA_VINCI_SOURCES = [
    "Codex Leicester (Fluid Dynamics)", "Anatomical Studies (Folio B)", "Treatise on Painting", "Codex on the Flight of Birds", "Vitruvian Man (Proportions)"
];

// --- DOM ELEMENTS & INITIALIZATION ---
let elements = {};
let canvas, ctx, neuralParticles = [];

document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    setupEventListeners();
    setWelcomeGreeting();
    updateSuggestedActions(INITIAL_SUGGESTIONS);
    initNeuralCanvas();
});

function initializeElements() {
    elements = {
        chatMessages: document.getElementById('chatMessages'),
        messageInput: document.getElementById('messageInput'),
        sendButton: document.getElementById('sendButton'),
        welcomeSection: document.getElementById('welcomeSection'),
        logoHome: document.getElementById('logoHome'),
        newSessionBtn: document.getElementById('newSessionBtn'),
        suggestedActions: document.getElementById('suggestedActions'),
        welcomeGreeting: document.getElementById('welcome-greeting'),
        neuralCanvas: document.getElementById('neuralCanvas'),
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
    elements.logoHome?.addEventListener('click', (e) => { e.preventDefault(); resetToHome(); });
    elements.newSessionBtn?.addEventListener('click', resetToHome);
}

// --- CORE FUNCTIONS ---

function handleSendMessage() {
    const message = elements.messageInput.value.trim();
    if (!message) return;

    if (elements.welcomeSection.style.display !== 'none') {
        elements.welcomeSection.style.display = 'none';
        elements.newSessionBtn.classList.remove('hidden'); // Show New Session btn
    }

    addMessage(message, 'user');
    elements.messageInput.value = '';
    
    // Disable input while thinking
    elements.messageInput.disabled = true;
    elements.sendButton.disabled = true;

    // Show the new "thinking" animation
    showThinkingAnimation();

    setTimeout(() => {
        // Remove thinking animation and add the real response
        document.getElementById('thinkingAnimation')?.remove();
        const response = getDVNCResponse(message);
        addMessage(response, 'bot', true);

        // Re-enable input
        elements.messageInput.disabled = false;
        elements.sendButton.disabled = false;
        elements.messageInput.focus();
    }, CONFIG.thinkingTime);
}

function getDVNCResponse(message) {
    const lowercaseMessage = message.toLowerCase();
    if (DVNC_RESPONSES.greetings.some(k => lowercaseMessage.includes(k))) return DVNC_RESPONSES.greeting_response;
    if (DVNC_RESPONSES.identity.some(k => lowercaseMessage.includes(k))) return DVNC_RESPONSES.identity_response;
    return DVNC_RESPONSES.default;
}

function resetToHome() {
    elements.chatMessages.innerHTML = '';
    elements.welcomeSection.style.display = 'flex';
    elements.newSessionBtn.classList.add('hidden');
    updateSuggestedActions(INITIAL_SUGGESTIONS);
}

// --- UI RENDERING & ANIMATIONS ---

function showThinkingAnimation() {
    const thinkingDiv = document.createElement('div');
    thinkingDiv.id = 'thinkingAnimation';
    thinkingDiv.className = 'bot-thinking-animation message';
    
    thinkingDiv.innerHTML = `
        <div class="avatar">AI</div>
        <div class="thinking-content">
            Synthesizing...
            <div class="knowledge-sources">
                <div class="ks-tag">Physics</div>
                <div class="ks-tag">Biomechanics</div>
                <div class="ks-tag">Anatomy</div>
            </div>
        </div>
    `;
    elements.chatMessages.appendChild(thinkingDiv);
    scrollToBottom();
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
            const footer = document.createElement('div');
            footer.className = 'message-footer';
            const randomSource = DA_VINCI_SOURCES[Math.floor(Math.random() * DA_VINCI_SOURCES.length)];
            footer.innerHTML = `
                <button class="source-btn" title="Primary knowledge base for this response">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                    Source: ${randomSource}
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
            element.textContent += text.charAt(index++);
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
    if (hour < 12) greeting = "Good morning.";
    else if (hour < 18) greeting = "Good afternoon.";
    elements.welcomeGreeting.textContent = greeting;
}

function scrollToBottom() {
    elements.chatMessages.scrollTo({ top: elements.chatMessages.scrollHeight, behavior: 'smooth' });
}

// --- SUBTLE CANVAS BACKGROUND ---

function initNeuralCanvas() {
    canvas = elements.neuralCanvas;
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    neuralParticles = [];
    for (let i = 0; i < CONFIG.neuralParticles; i++) {
        neuralParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
            radius: Math.random() * 1.5 + 0.5,
        });
    }
    animateNeuralNetwork();
}

function animateNeuralNetwork() {
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const particleColor = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)';
    const lineColor = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

    neuralParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
    });

    for (let i = 0; i < neuralParticles.length; i++) {
        for (let j = i; j < neuralParticles.length; j++) {
            const p1 = neuralParticles[i];
            const p2 = neuralParticles[j];
            const distance = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

            if (distance < 150) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animateNeuralNetwork);
}
