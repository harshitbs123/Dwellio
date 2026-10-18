# 🏨 Dwellio

**Dwellio** is a luxury hotel and vacation rental web application featuring a dual-theme design system — an iconic **Vice City neon pink & black dark mode** and a sleek **glassmorphism frosted-glass light mode** with animated floating glow orbs.

Users can discover extraordinary architectural villas, mountain retreats, and beachfront resorts, view comprehensive property details with interactive pricing calculations, leave star-rated reviews, and host and manage their own stays with live photo previews.

---

## ✨ Features

### 🎨 Dual Theme System (Dark / Light)
- **🌙 Vice City Dark Mode** — Pitch-black canvas with neon pink (`#ff2a85`) accents, glassy dark panels (`backdrop-filter: blur`), specular edge highlights, and ambient radial glows. The signature Dwellio theme.
- **☀️ Glassmorphism Light Mode** — Minimal frosted-glass aesthetic inspired by Apple macOS & Superhuman. Clean pearl-white canvas with translucent glass cards (`rgba(255,255,255,0.52)`, `blur(28px) saturate(190%)`), specular top-rim lighting, and pink accent focus rings.
- **🔮 Floating 3D Glow Orbs** — Four animated ambient orbs (neon pink, electric violet, iridescent cyan, sunset rose) float behind the content with organic `@keyframes` motion. The frosted glass cards refract and diffuse the orb light, creating an authentic glassmorphism depth effect in both themes.
- **🌗 Instant Theme Toggle** — A moon/sun toggle button in the navbar (and mobile menu) switches between themes instantly. Preference is saved to `localStorage` and applied before first paint (zero-flicker).

### 🏠 Core Application
- 🌟 **Homepage (`/`)** — Breathtaking landing experience with hero section, live destination search, trending destination tags, category explorer strip, curated stays showcase grid, "Why Dwellio" pillars, and host callout banner.
- 🏠 **All Listings Catalog (`/listings`)** — Clean responsive grid with real-time search filter (`?search=...`), category quick-filter pills (All, Villas, Beachfront, Mountains, Pools, Resorts, Penthouses), and wishlist badges.
- 🔍 **Luxury Property Show Page (`/listings/:id`)** — High-res photo hero, verified host capsule, amenities grid, location section, interactive review section, and a sticky reservation price breakdown card with instant booking calculation.
- ⭐ **Review System** — Guests can submit star-rated reviews (1–5 stars) with name and description. Reviews display with animated star icons, formatted timestamps, and glass avatar capsules. Backed by a dedicated Mongoose `Review` model with `createdAt` timestamps.
- 🏨 **Host / Add Property (`/listings/host`)** — Polished 2-column creation form with interactive live image preview and one-click photo presets.
- ✏️ **Edit Listing (`/listings/:id/edit`)** — Pre-filled update form with real-time image preview, breadcrumb navigation, and safe cancellation actions.
- 🗑️ **Delete Listing** — Secure removal with client-side confirmation dialog.

### 🛡️ Error Handling
- Friendly neon 404 page for missing routes (`/views/404.ejs`).
- Dedicated CastError page for invalid MongoDB ObjectIds (`/views/404Cast.ejs`).

### 🎭 Design System Details
- **Fonts**: Local `Stardom` (editorial headings) & `Zodiak` (thin, light, regular, bold, extrabold body typography) + `Plus Jakarta Sans` (system UI).
- **Vice City Script Logo**: Custom brush-script "Dwellio" logo (`assets/logo.png`) with `mix-blend-screen` in dark mode and natural drop-shadow in light mode.
- **Floating pill navbar** with active indicators, responsive mobile drawer, theme toggle, and "Become a host" CTA.
- **Signature gradient footer** with Dwellio brand badge, copyright, and 3 frosted stat cards (4.9/5 rating, 12k+ places, 24/7 support).
- **Glassy pink scrollbar** — Thin translucent gradient scrollbar with neon glow that adapts to both themes.

---

## 🛠️ Tech Stack

**Frontend**
- Tailwind CSS (v4 CDN)
- EJS (Embedded JavaScript Templates)
- Font Awesome 6.7.2
- Plus Jakarta Sans & Google Fonts
- Custom Local Typefaces: `Stardom` & `Zodiak`
- CSS `backdrop-filter` glassmorphism + `@keyframes` orb animations

**Backend**
- Node.js
- Express.js 5
- Method Override (PATCH, DELETE)

**Database**
- MongoDB
- Mongoose 9

---

## 📂 Project Structure

```text
Dwellio/
│
├── Models/
│   ├── listing.js            # Mongoose Listing schema & model
│   └── review.js             # Mongoose Review schema (name, description, rating, createdAt)
│
├── views/
│   ├── includes/
│   │   ├── head.ejs          # Shared head: fonts, Tailwind, neon theme CSS,
│   │   │                     #   glassmorphism orb styles, light/dark mode CSS,
│   │   │                     #   zero-flicker theme initializer script
│   │   ├── navbar.ejs        # Floating pill navbar with theme toggle,
│   │   │                     #   mobile menu, floating 3D glow orbs container
│   │   └── footer.ejs        # Signature gradient footer with brand badge & stats
│   ├── landing.ejs           # Homepage (/) with hero, search, showcase & pillars
│   ├── listings.ejs          # All listings catalog (/listings) with search & filters
│   ├── home.ejs              # Alias to listings.ejs for backward compatibility
│   ├── show.ejs              # Property detail page with reviews & booking card
│   ├── host.ejs              # Add new property form (/listings/host)
│   ├── edit.ejs              # Edit property form (/listings/:id/edit)
│   ├── 404.ejs               # Page not found error page
│   └── 404Cast.ejs           # Invalid listing ID / CastError page
│
├── init/
│   ├── data.js               # Curated luxury sample listings (9 properties)
│   └── index.js              # Database seeding script (node init/index.js)
│
├── assets/
│   ├── fonts/                # Stardom & Zodiak font files (.otf)
│   ├── logo.png              # Vice City brush-script Dwellio logo (RGBA, transparent)
│   ├── dwellio-vice.png      # Alternate Vice City style logo
│   └── favicon.png           # Browser favicon
│
├── utils/
│   ├── ExpressError.js       # Custom error class with status codes
│   └── wrapAsync.js          # Async wrapper to eliminate try-catch boilerplate
│
├── app.js                    # Main Express application & routes
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start MongoDB

Make sure MongoDB is running locally on the default port:

```bash
mongod
```

### 3. Seed sample listings (optional)

Populate the database with 9 curated luxury travel destinations:

```bash
node init/index.js
```

### 4. Start the server

```bash
node app.js
```

The application will run at:
```
http://localhost:3030
```

---

## 🔗 Routes

| Method | Route                      | Description                                     |
| ------ | -------------------------- | ----------------------------------------------- |
| GET    | `/`                        | Homepage with hero section, search & showcase    |
| GET    | `/listings`                | Display all listings (supports `?search=...`)    |
| GET    | `/listings/host`           | Form to host a new property                      |
| POST   | `/listings`                | Create and save a new listing                    |
| GET    | `/listings/:id`            | View property details, reviews & booking card    |
| POST   | `/listings/:id/reviews`    | Submit a star-rated review for a listing         |
| GET    | `/listings/:id/edit`       | Edit property details with live preview          |
| PATCH  | `/listings/:id`            | Update property information                      |
| DELETE | `/listings/:id`            | Delete a listing                                 |
| GET    | `/test`                    | Quick endpoint to insert a sample test villa     |

---

## 🌗 Theme Architecture

The dual-theme system works through a `data-theme` attribute on the `<html>` element:

```
html[data-theme="dark"]   → Vice City neon pink & black
html[data-theme="light"]  → Glassmorphism frosted-glass minimal
```

- **Zero-flicker initialization**: An inline `<script>` in `head.ejs` reads `localStorage` and sets the theme before the page renders.
- **CSS cascade**: All light-mode overrides use `html[data-theme="light"]` selectors with `!important` to override Tailwind utility classes.
- **Floating orbs**: 4 `position: fixed` blurred radial-gradient divs animate with `@keyframes` and sit at `z-index: -20` behind all content.

---

⭐ **Dwellio** — Places worth staying in.