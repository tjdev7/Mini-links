import React, { useState } from 'react';
import './App.css'; 

const App = () => {
  const [longUrl, setLongUrl] = useState('');
  const [urls, setUrls] = useState([]);

  const generateShortCode = () => {
    return Math.random().toString(36).substring(2, 7);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!longUrl.trim()) return;

    const newUrl = {
      id: Date.now(),
      longUrl: longUrl.trim(),
      shortCode: generateShortCode(),
      createdAt: new Date().toLocaleString(),
    };

    setUrls([newUrl, ...urls]);
    setLongUrl('');
  };


  const copyToClipboard = (shortCode) => {
    const shortLink = `${window.location.origin}/${shortCode}`;
    navigator.clipboard.writeText(shortLink).then(() => {
      alert('Short link copied to clipboard!');
    }).catch(() => {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = shortLink;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('Short link copied to clipboard!');
    });
  };

  return (
    <div className="app">
      <h1>🔗 Mini-Links!</h1>
      <p>online url shortener tool</p>


      <br/>
      <form onSubmit={handleSubmit} className="shorten-form">
        <input
          type="url"
          placeholder="Enter a long URL (e.g., https://example.com)"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          required
        />
        <button type="submit">Shorten</button>
      </form>

      {urls.length === 0 ? (
        <p className="empty-message">No shortened URLs yet. Try one above!</p>
      ) : (
        <div className="url-list">
          <h2>Your Shortened URLs</h2>
          <ul>
            {urls.map((url) => {
              const shortLink = `${window.location.origin}/${url.shortCode}`;
              return (
                <li key={url.id} className="url-item">
                  <div className="url-details">
                    <span className="long-url">{url.longUrl}</span>
                    <span className="short-url">{shortLink}</span>
                    <span className="created-at">{url.createdAt}</span>
                  </div>
                  <button
                    className="copy-btn"
                    onClick={() => copyToClipboard(url.shortCode)}
                  >
                    Copy
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;