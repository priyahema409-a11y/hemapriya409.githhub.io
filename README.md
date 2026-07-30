# Marquee — Movie Reviews & Ratings

A small static website for browsing movies and leaving reviews and star ratings.
No backend required — reviews you submit are saved right in your browser (`localStorage`).

## Files

- `index.html` — page structure
- `styles.css` — all styling (dark "movie marquee" theme, ticket-stub cards)
- `script.js` — movie data, rendering, search/filter, and the review form

## Try it locally

Just open `index.html` in your browser — no build step, no server needed.

## Put it on GitHub

```bash
cd movie-review-site
git init
git add .
git commit -m "Initial commit: Marquee movie review site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git push -u origin main
```

Replace `YOUR-USERNAME` and `YOUR-REPO-NAME` with your actual GitHub username and a repo
you've created on github.com (click the **+** in the top right → **New repository**).

## Host it for free with GitHub Pages

1. On GitHub, go to your repo's **Settings → Pages**.
2. Under "Build and deployment", set **Source** to `Deploy from a branch`.
3. Choose branch `main` and folder `/ (root)`, then **Save**.
4. After a minute, your site will be live at:
   `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

## Customizing

- **Add or edit movies:** open `script.js` and edit the `MOVIES` array at the top —
  each entry has a title, year, genre, director, synopsis, poster gradient, and
  a starting list of seed reviews.
- **Colors/fonts:** all design tokens (colors, fonts) live at the top of `styles.css`
  under `:root`.
- **Genres:** genre filter chips are generated automatically from whatever genres
  appear in your `MOVIES` list — no extra step needed.

## Good next steps

- Add real poster images instead of the gradient placeholders.
- Move reviews to a real backend (e.g. a small database + API) so reviews are shared
  across visitors instead of staying local to each browser.
- Add user accounts so people can edit or delete their own reviews.
