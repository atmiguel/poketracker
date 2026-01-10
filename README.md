# Poketracker

## Run

To execute `src/scripts/main.ts`:

```bash
npm run main
```

## Layout

With the exception of scripts, all files must be one of the following types:

- interface
- implementation
- types
- constants
- utils

### Interface

Interfaces reside in `interfaces/` directories, and contain exactly one TS interface named with an `I` prefix (e.g. `IFileReader`). The files are named after the interface (e.g. `file-reader.ts`).

### Implmentation

Implementations reside in `impl/` directories, and contain exactly one TS class that implements one to many interfaces. These classes have no prefix. The files are named after the class (e.g. `file-manager.ts` for `FileManager`).

### Types

Types contain any utility types or objects specifically intended to assist with type checking (e.g. Path, Zod constants). The file should be named `types.ts`. Types can optionally exist within a namespace.

### Constants

Constants contain any constant values needed. The files should be named `constants.ts`. The constants should be namespaced within a `C` prefixed namespace matching the scope (e.g. `CCore`).

### Utils

Utils should contain a namespace with functions. The namespace should be prefixed with `U` and the file should be named `utils.ts`.

## Conventions

### Function Definition

- No default parameters bro
