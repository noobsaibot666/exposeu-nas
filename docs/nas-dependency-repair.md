# NAS dependency repair notes

Date: 2026-05-06

## Scope

This project is on the SMB-mounted NAS volume `/Volumes/Gaia`. Running systems mounted behind Traefik must not be interrupted, so this repair avoided:

- `docker-compose.traefik.yml`
- `.env`, `.env.local`, and other secret files
- Traefik, certificate, upload, and deployment state
- deleting or replacing the existing `node_modules` tree

## Issue

The local dependency tree contains Linux optional native packages:

- `node_modules/@rollup/rollup-linux-x64-gnu`
- `node_modules/@rollup/rollup-linux-x64-musl`
- `node_modules/@esbuild/linux-x64`

The current machine is `darwin arm64`, so Vite/Rollup also needs:

- `@rollup/rollup-darwin-arm64@4.53.3`
- `@esbuild/darwin-arm64@0.25.12`

`npm install` could not repair this in place because several package subdirectories inside `node_modules` are not writable over SMB even though the project root is writable.

## Repair Applied

The missing Darwin native packages were unpacked into an ignored project-local fallback path:

```text
node_modules/.darwin-native/node_modules/
```

The npm scripts now call package bin files directly instead of relying on copied `.bin` shims, and Vite commands use:

```sh
NODE_PATH=node_modules/.darwin-native/node_modules
```

Vite also runs with `--configLoader runner` and uses the OS temp directory for its cache so it does not try to write temporary files inside the non-writable `node_modules/.vite-temp` directory or perform optimizer renames on the SMB mount.

This leaves the existing dependency tree and NAS service files intact.

## If Dependencies Are Reinstalled Later

If this project gets a clean local install on macOS, the fallback directory can be removed after `npm run build` succeeds without it. Do not remove or replace NAS service files as part of dependency cleanup.
