document.addEventListener("DOMContentLoaded", () => {

    const chatbotPopup = document.getElementById("chatbotPopup");
    const closeBtn = document.getElementById("closeBtn");
    const inputEl = document.getElementById("userMessage");
    const chatBox = document.getElementById("chatBox");
    const chatbotBtn = document.getElementById("chatbotBtn"); // ⭐ ADD

    // 🔥 FIXED (NO display:none)
    chatbotPopup.classList.remove("show");
    chatbotPopup.classList.add("hidden");

    // 🔥 BUTTON CLICK (ONLY IF DEPRESSED) ⭐ ADD
    chatbotBtn.addEventListener("click", () => {
        if (window.lastPrediction === 1) {
            chatbotPopup.classList.remove("hidden");
            chatbotPopup.classList.add("show");
            chatbotPopup.style.display = "flex";
        }
    });

    // 🔥 Close chatbot
    closeBtn.addEventListener("click", () => {
        chatbotPopup.classList.remove("show");
        chatbotPopup.classList.add("hidden");
        chatBox.innerHTML = "";
        inputEl.value = "";
    });

    // 🔥 Send message
    window.sendMessage = function () {
        const input = inputEl.value.trim();
        if (!input) return;

        appendMessage(chatBox, input, "user");

        const text = input.toLowerCase();
        let response = "";

        // 🔴 Depressed mode
        if (window.lastPrediction === 1) {

            response = "I'm here for you 💙 Tell me what's on your mind.";

            if (text.includes("sad") || text.includes("depressed")) {
                response = "I'm really sorry you're feeling this way 💙 You are not alone.";
            }
            else if (text.includes("alone") || text.includes("lonely")) {
                response = "Feeling alone can be really heavy 💙 Want to share what's going on?";
            }
            else if (text.includes("help")) {
                response = "It's okay to ask for help 💙 Try reaching out to someone you trust.";
            }
            else if (text.includes("tired") || text.includes("exhausted")) {
                response = "It sounds like you're really tired 😔 Maybe take a small rest.";
            }
            else if (text.includes("suicide") || text.includes("die")) {
                response = "I'm really sorry you're feeling this way 💙 Please talk to someone you trust or a professional immediately.";
            }
        }

        // 🟢 Normal mode
        else {
            response = "Thanks for sharing 😊";

            if (text.includes("happy") || text.includes("good") || text.includes("great")) {
                response = "That's wonderful 😊 Keep enjoying those moments!";
            }
            else if (text.includes("stress") || text.includes("anxious")) {
                response = "Take a deep breath 🌿 Maybe take a short break.";
            }
            else if (text.includes("tired")) {
                response = "You might need some rest 😴 Take care of yourself!";
            }
        }

        // 🔥 Typing effect
        const typing = document.createElement("div");
        typing.className = "bot";
        typing.textContent = "Typing...";
        chatBox.appendChild(typing);

        setTimeout(() => {
            typing.remove();
            appendMessage(chatBox, response, "bot");
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 800);

        inputEl.value = "";
    };

    // 🔥 Auto message
    window.appendAutoBotMessage = function (message) {
        const div = document.createElement("div");
        div.className = "bot";
        div.textContent = message;

        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    // 🔥 Append helper
    function appendMessage(container, message, sender) {
        const div = document.createElement("div");
        div.className = sender;
        div.textContent = message;
        container.appendChild(div);
    }

    // 🔥 Enter key
    inputEl.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    });

});