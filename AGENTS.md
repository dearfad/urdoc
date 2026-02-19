# AGENTS.md - Coding Guidelines for URDOC

> AI coding assistant instructions for the URDOC repository.
> This is a Nuxt.js 4.x + Vue 3 + TypeScript medical case study platform.

---

## Build / Dev / Deploy Commands

```bash
# Development
npm run dev              # Start Nuxt dev server
npm run docs:dev         # Start VitePress docs dev server

# Build
npm run build            # Build Nuxt for production
npm run generate         # Generate static site
npm run docs:build       # Build VitePress documentation
npm run edgeone          # Build both Nuxt and docs for EdgeOne

# Preview
npm run preview          # Preview production build
npm run docs:preview     # Preview built docs

# Post-install
npm run postinstall      # Run nuxt prepare (auto-runs after npm install)
```

**Note:** No test framework is configured. To add tests, use Vitest or Playwright (Nuxt's recommended testing solutions).

---

## Lint / Format Commands

```bash
# ESLint (configured via @nuxt/eslint)
npx eslint .             # Lint all files
npx eslint . --fix       # Lint and fix issues

# Prettier
npx prettier --write .   # Format all files
npx prettier --check .   # Check formatting
```

---

## Code Style Guidelines

### General

- **Language:** TypeScript with Vue 3 Composition API
- **Module Type:** ESM (`"type": "module"` in package.json)
- **Semicolons:** No semicolons (Prettier: `semi: false`)
- **Quotes:** Single quotes (Prettier: `singleQuote: true`)
- **Line Width:** 100 characters (Prettier: `printWidth: 100`)

### Vue Components

- Use `<script setup>` syntax exclusively
- Self-closing tags for all elements (enforced by ESLint)
- Component names: PascalCase (e.g., `CaptureButton.vue`)
- Props: Use `defineProps()` with type validation

```vue
<template>
  <v-btn :icon="mdiIcon" @click="handleClick" />
</template>

<script setup>
import { mdiMonitorScreenshot } from '@mdi/js'
const { captureId } = defineProps({
  captureId: { type: String, required: true },
})
</script>
```

### TypeScript

- Use TypeScript for all `.ts` files and Vue `<script>` blocks
- Types defined in `app/types/global.d.ts` (global types)
- Use `ref()` and `computed()` for reactive state
- Prefer `const` over `let`, avoid `var`

```typescript
// Pinia store example
const useStore = defineStore('name', () => {
  const state = ref<Scope>({
    book: '',
    part: '',
  })
  return { state }
})
```

### Naming Conventions

- **Components:** PascalCase (e.g., `CaptureButton.vue`)
- **Composables:** camelCase with `use` prefix (e.g., `useRecordApi.ts`)
- **Stores:** camelCase with `use` prefix + `Store` suffix (e.g., `useStateStore`)
- **Types:** PascalCase (e.g., `MedicalRecord`, `Scope`)
- **Interfaces:** PascalCase (e.g., `Case`, `Story`)
- **Variables/Functions:** camelCase

### Imports

- Auto-imports enabled for Vue, Nuxt, Pinia, and Vuetify
- Explicit imports for:
  - MDI icons: `import { mdiIconName } from '@mdi/js'`
  - Third-party libraries
- Group imports: built-ins → third-party → local

### File Organization

```
app/
  components/          # Vue components (auto-imported)
    Common/           # Shared components
    Case/             # Case-related components
    Story/            # Story-related components
  composables/        # Vue composables (auto-imported)
  stores/             # Pinia stores (auto-imported)
  types/              # TypeScript definitions
  pages/              # File-based routing
  layouts/            # Nuxt layouts
  assets/             # Static assets
docs/                 # VitePress documentation
server/               # Nuxt server (API routes)
```

### Error Handling

- Use `try/catch` for async operations
- Return error objects rather than throwing in composables
- Use Nuxt's `showError()` for fatal errors

### State Management

- Use Pinia for global state
- Enable persistence with `pinia-plugin-persistedstate`
- Version localStorage data to handle schema changes

---

## Technology Stack

- **Framework:** Nuxt 4.x (Vue 3.5.x, Vue Router 5.x)
- **UI Library:** Vuetify 3.x with MDI SVG icons
- **State:** Pinia with persistence
- **Auth:** Clerk
- **Database:** Supabase (PostgreSQL)
- **Docs:** VitePress with Mermaid diagrams
- **Edge:** EdgeOne Functions

---

## i18n Notes

- Default locale: Chinese (`zh`)
- Secondary locale: English (`en`)
- Strategy: `no_prefix` (no URL prefix)
- Locale files: `i18n/locales/{lang}/index.ts`

---

## Important Rules

1. **Always run lint after changes:** `npx eslint . --fix`
2. **Follow self-closing tag rule** for Vue templates
3. **Use Composition API** (`<script setup>`) exclusively
4. **Type all refs** with explicit generic types when needed
5. **No semicolons** - Prettier will handle this automatically
