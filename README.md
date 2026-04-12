# UniVault — Project Structure

## 📁 File Structure

```
univault/
├── index.html              ← Main entry point (loads all files)
├── index-combined.html     ← Single-file version (works without build tool)
├── README.md               ← This file
│
├── css/
│   └── main.css            ← All styles (14,800+ lines)
│
├── js/
│   ├── supabase-config.js  ← ⭐ BACKEND CONFIG — paste your Supabase key here
│   ├── navigation.js       ← Page routing, go(), theme toggle
│   ├── onboarding.js       ← Onboarding steps & language selection
│   ├── coding.js           ← Code editor, timers, run button
│   ├── rank.js             ← Rank mode sessions & scoring
│   ├── ui.js               ← Scroll effects, dashboard, navbar animations
│   ├── auth.js             ← ⭐ LOGIN/SIGNUP — connect Supabase auth here
│   ├── semesters.js        ← ⭐ SEMESTER DATA — replace with Supabase queries
│   ├── aichat.js           ← AI chat message handling
│   ├── features.js         ← Feature page animations, contact form, gated pages
│   ├── hero-animation.js   ← "Hello World" animated hero text
│   ├── fusion-orbit.js     ← Orbital timeline animation
│   ├── light-pillar.js     ← Three.js purple light effect
│   └── starfield.js        ← Canvas star background
│
└── pages/
    ├── navbar.html          ← Navigation bar
    ├── home.html            ← Landing page + authenticated dashboard
    ├── login.html           ← Login form
    ├── signup.html          ← Signup form
    ├── onboarding.html      ← New user onboarding flow
    ├── about.html           ← About page
    ├── features.html        ← Features page
    ├── contact.html         ← Contact form
    ├── learn.html           ← Learning page with semester selector
    ├── aichat.html          ← AI Chat page
    ├── course.html          ← Individual course view
    ├── lesson.html          ← Lesson content page
    ├── practice.html        ← Practice configuration
    ├── coding.html          ← Code editor page
    ├── results.html         ← Practice results
    ├── rank.html            ← Rank mode setup
    ├── ranksession.html     ← Active rank session
    ├── rankresults.html     ← Rank results
    ├── leaderboard.html     ← Global leaderboard
    ├── profile.html         ← User profile
    └── settings.html        ← User settings
```

## 🚀 Quick Start

### Option 1: Single File (No Build Tool)
Open `index-combined.html` in your browser. Everything works out of the box.

### Option 2: Split Files (For Development)
The split files are for easier debugging and development. To use them:

1. You need a local server (browsers block local file:// JS imports)
2. Install: `npm install -g live-server` or use VS Code "Live Server" extension
3. Run: `live-server` in the univault/ folder
4. Open: http://localhost:8080

## ⭐ Key Files for Backend Integration

When connecting Supabase, you only need to edit 3 files:

| File | What to Change |
|------|---------------|
| `js/supabase-config.js` | Paste your Supabase URL and anon key |
| `js/auth.js` | Replace localStorage auth with `supabase.auth.signUp()` / `signInWithPassword()` |
| `js/semesters.js` | Replace hardcoded `semesterData` with `supabase.from('subjects').select('*')` |

## 📱 Responsive Breakpoints

- **Desktop**: 1024px+ (full layout)
- **Tablet**: 768px–1024px (coding stacks vertically, sidebar hides)
- **Mobile**: 480px–767px (single column, compact nav)
- **Small Mobile**: 340px–480px (minimal nav, stacked cards)
- **iPhone notch**: Safe area insets supported

## 🔑 Admin Panel

The admin panel is a separate file (`univault_admin.html`). 
It manages semesters, subjects, materials, users, and announcements.
