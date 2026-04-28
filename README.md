# 🚀 Algorithm Analyzer & Complexity Optimizer

A full-stack system that analyzes code complexity, classifies efficiency using Machine Learning, and provides optimization suggestions — all in real time.

---

## 🧠 Overview

This project combines **rule-based analysis** with a **machine learning model** to evaluate algorithm efficiency.

### 🔄 Flow

```
React (Frontend)
   ↓
Node.js (Analyzer + Recommender)
   ↓
Flask (ML Model Inference)
   ↓
Node.js (Combine Results)
   ↓
React (Display Results)
```

---

## ✨ Features

* 🔍 **Code Analysis Engine**

  * Detects number of loops
  * Calculates nesting depth
  * Identifies recursion

* 🤖 **ML-Based Classification**

  * Classifies code as:

    * Efficient
    * Moderate
    * Inefficient

* 💡 **Optimization Suggestions**

  * Rule-based recommendations
  * Practical improvements (e.g., merge loops, use better structures)

* ⚡ **Real-time Results**

  * Instant feedback via UI

---

## 🏗️ Tech Stack

### Frontend

* React (Vite)

### Backend

* Node.js (Express)

### ML Service

* Python (Flask)
* Scikit-learn (Random Forest)

---

## 📁 Project Structure

```
DSA_MODEL/
├── client/        # React frontend
├── server/        # Node backend
├── ml_model/      # Flask ML service
│   ├── models/
│   ├── notebooks/
│   └── application.py
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repo

```
git clone git@github.com:sugaredcookie/DSA_model.git
cd DSA_model
```

---

### 2️⃣ Start ML Server (Flask)

```
cd ml_model
source ../venv/bin/activate
python application.py
```

Runs on:

```
http://localhost:8000
```

---

### 3️⃣ Start Backend (Node)

```
cd server
npm install
npm run dev
```

Runs on:

```
http://localhost:5000
```

---

### 4️⃣ Start Frontend (React)

```
cd client
npm install
npm run dev
```

Runs on:

```
http://localhost:5173
```

---

## 🧪 Example Input

```java
for(int i=0;i<n;i++){
  for(int j=0;j<n;j++){
    System.out.println(i+j);
  }
}
```

---

## 📊 Example Output

```
Loops: 2
Depth: 2
Recursion: false

ML Prediction: Moderate

Suggestions:
- Nested loops detected → O(n²)
- Consider optimizing using better data structures
```

---

## 📉 Why Accuracy is Moderate

* Small dataset
* Limited features (loops, depth, recursion)
* Overlapping patterns between complexity classes

👉 The ML model is designed as an **enhancement layer**, not the core logic.

---

## 🔮 Future Improvements

* Better feature extraction (operation counts, time complexity parsing)
* Larger dataset
* Language-specific parsing (AST-based)
* Deployment (Docker / cloud)

---

## 🧠 Key Learning

This project demonstrates:

* Multi-service architecture
* ML + backend integration
* Real-time inference pipelines
* Full-stack system design

---

## 👤 Author

**Sanidhya Verma**

---

## ⭐ Final Note

This isn’t just a project.

It’s a working system combining:

* Static analysis
* Machine learning
* Full-stack development

---
