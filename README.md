# Chicken Buckets website
Static multi-page site (HTML + CSS + a little JS). No dependencies, no build step, no server.

Pages: `index.html` (home), `menu.html` (full menu), `cart.html` (cart + checkout), `about.html`, `contact.html`

- Preview: open `index.html`, or run `python3 -m http.server` in this folder
- Deploy: drag the folder to Netlify / Cloudflare Pages / Vercel (`_headers` adds security headers)
- Cart is saved in the browser (localStorage). "Add to Cart" opens the cart page.
- Checkout sends the order to WhatsApp at +92 313 4141187 (change the number in `script.js`, search for `wa.me`)
- Menu photos: `assets/m1-m5.webp`, `menu-burger/pizza/shawarma.webp`. Items without a photo show an emoji tile; to add a photo, replace the `<div class="ph">` in `menu.html` with an `<img>`.
- Social icons in the home-page footer still point to `#`: add your real links.
