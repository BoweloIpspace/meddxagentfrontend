# MEDDxAgent Frontend

Frontend workspace for MEDDxAgent, built with React, TypeScript, Vite, and Tailwind CSS.

## Current behavior

- Patient cases are created from user-entered information only.
- Cases are persisted in browser `localStorage` until backend persistence is connected.
- The frontend does not seed patient records, diagnoses, evidence, confidence scores, benchmark results, or dialogue.
- Differential diagnosis, rationale, dialogue history, and retrieval content remain empty until real engine output is supplied.
- Prototype authentication has been removed until a real auth boundary exists.

## Main routes

- `/` — product/research landing page
- `/app` — workspace home
- `/cases` — locally stored cases
- `/cases/new` — create a case
- `/case/:id` — case detail and diagnostic output boundary
- `/case/:id/edit` — edit case input
- `/settings` — local workspace/data controls

## Development

```bash
npm install
npm run dev
```

Validation:

```bash
npm run build
npm run lint
```

## Integration boundary

The frontend is intentionally separate from the MEDDxAgent diagnostic engine. The next functional integration should connect a server/API session layer to the backend DDxDriver contract rather than fabricating browser-side diagnostic behavior.
