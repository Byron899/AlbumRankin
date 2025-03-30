
import React, { useEffect, useState } from "react";

function App() {
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://albumbackende.onrender.com/albums")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setAlbums(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Music Album Ranking</h1>
      {error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : albums.length === 0 ? (
        <p>Loading albums...</p>
      ) : (
        <ul>
          {albums.map((album) => (
            <li key={album.id}>
              <strong>{album.title}</strong> by {album.artist} ({album.year}) – Score: {album.score}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
