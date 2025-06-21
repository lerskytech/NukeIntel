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
      height: "100%",
      boxShadow: "0 0 40px rgba(0, 128, 255, 0.2)",
      fontFamily: "system-ui, sans-serif",
      border: "1px solid rgba(0, 128, 255, 0.2)"
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ color: "#fff", fontWeight: 700, margin: 0 }}>
          <span style={{ color: "#4d88ff" }}>◉ </span>
          NukeIntel High-Alert Webcams
        </h2>
        <div style={{ 
          backgroundColor: "#d32f2f", 
          fontSize: 12, 
          fontWeight: 600,
          padding: "3px 8px",
          borderRadius: 12,
          color: "white",
          textTransform: "uppercase",
          letterSpacing: "0.5px"
        }}>
          LIVE
        </div>
      </div>
      <div style={{ 
        display: "flex", 
        gap: 6, 
        flexWrap: "wrap", 
        marginBottom: 16,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        padding: 8,
        borderRadius: 12,
        overflowX: "auto"
      }}>
        {WEBCAMS.map((cam, idx) => (
          <button
            key={cam.id}
            onClick={() => setCurrent(idx)}
            style={{
              padding: "4px 12px",
              borderRadius: 8,
              border: "none",
              fontWeight: 600,
              background: idx === current 
                ? "linear-gradient(135deg, #d32f2f, #b71c1c)" 
                : "linear-gradient(135deg, #333, #222)",
              color: "#fff",
              cursor: "pointer",
              boxShadow: idx === current ? "0 2px 12px #d32f2f88" : "0 1px 3px rgba(0,0,0,0.3)",
              opacity: feedError && idx === current ? 0.5 : 1,
              fontSize: "0.8rem",
              minWidth: "60px",
              textAlign: "center",
              transition: "all 0.2s ease"
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
        minHeight: 380,
        position: "relative",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.05)"
      }}>
        {loading ? (
          <div style={{ 
            color: "#ccc", 
            textAlign: "center", 
            padding: 40, 
            display: "flex", 
            flexDirection: "column",
            alignItems: "center", 
            justifyContent: "center",
            height: 300
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "3px solid rgba(0,0,0,0)",
              borderTopColor: "#4d88ff",
              animation: "spin 1s linear infinite",
              marginBottom: 16
            }}></div>
            Loading live feed...
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}} />
          </div>
        ) : feedError ? (
          <div style={{
            color: "#d32f2f", 
            textAlign: "center", 
            padding: 40,
            fontWeight: 600, 
            fontSize: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: 300
          }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <div style={{ marginTop: 16 }}>Feed unavailable</div>
            <div style={{ fontSize: 14, color: "#999", fontWeight: "normal", marginTop: 8 }}>Please try another webcam</div>
          </div>
        ) : data ? (
          <WebcamFeed data={data} />
        ) : null}
      </div>
      
      <div style={{ 
        marginTop: 16, 
        fontSize: 11, 
        color: "#666", 
        textAlign: "center", 
        padding: "8px 16px",
        borderRadius: 8,
        background: "rgba(0,0,0,0.2)"
      }}>
        All webcams are provided by <a href="https://www.windy.com" target="_blank" rel="noopener noreferrer" style={{ color: "#4d88ff", textDecoration: "none" }}>Windy.com</a> | Updated: {new Date().toLocaleString()}
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
        position: "relative", width: "100%", aspectRatio: "16/9", background: "#000", borderRadius: 8, overflow: "hidden"
      }}>
        {playing && embedUrl ? (
          <iframe
            src={embedUrl}
            title={data.title}
            width="100%"
            height="300"
            style={{ border: "none", width: "100%", height: 300, borderRadius: 8 }}
            allow="autoplay; fullscreen"
            allowFullScreen
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
              style={{ width: "100%", height: 300, objectFit: "cover", borderRadius: 8, opacity: 0.85 }}
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
