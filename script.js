// 🔥 GLOBAL VARIABLE (chatbot use করবে)
window.lastPrediction = null;
window.chatbotOpenedOnce = false; // 👉 prevent repeat auto message

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

        // ✅ GLOBAL SET
        window.lastPrediction = data.prediction;

        let resultText = "";
        let color = "";

        if (data.prediction === 1) {
            resultText = "😟 Depressed";
            color = "#ef4444";

            const chatbotPopup = document.getElementById("chatbotPopup");

            // ✅ ONLY OPEN IF CLOSED
            if (chatbotPopup.classList.contains("hidden")) {
                chatbotPopup.classList.remove("hidden");

                // ✅ SEND MESSAGE ONLY ONCE
                if (!window.chatbotOpenedOnce) {
                    setTimeout(() => {
                        if (typeof appendAutoBotMessage === "function") {
                            appendAutoBotMessage("I noticed you might be feeling low 💙 I'm here for you. Want to talk?");
                        }
                    }, 500);

                    window.chatbotOpenedOnce = true;
                }
            }

        } else {
            resultText = "😊 Not Depressed";
            color = "#22c55e";
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