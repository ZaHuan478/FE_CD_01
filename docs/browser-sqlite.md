# Browser SQLite architecture

The HRM knowledge demo is a static React/Vite application. It has no API server and no cloud database.

## Runtime

- `public/data/release-manifest.json` points to the immutable released SQLite file.
- `src/database/db.worker.ts` loads `sql.js` in a dedicated Web Worker.
- The released database is copied to IndexedDB on first use.
- All SQL work happens in the Worker; UI modules are loaded only after SQLite is ready.
- Modified databases are exported from `sql.js` and stored as an IndexedDB snapshot.
- Web Locks serialize writes and BroadcastChannel notifies other tabs.

The released file and the locally modified file are distinct. A deployment never silently replaces a dirty local snapshot. A clean local snapshot is upgraded when the release ID changes.

## Data layout

Normalized tables are the long-term model: `hr_module`, `process`, `process_version`, `process_step`, `process_transition`, `process_relation`, `role`, `artifact`, `knowledge_article`, `rag_chunk`, and document/link tables.

Release schema v2 also contains the business snapshot that existed in the retired Backend SQLite database: modules, processes, versions, steps, transitions, process relations, document metadata, and RAG chunks. Backend users, password hashes, and audit logs are intentionally excluded because a browser-only application cannot keep them secret or enforce server-side authorization.

`app_dataset` is a compatibility bridge for the existing UI. It contains the old view-model shapes as JSON inside SQLite, allowing current components and visual layout to remain unchanged while the normalized repository is introduced gradually.

## Validation

Run:

```sh
npm run db:validate
npm run lint
npm run build
```

`db:validate` verifies the SHA-256 checksum, SQLite integrity, foreign keys, manifest/schema versions, required compatibility datasets, and non-empty normalized tables.

## Publishing updated shared data

1. Edit the database locally through the future content editor or import a reviewed SQLite backup.
2. Export the `.sqlite` file.
3. Validate it and assign a new release ID.
4. Name it with a content hash and update `release-manifest.json`.
5. Deploy the FrontEnd to Vercel.

Local browser changes remain local until this release process is performed.

## Limits

- Clearing site data deletes the local snapshot.
- Incognito/private sessions are not durable.
- Different browsers, profiles, devices, origins, and Vercel preview URLs have separate databases.
- A cross-origin iframe may receive partitioned storage.
- UI-only role checks cannot protect data because the released SQLite file is downloadable.
- Large binary attachments should not be stored in this database; keep their metadata and checksum in SQLite and publish the files as static assets.
