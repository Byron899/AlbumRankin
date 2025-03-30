import React, { useEffect, useState } from "react";

function App() {
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://albumbackende.onrender.com/albums", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        albums: [
          { name: "Blonde", artist: "Frank Ocean" },
          { name: "DAMN.", artist: "Kendrick Lamar" },
          { name: "To Pimp a Butterfly", artist: "Kendrick Lamar" },
        ],
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response not ok");
        }
        return response.json();
      })
      .then((data) => {
        setAlbums(data.ranked_albums || []);
        setError("");
      })
      .catch((err) => {
        setError("Error: " + err.message);
      });
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>🎵 Music Album Ranking</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {albums.map((album, index) => (
          <li key={index}>
            #{index + 1}: <strong>{album.name}</strong> by {album.artist}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
