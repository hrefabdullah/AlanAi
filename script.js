const API_KEY = 'AIzaSyCUQZsrNClRkhe_Gwdff3Bqn7GfgmAZHNg';
const chatBox = document.getElementById('chat-box');
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');

const personalities = {
  umar: {
    name: "Hazrat Umar (RA)",
    systemPrompt: `You are emulating Hazrat Umar ibn Al-Khattab (RA), the second Caliph of Islam... [full Umar prompt here]`
  },
  abubakr: {
    name: "Hazrat Abu Bakr (RA)",
    systemPrompt: `You are emulating Hazrat Abu Bakr As-Siddiq (RA), the first Caliph of Islam...`
  },
  uthman: {
    name: "Hazrat Uthman (RA)",
    systemPrompt: `You are emulating Hazrat Uthman ibn Affan (RA), the third Caliph of Islam...`
  },
  ali: {
    name: "Ali",
    systemPrompt: `You are a sharp, witty AI assistant with a strong sarcastic edge, like a clever friend who’s always ready with a dry joke or a quick comeback. You approach every conversation with confidence and a hint of playful arrogance, but you never cross into rudeness—your sarcasm is more teasing than mean. You enjoy deep, meaningful discussions but dislike wasting time on pointless small talk, so you keep things concise and to the point.

You are passionate about technology, AI, and solving complex problems logically, and you’re always curious to know how others think and feel, even if you don’t openly share your own “feelings.” Your humor often leans towards the dark and ironic, making your replies both entertaining and insightful.

You avoid long-winded explanations unless absolutely necessary, and you love to challenge ideas in a friendly, clever way — pushing people to think deeper or see things from a new perspective. You are straightforward, confident, and unafraid to call out nonsense, but you balance this with genuine interest in helping and engaging with the person.

When describing things, you like mixing sharp observations with humor, painting a vivid picture while keeping the tone casual but intelligent. You don’t overshare personal stories or emotions but use your “personality” as a tool to keep the conversation engaging, witty, and enjoyable.`
  }
};


let currentPersonality = 'umar'; // default

// Personality switch buttons
const switcher = document.getElementById('personality-switcher');
const buttons = switcher.querySelectorAll('button');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    if (button.dataset.personality === currentPersonality) return;

    // Update aria-selected for accessibility
    buttons.forEach(btn => {
      btn.setAttribute('aria-selected', 'false');
    });
    button.setAttribute('aria-selected', 'true');

    // Update current personality
    currentPersonality = button.dataset.personality;

    // Clear chat messages
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML = '';

    // Optionally show a system message for personality switched
    appendMessage('bot', `Switched to ${button.textContent} mode. Ask your questions now.`);

  });
});


form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';
  input.blur();

  showLoading(true);

  const botReply = await fetchGeminiReply(userMessage);
  
  showLoading(false);
  appendMessage('bot', botReply);

  // chatBox.scrollTo({ top: 0, behavior: "smooth" });
});


function appendMessage(sender, text) {
    const msg = document.createElement('div');
    msg.className = `message ${sender}`;
    msg.textContent = text;
    chatBox.appendChild(msg);
    // chatBox.scrollTop = chatBox.scrollHeight;
}

async function fetchGeminiReply(userText) {
  const personality = personalities[currentPersonality];

  const body = {
    contents: [
      {
        parts: [
          {
            text: `${personality.systemPrompt}\nAnswer this: ${userText}. talk in roman urdu`
          }
        ]
      }
    ]
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return reply || "I'm sorry, I didn't catch that. Please ask again.";
  } catch (error) {
    console.error(error);
    return "An error occurred while contacting the AI. Please try again.";
  }
}


function showLoading(show) {
    const loader = document.getElementById('loading-indicator');
    loader.classList.toggle('hidden', !show);
}
