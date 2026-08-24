# 🎵 Moodify AI

A music intelligence project that explores a song's mood profile through its audio features, groups tracks into behavioral clusters, predicts mood categories, and recommends similar songs — built using the Spotify Tracks Dataset (114,000 tracks, 114 genres).

> **Status: 🚧 In Progress** — Dataset understanding and audio feature EDA are complete. Feature engineering, clustering, classification, and the recommendation engine are currently in development.

## 🎯 Goal

Move beyond simple "this song sounds happy" guesses and build a data-driven understanding of a track's musical character:
- **Mood Discovery (Clustering)** — group tracks into behavioral clusters based on audio features, without predefined labels
- **Mood Classification** — predict a track's cluster/profile from its audio features
- **Recommendation** — find similar tracks using cosine similarity

## 📊 Dataset

[Spotify Tracks Dataset](https://www.kaggle.com/datasets/maharshipandya/-spotify-tracks-dataset) — 114,000 tracks across 114 genres (1,000 tracks per genre, balanced).

> **Note:** The raw dataset is not included in this repository (see `.gitignore`). Download it from the Kaggle link above and place the CSV file in `data/raw/` before running the notebooks.

Key audio features used:

| Column | Description |
|---|---|
| danceability | How suitable a track is for dancing (0–1) |
| energy | Perceptual intensity and activity (0–1) |
| valence | Musical positiveness conveyed (0–1) |
| acousticness | Confidence the track is acoustic (0–1) |
| instrumentalness | Predicts whether a track has no vocals (0–1) |
| speechiness | Presence of spoken words (0–1) |
| tempo | Estimated tempo in BPM |
| track_genre | Genre label (114 unique genres) |

## 🗺️ Roadmap & Progress

- [x] **Day 1 — Dataset Understanding & EDA** — dataset structure, genre distribution, audio feature distributions
- [ ] **Day 2 — Feature Engineering & Scaling** — handling skewed features, preparing data for clustering
- [ ] **Day 3 — Clustering (K-Means)** — unsupervised mood-profile discovery
- [ ] **Day 4 — Classification** — model comparison (Logistic Regression / Random Forest / XGBoost) for mood prediction
- [ ] **Day 5 — Recommendation Engine + Streamlit Dashboard** — cosine-similarity-based song recommendations

## 🛠️ Tech Stack

Python · Pandas · NumPy · Matplotlib · Seaborn · Scikit-learn · Streamlit · Jupyter

## 📁 Project Structure

```
moodify-ai/
├── data/
│   └── raw/
│       └── dataset.csv
├── notebooks/
│   └── 01_data_understanding.ipynb
├── src/
├── app/                      # Streamlit dashboard (planned)
└── requirements.txt
```

## 🔍 Key Findings So Far

- The dataset is perfectly balanced: 114 genres × 1,000 tracks each, with no genre over- or under-represented.
- Two irrelevant index columns (`Unnamed: 0`, `Unnamed: 0.1`) and one corrupted row (missing track identity fields alongside zeroed-out popularity/duration) were removed during cleaning.
- Most audio features (`danceability`, `energy`, `valence`, `acousticness`, `instrumentalness`, `speechiness`) are already normalized between 0 and 1 by Spotify — unlike Retail Radar's transaction data, no raw-scale mismatch exists across most features. `tempo` (BPM) remains on a different scale and will need scaling before clustering.
- `acousticness`, `speechiness`, and `instrumentalness` are heavily right-skewed and zero-inflated — the majority of tracks score near 0, with a smaller distinct group scoring high (e.g. instrumental tracks). This will inform how features are prepared for clustering in Day 2–3.

## ▶️ Running the Notebooks

```bash
# from the project root
python -m venv venv
source venv/bin/activate   # on Windows: venv\Scripts\activate
pip install -r requirements.txt
jupyter notebook notebooks/
```

---
*Part of a 20-day AI + Data Science portfolio program (Project 2 of 4: Retail Radar → Moodify AI → Fraud Hunter → AI Decision Lab).*