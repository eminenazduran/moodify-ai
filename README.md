# 🎵 Moodify AI — Music Intelligence & Recommendation Engine

A comprehensive music data science and intelligence portfolio project analyzing 114,000 Spotify tracks across 114 genres through unsupervised clustering, supervised classification, and interactive cosine-similarity recommendations with a modern React dashboard.

> **Status: Complete** — Unsupervised K-Means clustering, Supervised Genre Classification, Cosine-Similarity Recommendation Engine, and Interactive React Dashboard are fully implemented.

---

## 🌟 Overview & Key Features

- **Mood Clustering (Unsupervised ML)** — 114,000 tracks clustered into 4 distinct emotional profiles using K-Means ($k=4$) on 7 standardized audio features.
- **Genre Classification (Supervised ML)** — Predicting 6 high-level genre categories using multi-class classification (Random Forest @ 61.1% test accuracy).
- **Genre-Aware Recommendation Engine** — Fast, genre-aware Cosine Similarity recommendations with real-time multi-dimensional audio feature radar comparison.
- **Interactive React Dashboard** — Dark-themed, responsive dashboard built with React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Recharts, and Fuse.js.

---

## 📊 Key Machine Learning Results

### 1. Mood Clustering (K-Means, $k=4$)
Chosen over $k=5$ after evaluating Elbow Method inertia curvature and Silhouette Scores:

| Mood Cluster | Share (%) | Acoustic Characteristics | Dominant Genres |
|---|---|---|---|
| **Energetic & Dance** | **40.8%** | High Danceability (>0.7), High Energy (>0.75) | Pop, House, EDM, Disco |
| **Dark & Intense** | **31.2%** | High Energy (>0.8), Low Valence (<0.45) | Metal, Rock, Nu-Metal |
| **Calm & Acoustic** | **23.2%** | High Acousticness (>0.65), Low Energy (<0.4) | Folk, Acoustic, Classical |
| **Speech-Heavy** | **4.9%** | High Speechiness (>0.10), Rhythmic Vocals | Hip-Hop, Rap, Trap |

### 2. Supervised Genre Classification (6 Super-Categories)
114 subgenres balanced and mapped to 6 broader categories:

| Model | Architecture | Accuracy | Status |
|---|---|---|---|
| Logistic Regression | Linear Multi-Class Baseline | 46.4% | Baseline |
| XGBoost | Gradient Boosted Decision Trees | 56.7% | Tested |
| **Random Forest** | **Ensemble Bagging Trees** | **61.1%** | 🏆 **Best Model** |

*Key Feature Importance:* **Acousticness (28.4%)**, **Danceability (21.6%)**, **Energy (18.2%)**, **Speechiness (14.5%)**.

---

## 🛠️ Tech Stack

### Data Science & Machine Learning
- **Python 3.12+**, **Pandas**, **NumPy**, **Scikit-learn**, **XGBoost**, **Matplotlib / Seaborn**, **Jupyter Notebooks**

### Frontend Dashboard
- **React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4**, **shadcn/ui**, **Recharts**, **Fuse.js**, **Lucide Icons**

---

## 📁 Project Structure

```
moodify-ai/
├── data/
│   └── raw/                       # Raw Spotify Tracks CSV dataset (git-ignored)
├── notebooks/                     # Jupyter notebooks for complete ML pipeline
│   ├── 01_data_understanding.ipynb
│   ├── 02_feature_engineering.ipynb
│   ├── 03_clustering.ipynb
│   ├── 04_classification.ipynb
│   └── 05_recommendation.ipynb
├── scripts/
│   └── export_dashboard_data.py   # Standalone data export & ML pipeline runner
├── frontend/                      # React + TypeScript dashboard
│   ├── public/data/               # Precomputed ML JSON aggregates & tracks
│   │   ├── aggregates.json
│   │   ├── tracks.json
│   │   └── recommendations.json
│   ├── src/
│   │   ├── components/            # Reusable UI, Charts & Search components
│   │   ├── pages/                 # Home, Mood, Recommend, Genre & Models pages
│   │   ├── hooks/                 # React data loading hooks
│   │   └── lib/                   # Audio feature constants & recommender engine
│   └── package.json
└── requirements.txt
```

---

## 🚀 Getting Started Locally

### 1. Python ML Environment (Optional for retraining)
```bash
# Clone the repository
git clone https://github.com/your-username/moodify-ai.git
cd moodify-ai

# Create and activate virtual environment
python -m venv .venv
.venv\Scripts\activate     # On Windows
# source .venv/bin/activate  # On macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run notebooks or export fresh data
.venv\Scripts\python.exe scripts/export_dashboard_data.py
```

### 2. Running the React Dashboard
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📜 License
MIT License. Created as part of an AI & Data Science Portfolio series.