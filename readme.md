# 🏨 Dwellio

**Dwellio** is a luxury hotel and vacation rental web application featuring an iconic neon pink and pitch-black dark theme.

Users can discover extraordinary architectural villas, mountain retreats, and beachfront resorts, view comprehensive property details with interactive pricing calculations, and host and manage their own stays with live photo previews.

## ✨ Features

* 🌟 **New Homepage (`/`)**: Breathtaking landing experience with hero section, live destination search, trending tags, category explorer, curated stays showcase, and host callout banner.
* 🏠 **All listings Catalog (`/listings`)**: Clean responsive grid with search filter (`?search=...`), category tags, and wishlist badges.
* 🔍 **Luxury Property Show Page (`/listings/:id`)**: High-res photo hero, verified host capsule, amenities grid, location information, and a sticky reservation price breakdown card with instant booking calculation.
* 🏨 **Host / Add Property (`/listings/host`)**: Polished 2-column creation form with interactive live image preview and one-click photo presets.
* ✏️ **Edit Listing (`/listings/:id/edit`)**: Pre-filled update form with real-time image preview and safe cancellation actions.
* 🗑️ **Delete Listing**: Secure removal with client-side confirmation dialog.
* 💾 **MongoDB Database Integration**: Connected to Mongoose `rentora` database.
* ⚡ **Express.js Backend**: RESTful CRUD routing with `wrapAsync` and central error middleware.
* 🎨 **Neon Pink & Black Design System**:
  - Fonts: Local `Stardom` (editorial headings) & `Zodiak` (light, regular, bold, extrabold body typography).
  - Floating pill navigation bar with active indicators and responsive mobile drawer.
  - Signature Dwellio stats footer (4.9/5 Average rating, 12k+ Places to stay, 24/7 Guest support).
* 🛡️ **Robust Error Handling**:
  - Friendly neon 404 page for missing routes (`/views/404.ejs`).
  - Dedicated CastError page for invalid MongoDB ObjectIds (`/views/404Cast.ejs`).

## 🛠️ Tech Stack

**Frontend**
* Tailwind CSS (v4 CDN)
* EJS (Embedded JavaScript Templates)
* Font Awesome 6.7.2
* Plus Jakarta Sans & Google Fonts
* Custom Local Typefaces: `Stardom` & `Zodiak`

**Backend**
* Node.js
* Express.js 5
* Method Override (PATCH, DELETE)

**Database**
* MongoDB
* Mongoose 9

## 📂 Project Structure

```text
Dwellio/
│
├── Models/
│   └── listing.js          # Mongoose Listing schema & model
│
├── views/
│   ├── includes/
│   │   ├── head.ejs        # Shared head with fonts, Tailwind, neon theme CSS
│   │   ├── navbar.ejs      # Floating pill navigation bar with mobile menu
│   │   └── footer.ejs      # Signature Dwellio stats & brand footer
│   ├── landing.ejs         # Homepage (/) with hero section & search
│   ├── listings.ejs        # All listings catalog (/listings) with search filter
│   ├── home.ejs            # Alias to listings.ejs for backward compatibility
│   ├── show.ejs            # Single listing detail page (/listings/:id)
│   ├── host.ejs            # Add new property form (/listings/host)
│   ├── edit.ejs            # Edit property form (/listings/:id/edit)
│   ├── 404.ejs             # Page not found error page
│   └── 404Cast.ejs         # Invalid listing ID / CastError page
│
├── init/
│   ├── data.js             # High quality curated luxury sample listings
│   └── index.js            # Database seeding script (node init/index.js)
│
├── assets/
│   ├── fonts/              # Stardom & Zodiak font files
│   └── favicon.png         # Dwellio browser icon
│
├── utils/
│   ├── ExpressError.js     # Custom error class with status codes
│   └── wrapAsync.js        # Async wrapper to eliminate try-catch boilerplate
│
├── app.js                  # Main Express application & routes
├── package.json
└── README.md
```

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Seed Sample listings (Optional)

To populate the database with luxury travel destinations:

```bash
node init/index.js
```

### 3. Start the server

```bash
node app.js
```

The application will run at:
```text
http://localhost:3030
```

## 🔗 Routes

| Method | Route                | Description                                    |
| ------ | -------------------- | ---------------------------------------------- |
| GET    | `/`                  | Homepage with hero section, search & showcase  |
| GET    | `/listings`          | Display all listings (supports `?search=...`)  |
| GET    | `/listings/host`     | Form to host a new property                    |
| POST   | `/listings`          | Create and save a new listing                  |
| GET    | `/listings/:id`      | View luxury details and booking calculator     |
| GET    | `/listings/:id/edit` | Edit property details with live preview        |
| PATCH  | `/listings/:id`      | Update property information                    |
| DELETE | `/listings/:id`      | Delete a listing                               |
| GET    | `/test`              | Quick endpoint to insert a sample test villa   |

---
⭐ **Dwellio** — Places worth staying in.