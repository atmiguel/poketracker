# Poketracker

## Run

To execute `src/scripts/main.ts`:

```bash
npm run main
```

## Automation

A GitHub Actions workflow ([`.github/workflows/sync-tracker.yml`](.github/workflows/sync-tracker.yml)) runs `npm run main` once per day at 2pm UTC (7am PT) and can be triggered manually from the Actions tab.

### Setup

1. Share your Google Sheet with the service account email (`client_email` in your JSON key) as Editor.
2. In GitHub repo **Settings → Secrets and variables → Actions**, add a secret:
   - Name: `GOOGLE_SERVICE_ACCOUNT_JSON`
   - Value: full contents of `credentials/service-account.json`

### Manual run

Open **Actions → Sync tracker → Run workflow**.

When new sets or cards are downloaded, the workflow commits updated files under `resources/card-html/` back to the repo.

Note: each run re-syncs all sets to the spreadsheet even when no new pack exists. This is harmless but uses Google Sheets API quota.

## Layout

With the exception of scripts, all files must be one of the following types:

- interface
- implementation
- types
- constants
- utils
- instances

### Interface

Interfaces reside in `interfaces/` directories, and contain exactly one TS interface named with an `I` prefix (e.g. `IFileReader`). The files are named after the interface (e.g. `file-reader.ts`).

### Implmentation

Implementations reside in `impl/` directories, and contain exactly one TS class that implements one to many interfaces. These classes have no prefix. The files are named after the class (e.g. `file-manager.ts` for `FileManager`).

### Types

Types contain any utility types or objects specifically intended to assist with type checking (e.g. Path, Zod constants). The file should be named `types.ts`. Types can optionally exist within a namespace.

### Constants

Constants contain any constant values needed. The files should be named `constants.ts`. The constants should be namespaced within a `Constants` suffixed namespace matching the scope (e.g. `CoreConstants`).

### Utils

Utils should contain a namespace with functions. The namespace should be suffixed with `Utils` and the file should be named `utils.ts`.

### Instances

Contains instances of implementations. Must have namespace suffixed with `Instances` and be in a file named `instances.ts`.

## Conventions

### Function Definition

- No default parameters bro
- enums values are PascalCase
