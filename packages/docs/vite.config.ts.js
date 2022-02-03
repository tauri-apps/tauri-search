// vite.config.ts
import path from "path";
import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import Pages from "vite-plugin-pages";
import Layouts from "vite-plugin-vue-layouts";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import Markdown from "vite-plugin-md";
import WindiCSS from "vite-plugin-windicss";
import { VitePWA } from "vite-plugin-pwa";
import VueI18n from "@intlify/vite-plugin-vue-i18n";
import Inspect from "vite-plugin-inspect";
import Prism from "markdown-it-prism";
import LinkAttributes from "markdown-it-link-attributes";
import MdCollapsible from "markdown-it-collapsible";
var markdownWrapperClasses = "prose prose-sm m-auto text-left";
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "~/": `${path.resolve("/Volumes/Coding/playground/t/tauri-search/packages/docs", "src")}/`
    }
  },
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/]
    }),
    Pages({
      extensions: ["vue", "md"]
    }),
    Layouts(),
    AutoImport({
      imports: [
        "vue",
        "vue-router",
        "vue-i18n",
        "@vueuse/head",
        "@vueuse/core",
        "vitest"
      ],
      dts: "src/auto-imports.d.ts"
    }),
    Components({
      extensions: ["vue", "md"],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        IconsResolver({
          componentPrefix: ""
        })
      ],
      dts: "src/components.d.ts"
    }),
    Icons({
      autoInstall: true
    }),
    WindiCSS({
      safelist: markdownWrapperClasses
    }),
    Markdown({
      wrapperClasses: markdownWrapperClasses,
      headEnabled: true,
      markdownItSetup(md) {
        md.use(Prism);
        md.use(LinkAttributes, {
          pattern: /^https?:\/\//,
          attrs: {
            target: "_blank",
            rel: "noopener"
          }
        });
        md.use(MdCollapsible);
      }
    }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt", "safari-pinned-tab.svg"],
      manifest: {
        name: "Vitesse",
        short_name: "Vitesse",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      }
    }),
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      include: [path.resolve("/Volumes/Coding/playground/t/tauri-search/packages/docs", "locales/**")]
    }),
    Inspect({
      enabled: false
    })
  ],
  server: {
    fs: {
      strict: true
    }
  },
  ssgOptions: {
    script: "async",
    formatting: "minify"
  },
  optimizeDeps: {
    include: ["vue", "vue-router", "@vueuse/core", "@vueuse/head"],
    exclude: ["vue-demi"]
  },
  test: {
    include: ["test/**/*.test.ts"],
    environment: "jsdom",
    api: {
      port: 4444,
      host: "0.0.0.0"
    },
    deps: {
      inline: ["@vue", "@vueuse", "vue-demi"]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IFZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XG5pbXBvcnQgUGFnZXMgZnJvbSBcInZpdGUtcGx1Z2luLXBhZ2VzXCI7XG5pbXBvcnQgTGF5b3V0cyBmcm9tIFwidml0ZS1wbHVnaW4tdnVlLWxheW91dHNcIjtcbmltcG9ydCBJY29ucyBmcm9tIFwidW5wbHVnaW4taWNvbnMvdml0ZVwiO1xuaW1wb3J0IEljb25zUmVzb2x2ZXIgZnJvbSBcInVucGx1Z2luLWljb25zL3Jlc29sdmVyXCI7XG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZVwiO1xuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSBcInVucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGVcIjtcbmltcG9ydCBNYXJrZG93biBmcm9tIFwidml0ZS1wbHVnaW4tbWRcIjtcbmltcG9ydCBXaW5kaUNTUyBmcm9tIFwidml0ZS1wbHVnaW4td2luZGljc3NcIjtcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tIFwidml0ZS1wbHVnaW4tcHdhXCI7XG5pbXBvcnQgVnVlSTE4biBmcm9tIFwiQGludGxpZnkvdml0ZS1wbHVnaW4tdnVlLWkxOG5cIjtcbmltcG9ydCBJbnNwZWN0IGZyb20gXCJ2aXRlLXBsdWdpbi1pbnNwZWN0XCI7XG5pbXBvcnQgUHJpc20gZnJvbSBcIm1hcmtkb3duLWl0LXByaXNtXCI7XG5pbXBvcnQgTGlua0F0dHJpYnV0ZXMgZnJvbSBcIm1hcmtkb3duLWl0LWxpbmstYXR0cmlidXRlc1wiO1xuaW1wb3J0IE1kQ29sbGFwc2libGUgZnJvbSBcIm1hcmtkb3duLWl0LWNvbGxhcHNpYmxlXCI7XG5cbmNvbnN0IG1hcmtkb3duV3JhcHBlckNsYXNzZXMgPSBcInByb3NlIHByb3NlLXNtIG0tYXV0byB0ZXh0LWxlZnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIn4vXCI6IGAke3BhdGgucmVzb2x2ZShcIi9Wb2x1bWVzL0NvZGluZy9wbGF5Z3JvdW5kL3QvdGF1cmktc2VhcmNoL3BhY2thZ2VzL2RvY3NcIiwgXCJzcmNcIil9L2AsXG4gICAgfSxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIFZ1ZSh7XG4gICAgICBpbmNsdWRlOiBbL1xcLnZ1ZSQvLCAvXFwubWQkL10sXG4gICAgfSksXG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vaGFubm9lcnUvdml0ZS1wbHVnaW4tcGFnZXNcbiAgICBQYWdlcyh7XG4gICAgICBleHRlbnNpb25zOiBbXCJ2dWVcIiwgXCJtZFwiXSxcbiAgICB9KSxcblxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9Kb2huQ2FtcGlvbkpyL3ZpdGUtcGx1Z2luLXZ1ZS1sYXlvdXRzXG4gICAgTGF5b3V0cygpLFxuXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3VucGx1Z2luLWF1dG8taW1wb3J0XG4gICAgQXV0b0ltcG9ydCh7XG4gICAgICBpbXBvcnRzOiBbXG4gICAgICAgIFwidnVlXCIsXG4gICAgICAgIFwidnVlLXJvdXRlclwiLFxuICAgICAgICBcInZ1ZS1pMThuXCIsXG4gICAgICAgIFwiQHZ1ZXVzZS9oZWFkXCIsXG4gICAgICAgIFwiQHZ1ZXVzZS9jb3JlXCIsXG4gICAgICAgIFwidml0ZXN0XCIsXG4gICAgICBdLFxuICAgICAgZHRzOiBcInNyYy9hdXRvLWltcG9ydHMuZC50c1wiLFxuICAgIH0pLFxuXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzXG4gICAgQ29tcG9uZW50cyh7XG4gICAgICAvLyBhbGxvdyBhdXRvIGxvYWQgbWFya2Rvd24gY29tcG9uZW50cyB1bmRlciBgLi9zcmMvY29tcG9uZW50cy9gXG4gICAgICBleHRlbnNpb25zOiBbXCJ2dWVcIiwgXCJtZFwiXSxcblxuICAgICAgLy8gYWxsb3cgYXV0byBpbXBvcnQgYW5kIHJlZ2lzdGVyIGNvbXBvbmVudHMgdXNlZCBpbiBtYXJrZG93blxuICAgICAgaW5jbHVkZTogWy9cXC52dWUkLywgL1xcLnZ1ZVxcP3Z1ZS8sIC9cXC5tZCQvXSxcblxuICAgICAgLy8gY3VzdG9tIHJlc29sdmVyc1xuICAgICAgcmVzb2x2ZXJzOiBbXG4gICAgICAgIC8vIGF1dG8gaW1wb3J0IGljb25zXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbnRmdS91bnBsdWdpbi1pY29uc1xuICAgICAgICBJY29uc1Jlc29sdmVyKHtcbiAgICAgICAgICBjb21wb25lbnRQcmVmaXg6IFwiXCIsXG4gICAgICAgICAgLy8gZW5hYmxlZENvbGxlY3Rpb25zOiBbJ2NhcmJvbiddXG4gICAgICAgIH0pLFxuICAgICAgXSxcblxuICAgICAgZHRzOiBcInNyYy9jb21wb25lbnRzLmQudHNcIixcbiAgICB9KSxcblxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbnRmdS91bnBsdWdpbi1pY29uc1xuICAgIEljb25zKHtcbiAgICAgIGF1dG9JbnN0YWxsOiB0cnVlLFxuICAgIH0pLFxuXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3ZpdGUtcGx1Z2luLXdpbmRpY3NzXG4gICAgV2luZGlDU1Moe1xuICAgICAgc2FmZWxpc3Q6IG1hcmtkb3duV3JhcHBlckNsYXNzZXMsXG4gICAgfSksXG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdml0ZS1wbHVnaW4tbWRcbiAgICAvLyBEb24ndCBuZWVkIHRoaXM/IFRyeSB2aXRlc3NlLWxpdGU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbnRmdS92aXRlc3NlLWxpdGVcbiAgICBNYXJrZG93bih7XG4gICAgICB3cmFwcGVyQ2xhc3NlczogbWFya2Rvd25XcmFwcGVyQ2xhc3NlcyxcbiAgICAgIGhlYWRFbmFibGVkOiB0cnVlLFxuICAgICAgbWFya2Rvd25JdFNldHVwKG1kKSB7XG4gICAgICAgIC8vIGh0dHBzOi8vcHJpc21qcy5jb20vXG4gICAgICAgIG1kLnVzZShQcmlzbSk7XG4gICAgICAgIG1kLnVzZShMaW5rQXR0cmlidXRlcywge1xuICAgICAgICAgIHBhdHRlcm46IC9eaHR0cHM/OlxcL1xcLy8sXG4gICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgIHRhcmdldDogXCJfYmxhbmtcIixcbiAgICAgICAgICAgIHJlbDogXCJub29wZW5lclwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgICBtZC51c2UoTWRDb2xsYXBzaWJsZSk7XG4gICAgICB9LFxuICAgIH0pLFxuXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3ZpdGUtcGx1Z2luLXB3YVxuICAgIFZpdGVQV0Eoe1xuICAgICAgcmVnaXN0ZXJUeXBlOiBcImF1dG9VcGRhdGVcIixcbiAgICAgIGluY2x1ZGVBc3NldHM6IFtcImZhdmljb24uc3ZnXCIsIFwicm9ib3RzLnR4dFwiLCBcInNhZmFyaS1waW5uZWQtdGFiLnN2Z1wiXSxcbiAgICAgIG1hbmlmZXN0OiB7XG4gICAgICAgIG5hbWU6IFwiVml0ZXNzZVwiLFxuICAgICAgICBzaG9ydF9uYW1lOiBcIlZpdGVzc2VcIixcbiAgICAgICAgdGhlbWVfY29sb3I6IFwiI2ZmZmZmZlwiLFxuICAgICAgICBpY29uczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCIvcHdhLTE5MngxOTIucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIxOTJ4MTkyXCIsXG4gICAgICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIi9wd2EtNTEyeDUxMi5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjUxMng1MTJcIixcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiL3B3YS01MTJ4NTEyLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNTEyeDUxMlwiLFxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIixcbiAgICAgICAgICAgIHB1cnBvc2U6IFwiYW55IG1hc2thYmxlXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSksXG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vaW50bGlmeS9idW5kbGUtdG9vbHMvdHJlZS9tYWluL3BhY2thZ2VzL3ZpdGUtcGx1Z2luLXZ1ZS1pMThuXG4gICAgVnVlSTE4bih7XG4gICAgICBydW50aW1lT25seTogdHJ1ZSxcbiAgICAgIGNvbXBvc2l0aW9uT25seTogdHJ1ZSxcbiAgICAgIGluY2x1ZGU6IFtwYXRoLnJlc29sdmUoXCIvVm9sdW1lcy9Db2RpbmcvcGxheWdyb3VuZC90L3RhdXJpLXNlYXJjaC9wYWNrYWdlcy9kb2NzXCIsIFwibG9jYWxlcy8qKlwiKV0sXG4gICAgfSksXG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdml0ZS1wbHVnaW4taW5zcGVjdFxuICAgIEluc3BlY3Qoe1xuICAgICAgLy8gY2hhbmdlIHRoaXMgdG8gZW5hYmxlIGluc3BlY3QgZm9yIGRlYnVnZ2luZ1xuICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgfSksXG4gIF0sXG5cbiAgc2VydmVyOiB7XG4gICAgZnM6IHtcbiAgICAgIHN0cmljdDogdHJ1ZSxcbiAgICB9LFxuICB9LFxuXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbnRmdS92aXRlLXNzZ1xuICBzc2dPcHRpb25zOiB7XG4gICAgc2NyaXB0OiBcImFzeW5jXCIsXG4gICAgZm9ybWF0dGluZzogXCJtaW5pZnlcIixcbiAgfSxcblxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBpbmNsdWRlOiBbXCJ2dWVcIiwgXCJ2dWUtcm91dGVyXCIsIFwiQHZ1ZXVzZS9jb3JlXCIsIFwiQHZ1ZXVzZS9oZWFkXCJdLFxuICAgIGV4Y2x1ZGU6IFtcInZ1ZS1kZW1pXCJdLFxuICB9LFxuXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS92aXRlc3QtZGV2L3ZpdGVzdFxuICB0ZXN0OiB7XG4gICAgaW5jbHVkZTogW1widGVzdC8qKi8qLnRlc3QudHNcIl0sXG4gICAgZW52aXJvbm1lbnQ6IFwianNkb21cIixcbiAgICBhcGk6IHtcbiAgICAgIHBvcnQ6IDQ0NDQsXG4gICAgICBob3N0OiBcIjAuMC4wLjBcIixcblxuICAgIH0sXG4gICAgZGVwczoge1xuICAgICAgaW5saW5lOiBbXCJAdnVlXCIsIFwiQHZ1ZXVzZVwiLCBcInZ1ZS1kZW1pXCJdLFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBTSx5QkFBeUI7QUFFL0IsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsTUFBTSxHQUFHLEtBQUssUUFBUSwyREFBMkQ7QUFBQTtBQUFBO0FBQUEsRUFHckYsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLE1BQ0YsU0FBUyxDQUFDLFVBQVU7QUFBQTtBQUFBLElBSXRCLE1BQU07QUFBQSxNQUNKLFlBQVksQ0FBQyxPQUFPO0FBQUE7QUFBQSxJQUl0QjtBQUFBLElBR0EsV0FBVztBQUFBLE1BQ1QsU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBO0FBQUEsTUFFRixLQUFLO0FBQUE7QUFBQSxJQUlQLFdBQVc7QUFBQSxNQUVULFlBQVksQ0FBQyxPQUFPO0FBQUEsTUFHcEIsU0FBUyxDQUFDLFVBQVUsY0FBYztBQUFBLE1BR2xDLFdBQVc7QUFBQSxRQUdULGNBQWM7QUFBQSxVQUNaLGlCQUFpQjtBQUFBO0FBQUE7QUFBQSxNQUtyQixLQUFLO0FBQUE7QUFBQSxJQUlQLE1BQU07QUFBQSxNQUNKLGFBQWE7QUFBQTtBQUFBLElBSWYsU0FBUztBQUFBLE1BQ1AsVUFBVTtBQUFBO0FBQUEsSUFLWixTQUFTO0FBQUEsTUFDUCxnQkFBZ0I7QUFBQSxNQUNoQixhQUFhO0FBQUEsTUFDYixnQkFBZ0IsSUFBSTtBQUVsQixXQUFHLElBQUk7QUFDUCxXQUFHLElBQUksZ0JBQWdCO0FBQUEsVUFDckIsU0FBUztBQUFBLFVBQ1QsT0FBTztBQUFBLFlBQ0wsUUFBUTtBQUFBLFlBQ1IsS0FBSztBQUFBO0FBQUE7QUFHVCxXQUFHLElBQUk7QUFBQTtBQUFBO0FBQUEsSUFLWCxRQUFRO0FBQUEsTUFDTixjQUFjO0FBQUEsTUFDZCxlQUFlLENBQUMsZUFBZSxjQUFjO0FBQUEsTUFDN0MsVUFBVTtBQUFBLFFBQ1IsTUFBTTtBQUFBLFFBQ04sWUFBWTtBQUFBLFFBQ1osYUFBYTtBQUFBLFFBQ2IsT0FBTztBQUFBLFVBQ0w7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQTtBQUFBLFVBRVI7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQTtBQUFBLFVBRVI7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxZQUNOLFNBQVM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBT2pCLFFBQVE7QUFBQSxNQUNOLGFBQWE7QUFBQSxNQUNiLGlCQUFpQjtBQUFBLE1BQ2pCLFNBQVMsQ0FBQyxLQUFLLFFBQVEsMkRBQTJEO0FBQUE7QUFBQSxJQUlwRixRQUFRO0FBQUEsTUFFTixTQUFTO0FBQUE7QUFBQTtBQUFBLEVBSWIsUUFBUTtBQUFBLElBQ04sSUFBSTtBQUFBLE1BQ0YsUUFBUTtBQUFBO0FBQUE7QUFBQSxFQUtaLFlBQVk7QUFBQSxJQUNWLFFBQVE7QUFBQSxJQUNSLFlBQVk7QUFBQTtBQUFBLEVBR2QsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLE9BQU8sY0FBYyxnQkFBZ0I7QUFBQSxJQUMvQyxTQUFTLENBQUM7QUFBQTtBQUFBLEVBSVosTUFBTTtBQUFBLElBQ0osU0FBUyxDQUFDO0FBQUEsSUFDVixhQUFhO0FBQUEsSUFDYixLQUFLO0FBQUEsTUFDSCxNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUE7QUFBQSxJQUdSLE1BQU07QUFBQSxNQUNKLFFBQVEsQ0FBQyxRQUFRLFdBQVc7QUFBQTtBQUFBO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==
