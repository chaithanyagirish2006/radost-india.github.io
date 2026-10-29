# Radost India Café — HTML/CSS/JS rebuild

A complete vanilla front-end rebuild of the supplied Radost India Café reference project.

## Included

- Responsive café landing page with hero, story, menu, services, gallery, location, and footer sections.
- Menu categories and products rendered from JavaScript data.
- Product details modal with related items.
- Persistent cart drawer with quantity controls, removal, delivery fee, subtotal, and total.
- Demo checkout form and table-booking form with success states.
- Mobile navigation and responsive layouts.
- Cart persistence through `localStorage`.

## Run locally

From this folder, run:

```bash
python3 -m http.server 3000
```

Then open `http://localhost:3000`.

The project is intentionally framework-free. It uses Tailwind's browser CDN for utility classes and Iconify's browser CDN for the Solar icon set; the page logic and custom component styling live in `js/app.js` and `css/styles.css`.
