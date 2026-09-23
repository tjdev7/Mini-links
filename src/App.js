import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useParams } from 'react-router-dom';
import './App.css';

function RedirectHandler() {
  const { shortCode } = useParams();

  useEffect(() => {

    const stored = localStorage.getItem('shortUrls');
    if (stored) {
      const urls = JSON.parse(stored);
      const found = urls.find((u) => u.shortCode === shortCode);
      if (found) {
        window.location.href = found.longUrl;
        return;
      }
    }

    window.location.href = '/';
  }, [shortCode]);

  return <div className="loading-message">Redirecting you to your link...</div>;
}

function Main() {
  const [longUrl, setLongUrl] = useState('');
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('shortUrls');
    if (stored) {
      setUrls(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('shortUrls', JSON.stringify(urls));
  }, [urls]);

  const generateShortCode = () => {
    return Math.random().toString(36).substring(2, 7);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedUrl = longUrl.trim();
    if (!trimmedUrl) return;

    let urlToSave = trimmedUrl;
    if (!urlToSave.startsWith('http://') && !urlToSave.startsWith('https://')) {
      urlToSave = 'https://' + urlToSave;
    }

    const newUrl = {
      id: Date.now(),
      longUrl: urlToSave,
      shortCode: generateShortCode(),
      createdAt: new Date().toLocaleString(),
    };

    setUrls([newUrl, ...urls]); 
    setLongUrl('');
  };

  const getFullShortLink = (code) => {
    return `${window.location.origin}/#/${code}`;
  };

  const copyToClipboard = (code) => {
    const link = getFullShortLink(code);
    navigator.clipboard
      .writeText(link)
      .then(() => alert('✅ Short link copied to clipboard!'))
      .catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = link;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('✅ Short link copied to clipboard!');
      });
  };

  return (
    <div className="app">
      <h1 class="app-title">🔗 Mini-Links 🔗</h1>
      <p className="app-subtitle">
        💾 Links are stored in your browser's localStorage. They won't disappear even if you refresh! 💾
      </p>

      <form onSubmit={handleSubmit} className="shorten-form">
        <input
          type="text"
          placeholder="Enter a long URL (e.g., example.com)"
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
              const shortLink = getFullShortLink(url.shortCode);
              return (
                <li key={url.id} className="url-item">
                  <div className="url-details">
                    <span className="long-url">{url.longUrl}</span>
                    <a
                      href={shortLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="short-url"
                    >
                      {shortLink}
                    </a>
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
}

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Homepage */}
        <Route path="/" element={<Main />} />
        {/* Redirect route: matches /#/anything-here */}
        <Route path="/:shortCode" element={<RedirectHandler />} />
      </Routes>
    </HashRouter>
  );
}

export default App;