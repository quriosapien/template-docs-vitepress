import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Project Docs",
  description: "Documentation site for the project",
  srcDir: "content",

  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide/" },
    ],

    sidebar: {
      "/guide/": [
        {
          text: "Guide",
          items: [
            { text: "Introduction", link: "/guide/" },
            { text: "Getting Started", link: "/guide/getting-started" },
            { text: "Using Vue Components", link: "/guide/vue-components" },
          ],
        },
      ],
    },

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/quriosapien/template-docs-vitepress",
      },
    ],

    search: {
      provider: "local",
    },
  },
});
