import pandas as pd
import re
import pickle
import os

print("Starting training...")

print("Loading datasets...")

df1 = pd.read_csv("D:/OneDrive/Desktop/Depression Detection/Reddit-Depression-Dataset(Revised).csv")
df2 = pd.read_csv("D:/OneDrive/Desktop/Depression Detection/Sentimental-Depression-Dataset(Revised).csv")

print("Datasets loaded")

df1["body"] = df1["body"].fillna("")
df1["text"] = df1["title"] + " " + df1["body"]
df1 = df1[["text", "label"]]

df2 = df2.rename(columns={
    "statement": "text",
    "binary_label": "label"
})
df2 = df2[["text", "label"]]

df = pd.concat([df1, df2], ignore_index=True)
df = df.dropna()

print("Total data:", len(df))

df0 = df[df["label"] == 0]
df1_bal = df[df["label"] == 1]

min_len = min(len(df0), len(df1_bal))

df = pd.concat([
    df0.sample(min_len, random_state=42),
    df1_bal.sample(min_len, random_state=42)
])

print("Balanced data:", len(df))

def clean_text(text):
    text = str(text).lower()
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"[^a-z\s]", "", text)
    return text

df["text"] = df["text"].apply(clean_text)

print("Text cleaned")

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

print("Splitting data...")

X_train, X_test, y_train, y_test = train_test_split(
    df["text"], df["label"], test_size=0.2, random_state=42
)

print("Vectorizing...")

vectorizer = TfidfVectorizer(max_features=7000, ngram_range=(1,2))

X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

print("Training model... ⏳")

model = LogisticRegression(max_iter=300)
model.fit(X_train_vec, y_train)

print("Model training complete")

y_pred = model.predict(X_test_vec)
acc = accuracy_score(y_test, y_pred)

print(f"Accuracy: {acc:.4f}")

pickle.dump(model, open("model.pkl", "wb"))
pickle.dump(vectorizer, open("vectorizer.pkl", "wb"))

print("Model saved as model.pkl & vectorizer.pkl")
print("DONE!")