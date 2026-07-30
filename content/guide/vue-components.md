# Using Vue Components

Every Markdown page in VitePress is compiled as a Vue single-file component, so you can use Vue features directly in `.md` files. There are three common ways to do this.

## Global components

Components registered in the custom theme (`.vitepress/theme/index.ts`) are available in every page without an import. This site registers a `Counter` component as an example:

<Counter />

```md
<Counter />
```

To add your own, drop a `.vue` file in `.vitepress/theme/components/` and register it in `.vitepress/theme/index.ts`:

```ts
import Counter from "./components/Counter.vue";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("Counter", Counter);
  },
};
```

## Page-local components

Sometimes you want the full power of a `.vue` file (markup, logic, and scoped styles) but only on one page — without exposing it globally. Import it directly by relative path inside the page's `<script setup>`; nothing in `.vitepress/theme/index.ts` needs to change:

<script setup>
import Badge from "../../.vitepress/theme/components/Badge.vue";
import { ref } from "vue";

const clicks = ref(0);
</script>

<Badge label="Page-only" />

```md
<script setup>
import Badge from "../../.vitepress/theme/components/Badge.vue";
</script>

<Badge label="Page-only" />
```

The import path is relative to the `.md` file itself, so it will vary depending on how deep the page is nested. A Markdown file can only have one `<script setup>` block, so if a page also needs inline logic like the example below, combine both into that single block.

## Inline components

You can also define a component directly inside a page using `<script setup>` — no theme changes required:

<button @click="clicks++">Clicked inline {{ clicks }} times</button>

```md
<script setup>
import { ref } from "vue";

const clicks = ref(0);
</script>

<button @click="clicks++">Clicked inline {{ clicks }} times</button>
```

Use global components for anything reused across pages, page-local imports for a full component file needed on just one page, and inline `<script setup>` for one-off, page-specific interactivity.
