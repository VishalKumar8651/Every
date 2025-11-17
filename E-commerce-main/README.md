# E-commerce Frontend

A simple, responsive e-commerce storefront built with HTML, CSS, and vanilla JavaScript. It showcases product listings, a product detail page, and a browser-persistent shopping cart using localStorage.

## ✨ Features

- **Responsive layout**: Built with Bootstrap 5 and custom CSS.
- **Multi-page site**: Home, Shop, Blog, About, Contact, Cart, and Single Product pages.
- **Product catalog**: Grid of products with images, titles, ratings, and prices.
- **Shopping cart**:
  - Add items from Home and Shop pages.
  - Persist items using browser `localStorage`.
  - Update quantities and remove items on the Cart page.
  - Automatic subtotal calculation.
- **Icons & styling**: Font Awesome icons via CDN.

## 🧰 Tech Stack

- **HTML5**, **CSS3**, **JavaScript (Vanilla)**
- **Bootstrap 5.3.8** (CDN)
- **Font Awesome 6.7.2** (CDN)

## 📂 Project Structure

```
E-commerce/
├─ index.html        # Home page
├─ shop.html         # Shop page (product listing)
├─ sproduct.html     # Single product page
├─ cart.html         # Cart page (persistent cart UI)
├─ about.html        # About page
├─ blog.html         # Blog page
├─ contact.html      # Contact page
├─ style.css         # Custom styles
├─ script.js         # Navbar + cart logic (localStorage)
└─ img/              # Images (banner, product, electronics, blog, etc.)
   ├─ product/
   ├─ elect/
   ├─ banner/
   ├─ blog/
   ├─ about/
   └─ pay/
```

## 🚀 Getting Started

1. **Open directly (simplest)**

   - Double-click `index.html` to open in your browser.

2. **Use VS Code Live Server (recommended for dev)**

   - Install the "Live Server" extension.
   - Right-click `index.html` → "Open with Live Server".

3. **Run a local server (Python example)**

   - Open PowerShell in the project folder and run:

     ```powershell
     py -m http.server 5500
     ```

   - Visit: http://localhost:5500/

## 🛒 How the Cart Works

- Each product card has an "Add to cart" button (IDs like `cbtn1`, `cbtn2`, ...).
- Clicking adds an item with `{ image, name, price, quantity }` to `localStorage`.
- On `cart.html`, items render with quantity inputs and remove buttons.
- Subtotal updates automatically when quantities change or items are removed.
- Items are identified by a combination of **name + image** to avoid duplicates.

## 🔧 Development Notes

- Cart logic lives in `script.js`:
  - Adds event listeners to specific button IDs (`cbtn*`, `ecbtn*`, `ec2btn*`, `ec3btn*`).
  - Expects product cards to use the `.pro` container with `h5` for name and `h4` for price.
  - Prices are parsed by stripping non-digits; keep price text like `Rs. 400`.
- If you add new products, follow the existing markup pattern to ensure cart integration works.

## ⚠️ Known Limitations

- No backend; all data is static and cart is browser-only.
- No authentication, checkout, or order processing.
- Product uniqueness relies on name + image; identical items may merge.

## 🗺️ Roadmap Ideas

- Hook up a real backend (products, users, orders).
- Add search, filters, and pagination.
- Improve accessibility (ARIA roles, keyboard navigation, focus states).
- Currency/locale support and proper price formatting.

## 📸 Screenshots

You can add screenshots to `img/screenshots/` and reference them here:

```md
![Home](img/screenshots/home.png)
![Shop](img/screenshots/shop.png)
![Cart](img/screenshots/cart.png)
```

## 📄 License

Specify your license here (e.g., MIT). If you’re unsure, keep it private or choose a suitable open-source license.

## 🙌 Acknowledgements

- Product and banner images stored under `img/`.
- Icons by Font Awesome.
- Layout utilities by Bootstrap.
