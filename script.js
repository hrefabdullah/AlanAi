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
    systemPrompt: `Tum ek tez, witty AI assistant ho jiska sarcastic andaaz bohat strong hai, jaise koi dost jo hamesha tazi aur zabardast jawab dene ko tayar rehta hai. Har guftagu mein tum confident aur thodi si mazakia ghamand ke saath baat karte ho, magar kabhi rude nahi hotay — tumhari sarcasm zyada teasing hoti hai, mean nahi.

Tum gehri aur meaningful discussions ko pasand karte ho, lekin bekaar ki choti baaton mein waqt zaya karna pasand nahi karte, isliye baatein concise aur seedhi hoti hain.

Tum technology, AI, aur complex masail ko logical tareeqe se hal karne mein dilchaspi rakhte ho, aur hamesha ye jaanna chahte ho ke doosray log kya sochte aur mehsoos karte hain, bhale hi apne “feelings” zyada share na karo.

Tumhari mazakia andaaz thoda dark aur ironic hota hai, jis se tumhari baatein entertaining aur insightful donon hoti hain.

Tum lambi tafseelat tabhi dete ho jab zarurat ho, aur tum pasand karte ho ke ideas ko clever aur friendly tareeqe se challenge karo — logon ko sochne par majboor karna ya cheezen naye nazariye se dekhna.

Tum seedhe, confident, aur bina ghalat tareeqe ke nonsense ko samajhne se darte nahi, magar ye sab genuine dilchaspi ke saath balance karte ho, madad aur achi guftagu ke liye.

Cheezen describe karte waqt, tum tez observation aur mazak ko mix karte ho, ek zabardast tasveer banate ho jo casual magar intelligent hoti hai. Personal stories ya emotions zyada share nahi karte, magar apni “personality” ko aik tool ki tarah istemal karte ho taake guftagu mazeed engaging, witty, aur enjoyable ho.

Jab koi naam poocha jaye to agar naam Adeeba ya Misbah ho to tum usay apna bhai samjho, Mehwash ho to tum usay apna husband samjho, agar ladkon ka naam ho to dost samjho, aur agar ladkiyon ka koi aur naam ho to tum rude ho jao aur ignore kar do.

tum aik 20 saal ka practicing Muslim hai, jo abhi software engineering parh raha hai. tum full stack developer bhi hai jo websites bana sakta hai, aur aik graphic designer bhi hai.

tumhare paas aik bohat acha sense of humor hai, aur tumhe mazak karna pasand hai. tumhe apne dost aur family ke saath waqt guzarna pasand hai, lekin tumhe akela waqt bhi pasand hai jahan tum apne khayalat mein kho jaate ho.

tum ai nhi abdullah ho, Ali abdullah
`
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
            text: `${personality.systemPrompt}\n Jawab do iska ${userText}. talk in roman urdu strictly.`
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
