# Talksyra PDF Studio

A lightweight PDF tools landing website with separate pages for each utility, designed to be deployed on Cloudflare Workers + Assets.

## Included pages

- Home landing page
- Merge PDF
- Split PDF
- Compress PDF
- PDF to Word
- Word to PDF
- PDF to Image
- Image to PDF
- Rotate PDF
- Unlock PDF
- Watermark PDF

## Local preview

```bash
cd /workspaces/talksyrapdf
python3 -m http.server 4173
```

Then open:

http://127.0.0.1:4173/

## Cloudflare Workers deployment

1. Install Wrangler:

```bash
npm install -g wrangler
```

2. Deploy the static assets with the included worker:

```bash
wrangler deploy
```

3. Set the asset binding if needed inside the Cloudflare dashboard or `wrangler.jsonc`.

This starter is ready for you to connect real PDF conversion APIs behind each tool form.