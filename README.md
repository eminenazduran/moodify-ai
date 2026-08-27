# Moodify AI

A music intelligence project exploring mood profiles, genre patterns, and song similarity through audio features.

> **Status: In Progress** — Clustering and classification are complete. Recommendation engine and dashboard are in development.

## Overview

- **Mood Clustering** — unsupervised grouping of tracks into behavioral mood profiles using K-Means
- **Genre Classification** — predicting genre category from audio features using supervised ML
- **Recommendation** *(planned)* — finding similar tracks via cosine similarity

> Dataset not included in this repo — see notebooks for source and setup.

## Roadmap

- [x] Day 1 — Data understanding & EDA
- [x] Day 2 — Feature engineering & scaling
- [x] Day 3 — K-Means mood clustering
- [x] Day 4 — Genre classification (model comparison)
- [ ] Day 5 — Recommendation engine + Streamlit dashboard

## Key Results

**Mood Clustering (K-Means, k=4)** — chosen over k=5 after comparing Elbow Method and Silhouette Score, since k=5 added no new information.

| Mood | Share |
|---|---|
| Energetic & Dance | 40.8% |
| Dark & Intense | 31.2% |
| Calm & Acoustic | 23.2% |
| Speech-Heavy | 4.9% |

**Genre Classification** — genres grouped into 6 broader categories; model comparison below.

| Model | Accuracy |
|---|---|
| Logistic Regression | 46.4% |
| **Random Forest** | **61.1%** |
| XGBoost (default params) | 56.7% |

Random Forest performed best overall.

## Tech Stack

Python · Pandas · NumPy · Scikit-learn · XGBoost · Matplotlib · Streamlit · Jupyter

## Project Structure

```
moodify-ai/
├── data/raw/
├── notebooks/
│   ├── 01_data_understanding.ipynb
│   ├── 02_feature_engineering.ipynb
│   ├── 03_clustering.ipynb
│   └── 04_classification.ipynb
├── app/                      # Streamlit dashboard (planned)
└── requirements.txt
```

## Running Locally

```bash
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
jupyter notebook notebooks/
```

---
*Project 2 of 4 in a 20-day AI + Data Science portfolio program: Retail Radar → Moodify AI → Fraud Hunter → AI Decision Lab.*