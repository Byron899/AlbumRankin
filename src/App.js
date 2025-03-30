
import React, { useEffect, useState } from "react";

function App() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    rating: ""
  });

  const API_URL = "https://albumbackende.onrender.com/albums";

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setAlbums(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.artist || !formData.rating) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error("Failed to add album");

      setFormData({ title: "", artist: "", rating: "" });
      fetchAlbums();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>🎵 Music Album Ranking</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          name="title"
          placeholder="Album Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="artist"
          placeholder="Artist Name"
          value={formData.artist}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="rating"
          placeholder="Rating"
          value={formData.rating}
          onChange={handleChange}
          min="0"
          max="10"
          required
        />
        <button type="submit">Add Album</button>
      </form>

      {loading ? (
        <p>Loading albums...</p>
      ) : error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : (
        <ul>
          {albums.map((album, index) => (
            <li key={index}>
              <strong>{album.title}</strong> by {album.artist} — Rating: {album.rating}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
