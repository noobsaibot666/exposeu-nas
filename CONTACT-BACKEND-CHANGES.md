# Contact Backend Changes

## Files changed
- .env.example (added contact backend + SMTP placeholders)
- package.json (added backend dependencies and `server` script)
- server/index.js (new minimal contact API)
- src/pages/Contact.tsx (POSTs to backend and handles errors)
- src/pages/Contact.css (error + disabled styles)

## Commands
- Install deps: `npm install`
- Run frontend: `npm run dev`
- Run backend: `npm run server`

## Env values to fill
- CONTACT_API_PORT (e.g. 8787)
- SMTP_HOST (e.g. smtp.gmail.com)
- SMTP_PORT (465 or 587)
- SMTP_SECURE (true for 465, false for 587)
- SMTP_USER (your SMTP username/email)
- SMTP_PASS (app password)
- CONTACT_TO (recipient email)
- CONTACT_FROM (sender email; often same as SMTP_USER)
- VITE_CONTACT_API_BASE (e.g. http://localhost:8787)
