
import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/albums";

function App() {
  const [albums, setAlbums] = useState([]);
  const [albumForm, setAlbumForm] = useState({ title: "", artist: "", type: "Album" });
  const [songs, setSongs] = useState([{ title: "", rating: "", note: "" }]);
  const [average, setAverage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchAlbums(); }, []);
  useEffect(() => { calculateAverage(); }, [songs]);

  const fetchAlbums = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setAlbums(data);
  };

  const handleAlbumChange = (e) => setAlbumForm({ ...albumForm, [e.target.name]: e.target.value });
  const handleSongChange = (i, field, value) => {
    const newSongs = [...songs];
    newSongs[i][field] = value;
    setSongs(newSongs);
  };

  const addSongField = () => {
    if (songs.length < 50) setSongs([...songs, { title: "", rating: "", note: "" }]);
  };

  const calculateAverage = () => {
    const ratings = songs.map(s => parseFloat(s.rating)).filter(r => !isNaN(r));
    const total = ratings.reduce((a, b) => a + b, 0);
    const avg = ratings.length ? (total / ratings.length).toFixed(2) : null;
    setAverage({ total, average: avg, max: ratings.length * 10 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const filteredSongs = songs.filter(s => s.title && s.rating);
    if (!albumForm.title || !albumForm.artist || filteredSongs.length === 0) {
      alert("Fill out album info and songs.");
      return;
    }
    const payload = { ...albumForm, songs: filteredSongs };
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      resetForm();
      fetchAlbums();
    } else {
      alert("Error saving album");
    }
  };

  const resetForm = () => {
    setAlbumForm({ title: "", artist: "", type: "Album" });
    setSongs([{ title: "", rating: "", note: "" }]);
    setAverage(null);
    setEditingId(null);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1> Album Ranking App</h1>

      <form onSubmit={handleSubmit}>
        <input name="title" value={albumForm.title} onChange={handleAlbumChange} placeholder="Album Title" required />
        <input name="artist" value={albumForm.artist} onChange={handleAlbumChange} placeholder="Artist" required />
        <input name="type" value={albumForm.type} onChange={handleAlbumChange} placeholder="Album Type" />
        <h3>Songs</h3>
        {songs.map((song, idx) => (
          <div key={idx}>
            <input value={song.title} onChange={(e) => handleSongChange(idx, "title", e.target.value)} placeholder="Song Title" required />
            <input type="number" value={song.rating} onChange={(e) => handleSongChange(idx, "rating", e.target.value)} placeholder="Rating" min="0" max="10" required />
            <input value={song.note} onChange={(e) => handleSongChange(idx, "note", e.target.value)} placeholder="Note" />
          </div>
        ))}
        <button type="button" onClick={addSongField}>+ Add Song</button><br /><br />
        {average && <p> Avg: <strong>{average.average}/10</strong> ({average.total}/{average.max})</p>}
        <button type="submit">{editingId ? "Update" : "Add"} Album</button>
        {editingId && <button type="button" onClick={resetForm}>Cancel Edit</button>}
      </form>

      <h2> Ranked Albums</h2>
      {albums.map(album => (
        <div key={album.id} style={{ borderBottom: "1px solid #ccc", padding: "1rem 0" }}>
          <h3>{album.title} by {album.artist}</h3>
          <ul>
            {album.songs.map((s, i) => (
              <li key={i}>{s.title} — {s.rating}/10 {s.note && \`(\${s.note})\`}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default App;
