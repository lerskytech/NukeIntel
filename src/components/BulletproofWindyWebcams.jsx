import React, { useState, useEffect } from "react";

// Use environment variable for the API key instead of hardcoding
const WINDY_API_KEY = process.env.REACT_APP_WINDY_API_KEY || "R8dCVN22qRoJuezR4hF6XAvVcyfdebnJ";

// Import CURATED_WEBCAMS if needed, or use the local definition
import { CURATED_WEBCAMS } from "../data/webcamSources";

// Use the same format for consistency
const WEBCAMS = [
  { id: 1693844957, label: "Moscow – Khamovniki District" },
  { id: 1389696188, label: "Jerusalem – City Center" },
  { id: 1748254982, label: "Tel Aviv – Hilton Beach" },
  { id: 1744523397, label: "Jeokseong-myeon – Near N. Korea Border" },
  { id: 1166267733, label: "Hong Kong – Victoria Harbour" },
  { id: 1596008082, label: "Beijing – Olympic Tower" },
  { id: 1263154384, label: "Washington D.C. – US Capitol" },
  { id: 1731400881, label: "Taipei – Taipei 101" },
  { id: 1568461321, label: "London – City Center" },
  { id: 1706118429, label: "Paris – Palais d'Iéna" },
];

function BulletproofWindyWebcams() {
  const [current, setCurrent] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedError, setFeedError] = useState(false);
  const webcamId = WEBCAMS[current].id;

  useEffect(() => {
    setLoading(true);
    setFeedError(false);

    fetch(
      `https://api.windy.com/webcams/api/v3/webcams?webcamIds=${webcamId}&include=images,player,location`,
      {
        headers: {
          "x-windy-api-key": WINDY_API_KEY,
        },
      }
    )
      .then((res) => res.json())
      .then((json) => {
        console.log("API RESULT FOR WEBCAM:", json);
        if (!json.webcams || !json.webcams[0]) {
          setFeedError(true);
        }
        setData(json.webcams?.[0] || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching webcam data:", err);
        setFeedError(true);
        setLoading(false);
      });
  }, [webcamId]);

  return (
    <div style={{
      background: "#11141A",
      padding: 32,
      borderRadius: 24,
      width: "100%",
      maxWidth: 800,
      margin: "40px auto",
      boxShadow: "0 0 40px #121",
      fontFamily: "system-ui, sans-serif"
    }}>
      <h2 style={{ color: "#fff", marginBottom: 8, fontWeight: 700 }}>NukeIntel High-Alert Webcams</h2>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {WEBCAMS.map((cam, idx) => (
          <button
            key={cam.id}
            onClick={() => setCurrent(idx)}
            style={{
              padding: "4px 12px",
              borderRadius: 8,
              border: "none",
              fontWeight: 600,
              background: idx === current ? "#d32f2f" : "#333",
              color: "#fff",
              cursor: "pointer",
              boxShadow: idx === current ? "0 2px 12px #d32f2f88" : undefined,
              opacity: feedError && idx === current ? 0.5 : 1,
            }}
          >
            {cam.label.split("–")[0].trim()}
          </button>
        ))}
      </div>

      <div style={{
        background: "#181F29",
        borderRadius: 16,
        padding: 16,
        minHeight: 450,
        position: "relative",
        overflow: "hidden"
      }}>
        {loading ? (
          <div style={{ color: "#ccc", textAlign: "center", padding: 40 }}>
            Loading live feed...
          </div>
        ) : feedError ? (
          <div style={{
            color: "#d32f2f", textAlign: "center", padding: 40,
            fontWeight: 600, fontSize: 20
          }}>
            Feed unavailable
          </div>
        ) : data ? (
          <WebcamFeed data={data} />
        ) : null}
      </div>
    </div>
  );
}

function WebcamFeed({ data }) {
  const [playing, setPlaying] = useState(false);
  const thumbnail = data.images?.current?.thumbnail || data.images?.daylight?.thumbnail;
  const preview = data.images?.current?.preview || data.images?.daylight?.preview;
  const embedUrl = data.player?.day;

  return (
    <div>
      <div style={{ marginBottom: 10, color: "#fff", fontSize: 12, opacity: 0.6 }}>
        <div>Webcam ID: {data.webcamId || data.id}</div>
        <div>Title: {data.title}</div>
        <div>Embed URL: {String(embedUrl)}</div>
      </div>
      <div style={{
        position: "relative", width: "100%", aspectRatio: "16/9", background: "#000", borderRadius: 8, overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
      }}>
        {playing && embedUrl ? (
          <iframe
            src={embedUrl + '?autoplay=1&muted=0'}
            title={data.title}
            width="100%"
            height="400"
            style={{ border: "none", width: "100%", height: 400, borderRadius: 8 }}
            allow="autoplay; fullscreen"
            allowFullScreen
            frameBorder="0"
          />
        ) : (
          <div
            style={{
              width: "100%", height: 300, display: "flex", alignItems: "center", justifyContent: "center",
              background: "#15171A", cursor: "pointer", position: "relative"
            }}
            onClick={() => setPlaying(true)}
            title="Click to play live feed"
          >
            <img
              src={preview || thumbnail}
              alt={data.title}
              style={{ width: "100%", height: 400, objectFit: "cover", borderRadius: 8, opacity: 0.85 }}
            />
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#d32f2f", borderRadius: "50%",
              width: 56, height: 56, display: "flex",
              alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 12px #d32f2fcc"
            }}>
              <span style={{
                width: 0, height: 0, borderTop: "12px solid transparent",
                borderBottom: "12px solid transparent",
                borderLeft: "22px solid #fff", marginLeft: 8
              }} />
            </div>
          </div>
        )}
      </div>
      <div style={{ marginTop: 12, color: "#ccc" }}>
        <div style={{ fontWeight: 600, color: "#fff" }}>{data.title}</div>
        <div style={{ fontSize: 13, opacity: 0.75 }}>{data.location?.city}, {data.location?.country}</div>
      </div>
      <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>
        Powered by <a href={`https://www.windy.com/webcams/${data.webcamId}`} style={{ color: "#d32f2f" }} target="_blank" rel="noopener noreferrer">Windy.com</a>
      </div>
    </div>
  );
}

export default BulletproofWindyWebcams;
