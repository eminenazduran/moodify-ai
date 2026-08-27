# 🎵 Moodify AI

A music intelligence project that explores a song's mood profile through its audio features, groups tracks into behavioral clusters, predicts mood categories, and recommends similar songs — built using the Spotify Tracks Dataset (114,000 tracks, 114 genres).

> **Status: 🚧 In Progress** — Dataset understanding, EDA, feature engineering, scaling, and K-Means mood clustering are complete. Classification and the recommendation engine are currently in development.

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
- [x] **Day 2 — Feature Engineering & Scaling** — correlation analysis, StandardScaler applied to 7 audio features
- [x] **Day 3 — Clustering (K-Means)** — Elbow Method + Silhouette Score comparison (k=4 vs k=5), 4 mood segments identified
- [ ] **Day 4 — Classification** — model comparison (Logistic Regression / Random Forest / XGBoost) for mood prediction
- [ ] **Day 5 — Recommendation Engine + Streamlit Dashboard** — cosine-similarity-based song recommendations

## 🛠️ Tech Stack

Python · Pandas · NumPy · Matplotlib · Seaborn · Scikit-learn · Streamlit · Jupyter

## 📁 Project Structure

```
moodify-ai/
├── data/
│   └── raw/
│       └── dataset.csv        # not tracked in git, see Dataset section
├── notebooks/
│   ├── 01_data_understanding.ipynb
│   ├── 02_feature_engineering.ipynb
│   └── 03_clustering.ipynb
├── src/
├── app/                      # Streamlit dashboard (planned)
├── .gitignore
└── requirements.txt
```

## 🔍 Key Findings So Far

**Dataset & EDA**
- The dataset is perfectly balanced: 114 genres × 1,000 tracks each, with no genre over- or under-represented.
- Two irrelevant index columns (`Unnamed: 0`, `Unnamed: 0.1`) and one corrupted row (missing track identity fields alongside zeroed-out popularity/duration) were removed during cleaning.
- Most audio features are already normalized between 0 and 1 by Spotify. `acousticness`, `speechiness`, and `instrumentalness` are heavily right-skewed / zero-inflated — the majority of tracks score near 0.

**Feature Engineering**
- Correlation analysis showed `energy` and `acousticness` as the strongest relationship (-0.73), but below the ±0.85–0.90 threshold for removal — all 7 features were retained.
- Log transformation was intentionally skipped (unlike Retail Radar): the skewness here comes from the dataset's natural structure (already 0–1 normalized), not from unbounded outliers, so `StandardScaler` alone was sufficient.

**Clustering (K-Means)**
- Compared k=4 and k=5 using both the Elbow Method and Silhouette Score (0.2102 vs 0.2109 — effectively equal).
- k=5 produced no new information over k=4; it simply re-split one existing group without revealing a distinct mood profile, so **k=4** was chosen.
- Final mood segments:

| Mood | Tracks | Share |
|---|---|---|
| Energetic & Dance | 46,517 | 40.8% |
| Dark & Intense | 35,520 | 31.2% |
| Calm & Acoustic | 26,405 | 23.2% |
| Speech-Heavy | 5,557 | 4.9% |

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