# BackStone Capital Connect — static website

A four-page static site for **BackStone Capital Connect**, a service of **AFE International LLC**.
Built for **A2P 10DLC** SMS campaign registration: the required consent, opt-out, help, frequency,
rate and mobile-information-sharing disclosures are present and publicly reachable.

## Contents

| File | Purpose |
| --- | --- |
| `index.html` | Landing page — hero, features grid, how-it-works steps, CTA with apply link, phone numbers and the SMS consent block |
| `privacy.html` | Full privacy policy with a dedicated **SMS / text messaging policy** section (§4) |
| `terms.html` | Terms of service with an **SMS terms and consent** section (§5) |
| `about.html` | Company description and contact information |
| `assets/css/styles.css` | Single shared stylesheet (navy `#0B1D3A`, gold `#C8993E`) |
| `assets/img/favicon.svg` | Site icon |
| `_headers`, `_redirects` | Netlify / Cloudflare Pages headers and pretty-URL redirects |
| `robots.txt`, `.nojekyll` | Crawler policy; disables Jekyll processing on GitHub Pages |

No build step, no JavaScript, no external requests. Every link is document-relative, so the site works
at a domain root **or** under a subpath (e.g. a GitHub Pages project URL).

## Local preview

```bash
cd site && python3 -m http.server 8000
# open http://localhost:8000
```

## Deploying

### Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Pick this repository and the branch you want to publish.
3. Build settings:
   - **Framework preset:** `None`
   - **Build command:** *(leave empty)*
   - **Build output directory:** `site`
4. **Save and Deploy.** You get a live `*.pages.dev` URL in about a minute — that is the URL to submit
   for A2P registration. Add a custom domain later under **Custom domains** if you want.

`_headers` and `_redirects` in `site/` are picked up automatically.

### Netlify

`netlify.toml` at the repository root already sets `publish = "site"` with no build command.

- **From the dashboard:** *Add new site* → *Import an existing project* → pick this repo → deploy.
  Settings are read from `netlify.toml`.
- **From the CLI:** `npx netlify-cli deploy --prod --dir=site`

### GitHub Pages

`.github/workflows/deploy-pages.yml` publishes `site/` on every push to the default branch, and can
also be run manually from the **Actions** tab.

Pages has to be turned on once by a repository admin — it cannot be enabled through the API from a
sandboxed session:

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. **Actions → Deploy site to GitHub Pages → Run workflow.**

The live URL is then `https://<owner>.github.io/<repo>/`.

## Before you submit for A2P 10DLC

- [ ] Site is live over **HTTPS** at a publicly reachable URL (no password, no `noindex` gate).
- [ ] Privacy Policy and Terms of Service are linked from the footer of every page — they are.
- [ ] The consent language on the landing page matches the opt-in language you describe in the campaign
      registration form, word for word.
- [ ] If you register a hosted opt-in web form, the form at
      `apply.backstonecapital.net/apply` shows the same consent language and an **unchecked** consent
      checkbox, and you can produce a screenshot of it for the carrier.

## Things to review before going live

These are placeholders or judgment calls made during the build — confirm them:

1. **Effective dates.** `privacy.html` and `terms.html` both say *Effective / Last updated:
   January 1, 2026*. Change to the real publication date.
2. **No email address is published.** Only the two phone numbers and the mailing address appear, since
   no support email was supplied. If you have one (e.g. a `support@` address), add it to the contact
   blocks in `privacy.html` §13, `terms.html` §16 and `about.html` — carriers like seeing an email
   contact for HELP.
3. **EIN is not displayed.** `86-3752256` is used in the A2P registration form itself; it is
   deliberately not published on the site. Add it to `about.html` only if you want it public.
4. **Carrier list.** `privacy.html` §4.7 lists the standard major U.S. carriers. Trim it if your
   provider supports fewer.
5. **Governing law** in `terms.html` §14 is set to New York / Kings County, matching the Brooklyn
   address. Have counsel confirm.
6. **Marketing claims.** "Approvals in as little as 24 hours" and the $5K–$5M range are stated as
   typical, not guaranteed, and §7 of the terms disclaims guarantees. Keep the claims consistent with
   what underwriting actually delivers.
