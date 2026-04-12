document.addEventListener("DOMContentLoaded", () => {

    const chatbotBtn = document.getElementById("chatbotBtn");
    const chatbotPopup = document.getElementById("chatbotPopup");
    const closeBtn = document.getElementById("closeBtn");
    const inputEl = document.getElementById("userMessage");
    const chatBox = document.getElementById("chatBox");

    // Toggle chatbot
    chatbotBtn.addEventListener("click", () => {
        chatbotPopup.classList.toggle("hidden");

        // First message
        if (!chatbotPopup.classList.contains("hidden") && chatBox.innerHTML === "") {
            appendMessage(chatBox, "Hi! I'm here to help you 💙", "bot");
        }
    });

    // Close chatbot
    closeBtn.addEventListener("click", () => {
        chatbotPopup.classList.add("hidden");
        chatBox.innerHTML = "";
        inputEl.value = "";
    });

    // Send message
    window.sendMessage = function () {
        const input = inputEl.value.trim();
        if (!input) return;

        appendMessage(chatBox, input, "user");

        const text = input.toLowerCase();
        let response = "Thanks for sharing. You're not alone 💙";

        const keywords = [
            {
                words: ["sad", "depressed", "hopeless", "empty", "lonely"],
                reply: "I'm really sorry you're feeling this way 💙 You're not alone. Try talking to someone you trust."
            },
            {
                words: ["happy", "good", "excited", "great"],
                reply: "That's wonderful 😊 Keep enjoying those positive moments!"
            },
            {
                words: ["stress", "anxious", "help", "tired"],
                reply: "Take a deep breath 🌿 Maybe take a short break or talk to someone."
            }
        ];

        // Keyword matching
        for (const kw of keywords) {
            if (kw.words.some(word => text.includes(word))) {
                response = kw.reply;
                break;
            }
        }

        // Simulate typing delay (UX improvement 🔥)
        setTimeout(() => {
            appendMessage(chatBox, response, "bot");
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 500);

        inputEl.value = "";
    };

    // Append message function
    function appendMessage(container, message, sender) {
        const div = document.createElement("div");
        div.className = sender;
        div.textContent = message;
        container.appendChild(div);
    }

    // Enter key support
    inputEl.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    });

});