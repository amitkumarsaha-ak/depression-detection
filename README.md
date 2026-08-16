# Depression Detection

> An AI-assisted web application for detecting potential signs of depression from text using Natural Language Processing (NLP) and Machine Learning.

## Overview

**Depression Detection** is a machine-learning-powered web application that analyzes user-provided text and identifies patterns that may be associated with depressive content.

The application provides a simple web interface where users can submit text for analysis. The Flask backend processes the input and returns a prediction along with a confidence score.

The project combines:

* Natural Language Processing (NLP)
* TF-IDF text vectorization
* Logistic Regression
* Flask REST API
* JavaScript-based interactive frontend
* A conversational support interface

> **Important:** This system is an AI-assisted screening/research tool, not a medical diagnostic system.

## Key Features

### 🧠 Text-Based Depression Detection

Analyzes submitted text and predicts whether the content is associated with the target depression class.

### 🔤 NLP Preprocessing

Text preprocessing includes:

* Lowercasing
* URL removal
* Removal of non-alphabetic characters
* Text normalization

### 📊 TF-IDF Feature Extraction

The training pipeline uses `TfidfVectorizer` with:

* Maximum 7,000 features
* Unigrams and bigrams

### 🤖 Machine Learning Model

A **Logistic Regression** classifier is trained on the processed text data.

The trained model and TF-IDF vectorizer are serialized using Python's `pickle` module.

### 🔄 Prediction API

The Flask backend exposes a `/predict` endpoint.

Example response:

```json
{
  "prediction": 1,
  "confidence": 87.42
}
```

### 🛟 Prediction Fallback

The application first attempts to use an external prediction service. If that service is unavailable or returns an error, the locally stored TF-IDF + Logistic Regression model is used as a fallback.

### 💬 Support Chatbot

The frontend includes a lightweight chatbot that provides predefined supportive responses based on detected predictions and common user messages.

---

## System Architecture

```text
                     ┌──────────────────────┐
                     │      Web Browser     │
                     │  HTML / CSS / JS     │
                     └──────────┬───────────┘
                                │
                                │ POST /predict
                                ▼
                     ┌──────────────────────┐
                     │     Flask Server     │
                     │       app.py         │
                     └──────────┬───────────┘
                                │
                       ┌────────┴────────┐
                       │                 │
                       ▼                 ▼
              ┌──────────────────┐ ┌──────────────────┐
              │ External Model   │ │ Local ML Model   │
              │ Prediction API   │ │ TF-IDF +         │
              │                  │ │ Logistic Reg.    │
              └────────┬─────────┘ └────────┬─────────┘
                       │                    │
                       └──────────┬─────────┘
                                  ▼
                     ┌──────────────────────┐
                     │ Prediction +         │
                     │ Confidence Score     │
                     └──────────┬───────────┘
                                │
                                ▼
                     ┌──────────────────────┐
                     │ Frontend / Chatbot   │
                     └──────────────────────┘
```

---

## Machine Learning Pipeline

```text
Raw Datasets
     │
     ▼
Combine Datasets
     │
     ▼
Handle Missing Values
     │
     ▼
Balance Classes
     │
     ▼
Clean Text
     │
     ▼
Train/Test Split
     │
     ▼
TF-IDF Vectorization
     │
     ▼
Logistic Regression
     │
     ▼
Model Evaluation
     │
     ▼
Save Model + Vectorizer
```

The current training process combines two CSV datasets, balances the two label classes using equal sampling, cleans the text, and creates an 80/20 training/testing split.

---

## Dataset

The training pipeline expects the following datasets:

```text
Reddit-Depression-Dataset(Revised).csv
Sentimental-Depression-Dataset(Revised).csv
```

The Reddit dataset uses:

```text
title
body
label
```

The second dataset maps:

```text
statement   → text
binary_label → label
```

The datasets are then combined into a unified training dataframe.

### Dataset Preparation

The training script:

1. Loads both datasets.
2. Handles missing Reddit post bodies.
3. Combines Reddit titles and bodies.
4. Renames columns from the second dataset.
5. Combines both datasets.
6. Removes missing records.
7. Balances the two classes.
8. Cleans the text.
9. Creates training and testing datasets.

> **Important:** Dataset files are not included in this repository. The appropriate datasets must be obtained and placed locally before retraining the model.

---

## Model Details

### TF-IDF Vectorizer

```python
TfidfVectorizer(
    max_features=7000,
    ngram_range=(1, 2)
)
```

This represents text using weighted word and two-word phrase features.

### Classifier

```python
LogisticRegression(max_iter=300)
```

After training, the classifier and vectorizer are saved as:

```text
model.pkl
vectorizer.pkl
```

---

## Project Structure

```text
depression-detection/
│
├── app.py
├── train_model.py
│
├── chatbot.js
├── index.html
├── script.js
├── style.css
│
├── model.pkl
├── vectorizer.pkl
│
├── requirements.txt
└── README.md
```

| File               | Description                        |
| ------------------ | ---------------------------------- |
| `app.py`           | Flask backend and prediction API   |
| `train_model.py`   | Machine learning training pipeline |
| `model.pkl`        | Trained Logistic Regression model  |
| `vectorizer.pkl`   | Trained TF-IDF vectorizer          |
| `index.html`       | Main web interface                 |
| `style.css`        | Frontend styling                   |
| `script.js`        | Frontend interactions              |
| `chatbot.js`       | Chatbot functionality              |
| `requirements.txt` | Python dependencies                |
| `README.md`        | Project documentation              |

---

## Technologies Used

### Backend

* Python
* Flask
* Flask-CORS

### Machine Learning

* Scikit-learn
* TF-IDF
* Logistic Regression
* NumPy

### Frontend

* HTML5
* CSS3
* JavaScript

### Deployment

* Gunicorn

### Additional Libraries

* Requests

The project's `requirements.txt` contains the core Flask, machine-learning, HTTP-request, and deployment dependencies.

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/amitkumarsaha-ak/depression-detection.git
```

Navigate into the project:

```bash
cd depression-detection
```

### 2. Create a Virtual Environment

#### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

#### macOS / Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Running the Application

Start the Flask application:

```bash
python app.py
```

The application runs on:

```text
http://localhost:10000
```

The port can also be controlled using the `PORT` environment variable.

For example:

```bash
PORT=5000 python app.py
```

Then open the application in your browser.

---

## API Usage

### Prediction Endpoint

```http
POST /predict
```

### Request

```json
{
  "text": "I have been feeling very low recently and have lost interest in many things."
}
```

### Response

```json
{
  "prediction": 1,
  "confidence": 87.42
}
```

The exact returned values depend on the model and input text.

### Python Example

```python
import requests

url = "http://localhost:10000/predict"

payload = {
    "text": "I have been feeling very low recently."
}

response = requests.post(url, json=payload)

print(response.json())
```

---

## Training the Model

To retrain the local model, make sure the required datasets are available first.

Update the dataset paths in:

```text
train_model.py
```

Then run:

```bash
python train_model.py
```

The training process:

```text
Load datasets
      ↓
Prepare data
      ↓
Balance classes
      ↓
Clean text
      ↓
Split data
      ↓
Generate TF-IDF features
      ↓
Train Logistic Regression
      ↓
Evaluate model
      ↓
Save model.pkl
      ↓
Save vectorizer.pkl
```

The training script prints the test accuracy after evaluation.

---

## Chatbot

The project includes a lightweight browser-based chatbot implemented in `chatbot.js`.

The chatbot provides predefined conversational responses based on:

* Detected prediction
* Sadness/depression-related expressions
* Loneliness
* Requests for help
* Fatigue
* Stress
* Anxiety
* Positive emotional states

The chatbot is rule-based and should **not** be considered an AI therapist, clinical assessment system, or emergency service.

---

## ⚠️ Safety Disclaimer

### Not a Medical Diagnostic Tool

This project is intended for **educational, research, and experimental purposes only**.

A machine-learning prediction from text cannot determine whether a person clinically has depression.

The system:

* Does not provide a medical diagnosis.
* Does not replace a psychologist, psychiatrist, doctor, or other qualified professional.
* May produce incorrect predictions.
* May produce false positives or false negatives.
* Should not be used as the sole basis for medical or mental-health decisions.

If someone is experiencing serious emotional distress or thoughts of self-harm, they should seek appropriate professional or emergency support rather than relying on this application.

---

## Limitations

Several limitations should be considered:

* Text-based predictions can be highly dependent on context.
* Dataset quality directly affects model performance.
* Social-media language may not represent clinical symptoms.
* Confidence scores should not be interpreted as clinical probabilities.
* The local model is relatively lightweight compared with modern transformer-based NLP systems.
* The external prediction service introduces an additional dependency.
* The current chatbot uses predefined responses rather than a clinical conversational AI.
* Model performance may vary across different writing styles, languages, and populations.

---

## Future Improvements

Potential improvements include:

* Replace the baseline classifier with transformer-based NLP models.
* Add cross-validation and detailed evaluation metrics.
* Report precision, recall, F1-score, ROC-AUC, and confusion matrix.
* Improve dataset diversity and representativeness.
* Add multilingual text support.
* Add stronger input validation and API error handling.
* Remove hard-coded dataset paths from the training pipeline.
* Move configuration values into environment variables.
* Add automated tests.
* Add model versioning.
* Improve explainability of predictions.
* Add responsible AI and privacy safeguards.
* Improve the chatbot with professionally reviewed mental-health response patterns.

---

## Privacy Considerations

Users should avoid submitting personally identifiable, confidential, or sensitive information unless the application has been explicitly designed and secured to handle such information.

For production deployment, consider:

* Secure HTTPS communication
* Data minimization
* Access control
* Secure logging
* Input sanitization
* Privacy policy and consent mechanisms
* Appropriate data-retention policies

---

## Deployment

The project includes **Gunicorn** as a deployment dependency.

A typical production command is:

```bash
gunicorn app:app
```

Before deploying publicly, review:

* External prediction endpoint
* Model files
* Security configuration
* CORS policy
* Logging
* Privacy requirements

---

## Contributing

Contributions are welcome.

### Development Workflow

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feature/your-feature
```

3. Make your changes.
4. Test the application.
5. Commit your changes:

```bash
git commit -m "Add: your feature"
```

6. Push the branch:

```bash
git push origin feature/your-feature
```

7. Open a Pull Request.

---

## License

The repository's licensing terms should be confirmed before adding a formal license.

If the project is officially released under the MIT License, add a `LICENSE` file containing the appropriate MIT License text.

---

## Author

**Amit Kumar Saha**

GitHub:
https://github.com/amitkumarsaha-ak

Project Repository:
https://github.com/amitkumarsaha-ak/depression-detection

---

## Acknowledgements

This project builds on publicly available machine-learning and NLP techniques for text classification.

The implementation uses open-source technologies including Flask and Scikit-learn.

---

## Disclaimer

**This project is an educational/research implementation and is not intended to diagnose, treat, prevent, or cure depression or any other mental-health condition.**

Use predictions responsibly and seek qualified professional assistance for health-related decisions.

---

⭐ If you find this project useful for learning or research, consider giving the repository a star.
