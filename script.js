function analyze() {
    const text = document.getElementById("text").value.trim();

    if (!text) {
        alert("Please enter some text to analyze.");
        return;
    }

    // Show loading, hide previous results
    const loading = document.getElementById("loading");
    const resultCard = document.getElementById("resultCard");
    const progressBar = document.getElementById("progressBar");

    loading.classList.remove("hidden");
    resultCard.classList.add("hidden");
    progressBar.style.width = "0%";

    fetch("http://127.0.0.1:5000/predict", {
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

        let resultText = "";
        let color = "";

        if (data.prediction === 1) {
            resultText = "😟 Depressed";
            color = "#ef4444"; // Red for depressed
        } else {
            resultText = "😊 Not Depressed";
            color = "#22c55e"; // Green for not depressed
        }

        document.getElementById("resultText").innerText = resultText;
        document.getElementById("confidenceText").innerText = 
            `Confidence: ${data.confidence}%`;

        // Animate progress bar smoothly
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