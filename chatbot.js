document.addEventListener("DOMContentLoaded", () => {

    const chatbotBtn = document.getElementById("chatbotBtn");
    const chatbotPopup = document.getElementById("chatbotPopup");
    const closeBtn = document.getElementById("closeBtn");
    const inputEl = document.getElementById("userMessage");
    const chatBox = document.getElementById("chatBox");

    
    chatbotBtn.addEventListener("click", () => {
        chatbotPopup.classList.toggle("hidden");

        
        if (!chatbotPopup.classList.contains("hidden") && chatBox.innerHTML === "") {
            appendMessage(chatBox, "Hi! I'm here to help you 💙", "bot");
        }
    });

    
    closeBtn.addEventListener("click", () => {
        chatbotPopup.classList.add("hidden");

        
        chatBox.innerHTML = "";

        
        inputEl.value = "";
    });

    
    window.sendMessage = function () {
        const input = inputEl.value.trim();
        if (!input) return;

        appendMessage(chatBox, input, "user");

        const text = input.toLowerCase();
        let response = "Thanks for sharing. You're not alone 💙";

        const keywords = [
            {
                words: ["sad", "depressed", "hopeless"],
                reply: "I'm here for you. Try talking to someone you trust 💙"
            },
            {
                words: ["happy", "good", "excited"],
                reply: "That's amazing! Keep smiling 😊"
            },
            {
                words: ["stress", "anxious", "help"],
                reply: "Take a deep breath. Try relaxing 🌿"
            }
        ];

        for (const kw of keywords) {
            if (kw.words.some(word => text.includes(word))) {
                response = kw.reply;
                break;
            }
        }

        appendMessage(chatBox, response, "bot");

        chatBox.scrollTop = chatBox.scrollHeight;
        inputEl.value = "";
    };

    
    function appendMessage(container, message, sender) {
        const div = document.createElement("div");
        div.className = sender;
        div.textContent = message;
        container.appendChild(div);
    }

    
    inputEl.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    });

});