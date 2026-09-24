# 🔗 Mini-Links 🔗

A fully functional, **zero-backend** URL shortener that lives entirely in your browser. Built with React and React Router (`HashRouter`), it generates short links and stores them directly in your browser's `localStorage`—no servers, no databases, no API keys required.

🔴 **Important Caveat:** Because all data is stored in `localStorage`, your shortened links will **only work on the device and browser where they were created**. This is a perfect prototype for learning, local use, or internal team tools, but it is not a global link shortener (like Bitly) without a backend.

## 🚀 Live Demo
*Replace this with your GitHub Pages URL after deployment through Github pages:*
> `https://<your-username>.github.io/<your-repo-name>`

## ✨ Features

- **Instant Shortening** – Enter any URL and get a unique 5-character short code.
- **Persistent Storage** – Links survive browser refreshes and tab closures (thanks to `localStorage`).
- **Zero Backend Required** – Client-side routing with `react-router-dom` handles redirects seamlessly.
- **Copy to Clipboard** – One-click copy of your short link.
- **Fully Responsive** – Works beautifully on desktop and mobile.
- **Static Hosting Ready** – Deploy instantly to GitHub Pages, Vercel, or Netlify.

## 🧠 How It Works

1. **Shortening:** When you submit a URL, the app generates a random 5-character code (e.g., `f3GtZ`) and saves the mapping (`f3GtZ` ↔ `https://example.com`) to `localStorage`.
2. **Redirecting:** When you visit `/#/f3GtZ`, the React Router catches the route, reads the `shortCode` from the URL, looks it up in `localStorage`, and automatically redirects your browser to the original long URL.

## 🛠️ Tech Stack

- **React** (Create React App)
- **React Router DOM** (HashRouter for static hosting compatibility)
- **CSS3** (Custom styling)
- **localStorage** (Browser storage API)

## 📦 Installation & Local Development

To run this project locally on your machine:

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/<your-repo-name>.git

# 2. Navigate into the project folder
cd <your-repo-name>

# 3. Install dependencies
npm install

# 4. Start the development server
npm start