import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useParams, Link } from 'react-router-dom';
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

  return (
    <div className="loading-message">
      <div className="spinner"></div>
      <p>Redirecting you to your link...</p>
    </div>
  );
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
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      }),
    };

    setUrls([newUrl, ...urls]);
    setLongUrl('');
  };

  const handleClearAll = () => {
    if (window.confirm("⚠️ Are you sure you want to delete ALL shortened URLs? This cannot be undone.")) {
      setUrls([]);
      localStorage.removeItem('shortUrls');
    }
  };

  const getFullShortLink = (code) => {
    return `${window.location.origin}/#/${code}`;
  };

  const copyToClipboard = (code) => {
    const link = getFullShortLink(code);
    navigator.clipboard.writeText(link).then(() => {
      const btn = document.getElementById(`copy-${code}`);
      if (btn) {
        const originalText = btn.innerText;
        btn.innerText = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerText = originalText;
          btn.classList.remove('copied');
        }, 2000);
      }
    }).catch(() => {
      alert('Failed to copy. Please copy manually.');
    });
  };

  return (
    <div className="app">
      <div className="header">
        <h1>🔗 Mini-Links 🔗</h1>
        <p className="subtitle">
          Shorten your links instantly. Stored locally in your browser.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="shorten-form">
        <input
          type="text"
          placeholder="Paste a long URL (e.g., example.com/very/long/path)"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          required
        />
        <button type="submit" className="btn-primary">Shorten</button>
      </form>

      {urls.length === 0 ? (
        <div className="empty-state">
          <p>No shortened URLs yet.</p>
          <p className="empty-subtext">Paste a link above to get started!</p>
        </div>
      ) : (
        <div className="url-list-container">
          <div className="list-header">
            <h2>Your Links ({urls.length})</h2>
            <button onClick={handleClearAll} className="btn-danger">
              Clear All
            </button>
          </div>
          
          <ul className="url-list">
            {urls.map((url) => {
              const shortLink = getFullShortLink(url.shortCode);
              return (
                <li key={url.id} className="url-item">
                  <div className="url-info">
                    <span className="long-url" title={url.longUrl}>{url.longUrl}</span>
                    <div className="short-url-row">
                      <Link 
                        to={`/${url.shortCode}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="short-url"
                      >
                        {shortLink}
                      </Link>
                      <span className="created-at">{url.createdAt}</span>
                    </div>
                  </div>
                  <button
                    id={`copy-${url.shortCode}`}
                    className="btn-copy"
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
        <Route path="/" element={<Main />} />
        <Route path="/:shortCode" element={<RedirectHandler />} />
      </Routes>
    </HashRouter>
  );
}

export default App;