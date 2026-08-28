"""
Export notebook DataFrames / CSV data to frontend JSON files.

Can be run standalone:
    python scripts/export_dashboard_data.py

Or imported in a Jupyter notebook:
    from scripts.export_dashboard_data import write_dashboard_json
    write_dashboard_json(tracks_df, recommendations_df)
"""

from __future__ import annotations

import json
from pathlib import Path
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler

AUDIO_FEATURES = [
    "danceability",
    "energy",
    "valence",
    "acousticness",
    "speechiness",
    "instrumentalness",
    "tempo",
]

MOOD_ORDER = [
    "Energetic & Dance",
    "Dark & Intense",
    "Calm & Acoustic",
    "Speech-Heavy",
]

MOOD_CLUSTER_MAP = {
    0: "Dark & Intense",
    1: "Energetic & Dance",
    2: "Speech-Heavy",
    3: "Calm & Acoustic",
}

GENRE_MAP = {
    # Electronic/Dance
    "edm": "Electronic/Dance", "techno": "Electronic/Dance", "house": "Electronic/Dance",
    "deep-house": "Electronic/Dance", "chicago-house": "Electronic/Dance", "detroit-techno": "Electronic/Dance",
    "minimal-techno": "Electronic/Dance", "trance": "Electronic/Dance", "dubstep": "Electronic/Dance",
    "drum-and-bass": "Electronic/Dance", "dance": "Electronic/Dance", "disco": "Electronic/Dance",
    "electro": "Electronic/Dance", "electronic": "Electronic/Dance", "club": "Electronic/Dance",
    "garage": "Electronic/Dance", "hardstyle": "Electronic/Dance", "idm": "Electronic/Dance",
    "breakbeat": "Electronic/Dance", "dub": "Electronic/Dance", "trip-hop": "Electronic/Dance",
    "j-dance": "Electronic/Dance", "progressive-house": "Electronic/Dance",

    # Rock/Metal
    "rock": "Rock/Metal", "alt-rock": "Rock/Metal", "hard-rock": "Rock/Metal", "punk-rock": "Rock/Metal",
    "psych-rock": "Rock/Metal", "rock-n-roll": "Rock/Metal", "grunge": "Rock/Metal", "metal": "Rock/Metal",
    "heavy-metal": "Rock/Metal", "death-metal": "Rock/Metal", "black-metal": "Rock/Metal",
    "metalcore": "Rock/Metal", "grindcore": "Rock/Metal", "hardcore": "Rock/Metal", "industrial": "Rock/Metal",
    "goth": "Rock/Metal", "emo": "Rock/Metal", "punk": "Rock/Metal", "j-rock": "Rock/Metal", "rockabilly": "Rock/Metal",
    "alternative": "Rock/Metal",

    # Acoustic/Folk
    "acoustic": "Acoustic/Folk", "folk": "Acoustic/Folk", "singer-songwriter": "Acoustic/Folk",
    "songwriter": "Acoustic/Folk", "bluegrass": "Acoustic/Folk", "country": "Acoustic/Folk",
    "honky-tonk": "Acoustic/Folk", "guitar": "Acoustic/Folk", "piano": "Acoustic/Folk", "new-age": "Acoustic/Folk",

    # Hip-Hop/R&B
    "hip-hop": "Hip-Hop/R&B", "r-n-b": "Hip-Hop/R&B", "reggaeton": "Hip-Hop/R&B",
    "reggae": "Hip-Hop/R&B", "dancehall": "Hip-Hop/R&B", "funk": "Hip-Hop/R&B", "soul": "Hip-Hop/R&B",

    # Pop
    "pop": "Pop", "k-pop": "Pop", "j-pop": "Pop", "indie-pop": "Pop", "power-pop": "Pop",
    "synth-pop": "Pop", "mandopop": "Pop", "cantopop": "Pop", "pop-film": "Pop", "indie": "Pop",
    "j-idol": "Pop", "happy": "Pop", "party": "Pop", "romance": "Pop", "disney": "Pop", "kids": "Pop", "children": "Pop",

    # Classical/Jazz/World
    "classical": "Classical/Jazz/World", "jazz": "Classical/Jazz/World", "opera": "Classical/Jazz/World",
    "blues": "Classical/Jazz/World", "world-music": "Classical/Jazz/World", "latin": "Classical/Jazz/World",
    "latino": "Classical/Jazz/World", "salsa": "Classical/Jazz/World", "samba": "Classical/Jazz/World",
    "tango": "Classical/Jazz/World", "forro": "Classical/Jazz/World", "mpb": "Classical/Jazz/World",
    "pagode": "Classical/Jazz/World", "sertanejo": "Classical/Jazz/World", "afrobeat": "Classical/Jazz/World",
    "brazil": "Classical/Jazz/World", "spanish": "Classical/Jazz/World", "french": "Classical/Jazz/World",
    "german": "Classical/Jazz/World", "indian": "Classical/Jazz/World", "swedish": "Classical/Jazz/World",
    "turkish": "Classical/Jazz/World", "iranian": "Classical/Jazz/World", "malay": "Classical/Jazz/World",
    "gospel": "Classical/Jazz/World", "sleep": "Classical/Jazz/World", "study": "Classical/Jazz/World",
    "chill": "Classical/Jazz/World", "ambient": "Classical/Jazz/World", "comedy": "Classical/Jazz/World",
    "anime": "Classical/Jazz/World", "show-tunes": "Classical/Jazz/World", "british": "Classical/Jazz/World",
    "groove": "Electronic/Dance", "ska": "Rock/Metal",
}

MODEL_METRICS = [
    {"model": "Logistic Regression", "accuracy": 0.464},
    {"model": "Random Forest", "accuracy": 0.611, "is_best": True},
    {"model": "XGBoost", "accuracy": 0.567},
]

OUTPUT_DIR = Path(__file__).resolve().parents[1] / "frontend" / "public" / "data"
RAW_DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "raw" / "spotify-tracks-dataset.csv"


def _normalize_id_column(df: pd.DataFrame) -> pd.DataFrame:
    if "id" not in df.columns and "track_id" in df.columns:
        df = df.rename(columns={"track_id": "id"})
    if "id" not in df.columns:
        df["id"] = ["t" + str(i).zfill(5) for i in range(len(df))]
    return df


def export_tracks(tracks_df: pd.DataFrame) -> list[dict]:
    df = _normalize_id_column(tracks_df.copy())
    df["id"] = df["id"].astype(str)

    records: list[dict] = []
    for row in df.itertuples(index=False):
        row_dict = row._asdict()
        features = {key: float(row_dict[key]) for key in AUDIO_FEATURES}
        records.append(
            {
                "id": str(row_dict["id"]),
                "track_name": str(row_dict["track_name"]),
                "artists": str(row_dict["artists"]),
                "track_genre": str(row_dict["track_genre"]),
                "mood": str(row_dict["mood"]),
                "genre_group": str(row_dict["genre_group"]),
                "features": features,
            }
        )
    return records


def export_recommendations(recommendations_df: pd.DataFrame) -> dict[str, list[dict]]:
    if recommendations_df.empty:
        return {}

    required = {"source_id", "recommended_id", "similarity"}
    missing = required - set(recommendations_df.columns)
    if missing:
        raise ValueError(f"recommendations_df missing columns: {sorted(missing)}")

    grouped: dict[str, list[dict]] = {}
    for row in recommendations_df.itertuples(index=False):
        source_id = str(row.source_id)
        grouped.setdefault(source_id, []).append(
            {
                "track_id": str(row.recommended_id),
                "similarity": float(row.similarity),
            }
        )

    for items in grouped.values():
        items.sort(key=lambda item: item["similarity"], reverse=True)

    return grouped


def export_aggregates(tracks_df: pd.DataFrame) -> dict:
    df = _normalize_id_column(tracks_df.copy())

    mood_counts = df["mood"].value_counts()
    total = len(df)
    mood_distribution = []
    for mood in MOOD_ORDER:
        count = int(mood_counts.get(mood, 0))
        mood_distribution.append(
            {
                "mood": mood,
                "count": count,
                "percentage": round(count / total * 100, 1) if total else 0.0,
            }
        )

    genre_profiles = []
    for genre_group, group_df in df.groupby("genre_group"):
        profile = {
            "genre_group": str(genre_group),
            "track_count": int(len(group_df)),
            "features": {
                key: round(float(group_df[key].mean()), 3) for key in AUDIO_FEATURES
            },
        }
        genre_profiles.append(profile)

    genre_profiles.sort(key=lambda item: item["track_count"], reverse=True)

    return {
        "total_tracks": int(total),
        "total_genres": int(df["track_genre"].nunique()),
        "mood_distribution": mood_distribution,
        "genre_profiles": genre_profiles,
        "model_metrics": MODEL_METRICS,
    }


def write_dashboard_json(
    tracks_df: pd.DataFrame,
    recommendations_df: pd.DataFrame,
    output_dir: Path = OUTPUT_DIR,
    sample_tracks_limit: int = 500,
) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)

    # Aggregates tüm 114k veriyi özetler
    aggregates = export_aggregates(tracks_df)

    # Tarayıcı hızlı yüklensin diye en popüler/dengeli örnekleri seç
    if len(tracks_df) > sample_tracks_limit:
        # Eğer popularity kolonu varsa popülerliğe göre, yoksa dengeli örnekleme
        if "popularity" in tracks_df.columns:
            sampled_df = (
                tracks_df.sort_values(by="popularity", ascending=False)
                .groupby("track_genre", group_keys=False)
                .apply(lambda g: g.head(max(1, sample_tracks_limit // tracks_df["track_genre"].nunique())))
            )
            if len(sampled_df) < sample_tracks_limit:
                rem = tracks_df[~tracks_df.index.isin(sampled_df.index)].head(sample_tracks_limit - len(sampled_df))
                sampled_df = pd.concat([sampled_df, rem])
        else:
            sampled_df = tracks_df.sample(n=sample_tracks_limit, random_state=42)
    else:
        sampled_df = tracks_df

    tracks = export_tracks(sampled_df)
    recommendations = export_recommendations(recommendations_df)

    (output_dir / "tracks.json").write_text(
        json.dumps(tracks, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    (output_dir / "recommendations.json").write_text(
        json.dumps(recommendations, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    (output_dir / "aggregates.json").write_text(
        json.dumps(aggregates, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )

    print(f"Başarıyla yazıldı:")
    print(f" - {len(tracks):,} örnek parça -> {output_dir / 'tracks.json'}")
    print(f" - {len(recommendations):,} şarkı için öneriler -> {output_dir / 'recommendations.json'}")
    print(f" - {aggregates['total_tracks']:,} parça istatistiği -> {output_dir / 'aggregates.json'}")


def process_and_export_raw_data() -> None:
    print(f"CSV verisi yükleniyor: {RAW_DATA_PATH}...")
    if not RAW_DATA_PATH.exists():
        raise FileNotFoundError(f"{RAW_DATA_PATH} bulunamadı.")

    df = pd.read_csv(RAW_DATA_PATH)
    for col in ["Unnamed: 0.1", "Unnamed: 0"]:
        if col in df.columns:
            df = df.drop(columns=[col])
    df = df.dropna(subset=["track_name"])

    print("K-Means (k=4) Mood Kümeleme modeli çalıştırılıyor...")
    scaler = StandardScaler()
    scaled_feats = scaler.fit_transform(df[AUDIO_FEATURES])
    kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
    clusters = kmeans.fit_predict(scaled_feats)
    df["mood"] = [MOOD_CLUSTER_MAP.get(c, "Energetic & Dance") for c in clusters]

    print("Müzik türleri 6 üst kategoriye haritalanıyor...")
    df["genre_group"] = df["track_genre"].map(lambda g: GENRE_MAP.get(str(g).lower(), "Pop"))

    print("Öneri Matrisi (Cosine Similarity) hesaplanıyor...")
    # Örnek parçalar için önerileri hesapla
    sample_df = df.sort_values(by="popularity", ascending=False).head(300).copy() if "popularity" in df.columns else df.head(300).copy()
    sample_df = _normalize_id_column(sample_df)
    
    sample_scaled = scaler.transform(sample_df[AUDIO_FEATURES])
    sim_matrix = cosine_similarity(sample_scaled)

    rec_rows = []
    sample_ids = sample_df["id"].values
    for i, src_id in enumerate(sample_ids):
        # Kendisi hariç en yüksek benzerliğe sahip 10 parça
        sim_scores = sim_matrix[i]
        top_indices = np.argsort(sim_scores)[::-1]
        top_indices = [idx for idx in top_indices if idx != i][:10]
        
        for tgt_idx in top_indices:
            rec_rows.append({
                "source_id": str(src_id),
                "recommended_id": str(sample_ids[tgt_idx]),
                "similarity": round(float(sim_scores[tgt_idx]), 4)
            })

    recs_df = pd.DataFrame(rec_rows)

    print("JSON dosyaları frontend'e yazılıyor...")
    write_dashboard_json(df, recs_df, sample_tracks_limit=500)
    print("Tüm veriler başarıyla güncellendi!")


if __name__ == "__main__":
    process_and_export_raw_data()
