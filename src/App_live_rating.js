import React, { useState, useEffect } from "react";

function App() {
  const API_URL = "https://albumranking-backend.onrender.com/albums";

  const [albums, setAlbums] = useState([]);
  const [albumForm, setAlbumForm] = useState({
    title: "",
    artist: "",
    type: "Album",
  });
  const [songs, setSongs] = useState([{ title: "", rating: "", note: "" }]);
  const [average, setAverage] = useState(null);

  useEffect(() => {
    fetchAlbums();
  }, []);

  useEffect(() => {
    calculateAverage();
  }, [songs]);

  const fetchAlbums = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setAlbums(data);
    } catch (err) {
      console.error("Failed to fetch albums:", err);
    }
  };

  const handleAlbumChange = (e) => {
    setAlbumForm({ ...albumForm, [e.target.name]: e.target.value });
  };

  const handleSongChange = (index, field, value) => {
    const newSongs = [...songs];
    newSongs[index][field] = value;
    setSongs(newSongs);
  };

  const addSongField = () => {
    if (songs.length < 50) {
      setSongs([...songs, { title: "", rating: "", note: "" }]);
    }
  };

  const calculateAverage = () => {
    const validRatings = songs
      .map((s) => parseFloat(s.rating))
      .filter((r) => !isNaN(r));
    const total = validRatings.reduce((a, b) => a + b, 0);
    const avg = validRatings.length > 0 ? (total / validRatings.length).toFixed(2) : null;
    setAverage({
      total,
      average: avg,
      max: validRatings.length * 10,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const filteredSongs = songs.filter((s) => s.title && s.rating);
    if (!albumForm.title || !albumForm.artist || filteredSongs.length === 0) {
      alert("Please fill out album info and at least one valid song.");
      return;
    }

    const payload = {
      ...albumForm,
      songs: filteredSongs,
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setAlbumForm({ title: "", artist: "", type: "Album" });
        setSongs([{ title: "", rating: "", note: "" }]);
        setAverage(null);
        fetchAlbums();
      } else {
        alert("Error saving album.");
      }
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>🎶 Album Ranking App</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={albumForm.title}
          onChange={handleAlbumChange}
          placeholder="Album Title"
          required
        />
        <input
          name="artist"
          value={albumForm.artist}
          onChange={handleAlbumChange}
          placeholder="Artist"
          required
        />
        <input
          name="type"
          value={albumForm.type}
          onChange={handleAlbumChange}
          placeholder="Album Type"
        />

        <h3>Songs (up to 50)</h3>
        {songs.map((song, idx) => (
          <div key={idx} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <input
              value={song.title}
              onChange={(e) => handleSongChange(idx, "title", e.target.value)}
              placeholder="Song Title"
              required
            />
            <input
              type="number"
              value={song.rating}
              onChange={(e) => handleSongChange(idx, "rating", e.target.value)}
              placeholder="Rating (0-10)"
              min="0"
              max="10"
              required
            />
            <input
              value={song.note}
              onChange={(e) => handleSongChange(idx, "note", e.target.value)}
              placeholder="Note (optional)"
            />
          </div>
        ))}
        <button type="button" onClick={addSongField}>+ Add Song</button><br /><br />
        {average && (
          <p>
            💯 Current Average: <strong>{average.average}/10</strong> ({average.total}/{average.max})
          </p>
        )}
        <button type="submit">Submit Album</button>
      </form>

      <h2>📊 Ranked Albums</h2>
      {albums.map((album) => (
        <div key={album.id} style={{ borderBottom: "1px solid #ccc", padding: "1rem 0" }}>
          <h3>{album.rank}. {album.title} by {album.artist}</h3>
          <p>Type: {album.type}</p>
          <p>Avg Rating: {album.average}/10 ({album.total_score}/{album.max_score})</p>
          <ul>
            {album.songs.map((song, i) => (
              <li key={i}>{song.title} — {song.rating}/10 {song.note && `(${song.note})`}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default App;