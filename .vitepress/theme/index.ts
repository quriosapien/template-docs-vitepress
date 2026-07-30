import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import Counter from "./components/Counter.vue";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("Counter", Counter);
  },
} satisfies Theme;
