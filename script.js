// 🔥 GLOBAL VARIABLE
window.lastPrediction = null;

// ================= ANALYZE FUNCTION =================
function analyze() {
    const text = document.getElementById("text").value.trim();

    if (!text) {
        alert("Please enter some text to analyze.");
        return;
    }

    const loading = document.getElementById("loading");
    const resultCard = document.getElementById("resultCard");
    const progressBar = document.getElementById("progressBar");

    loading.classList.remove("hidden");
    resultCard.classList.add("hidden");
    progressBar.style.width = "0%";

    fetch("/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: text })
    })
    .then(res => {
        if (!res.ok) throw new Error("Network response was not OK");
        return res.json();
    })
    .then(data => {
        loading.classList.add("hidden");
        resultCard.classList.remove("hidden");

        // ✅ SAVE prediction
        window.lastPrediction = data.prediction;

        let resultText = "";
        let color = "";

        const chatbotPopup = document.getElementById("chatbotPopup");

        if (data.prediction === 1) {
            resultText = "Depressed";
            color = "#ef4444";

            // 🔥 OPEN CHATBOT
            chatbotPopup.classList.remove("hidden");
            chatbotPopup.classList.add("show");
            chatbotPopup.style.display = "flex";

            // 🔥 CLEAR OLD CHAT
            const chatBox = document.getElementById("chatBox");
            chatBox.innerHTML = "";

            // 🔥 AUTO MESSAGE
            setTimeout(() => {
                if (typeof window.appendAutoBotMessage === "function") {
                    window.appendAutoBotMessage(
                        "I noticed you might be feeling low 💙 I'm here for you. Want to talk?"
                    );
                }
            }, 400);

        } else {
            resultText = "Non Depressed";
            color = "#22c55e";

            // 🔥 CLOSE CHATBOT
            chatbotPopup.classList.remove("show");
            chatbotPopup.classList.add("hidden");
            chatbotPopup.style.display = "none";
        }

        document.getElementById("resultText").innerText = resultText;
        document.getElementById("confidenceText").innerText =
            `Confidence: ${data.confidence}%`;

        progressBar.style.transition = "width 1s ease-in-out, background 0.5s";
        progressBar.style.width = `${data.confidence}%`;
        progressBar.style.background = color;
    })
    .catch(err => {
        loading.classList.add("hidden");
        alert("Error connecting to the server. Please try again.");
        console.error("Fetch error:", err);
    });
}

// ================= SECTION NAVIGATION =================
function showSection(section) {
    const home = document.getElementById("homeSection");
    const about = document.getElementById("aboutSection");
    const faq = document.getElementById("faqSection");

    // hide all
    home.classList.add("hidden");
    about.classList.add("hidden");
    faq.classList.add("hidden");

    // show selected
    if (section === "home") home.classList.remove("hidden");
    if (section === "about") about.classList.remove("hidden");
    if (section === "faq") faq.classList.remove("hidden");
}