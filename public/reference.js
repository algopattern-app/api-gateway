// Renders the endpoint reference from /openapi.yaml with Scalar, which is
// vendored under /vendor/scalar/<version> (see README for the version and how to update).
Scalar.createApiReference('#app', {
  url: '/openapi.yaml',
  // Nothing leaves this site: no Scalar proxy, telemetry or AI agent. A test
  // request goes from the reader's browser straight to the API.
  proxyUrl: '',
  telemetry: false,
  agent: { disabled: true },
  hideClientButton: true,
  hideTestRequestButton: true,
  showDeveloperTools: 'never',
  withDefaultFonts: false,
  forceDarkModeState: 'light',
  hideDarkModeToggle: true,
  hideSearch: true,
  hideModels: true,
  defaultOpenAllTags: true,
  expandAllResponses: true,
  // Code examples in curl only. These are all of Scalar 1.74's targets; recheck the
  // list after updating Scalar, since a new one would appear in the menu.
  hiddenClients: {
    shell: ['wget', 'httpie'],
    ...Object.fromEntries(
      ['c', 'clojure', 'csharp', 'dart', 'fsharp', 'go', 'http', 'java', 'js', 'julia', 'kotlin',
        'node', 'objc', 'ocaml', 'php', 'powershell', 'python', 'r', 'ruby', 'rust', 'swift']
        .map((target) => [target, true]),
    ),
  },
  customCss: `
    /* The sticky sidebar starts below the site header (site.css .site-header), not under it. */
    :root { --scalar-custom-header-height: 60px; }
    .scalar-app, .light-mode {
      --scalar-font: "Nunito", system-ui, -apple-system, sans-serif;
      --scalar-font-code: ui-monospace, SFMono-Regular, Menlo, monospace;
      --scalar-color-1: #1F2A4D;
      --scalar-color-2: #4A5577;
      --scalar-color-3: #6B7594;
      --scalar-color-accent: #394E9A;
      --scalar-background-1: #ffffff;
      --scalar-background-2: #F4F5FB;
      --scalar-background-3: #E9ECF7;
      --scalar-background-accent: #E6E9F7;
      --scalar-border-color: #DCE1EE;
      /* The sidebar shares the header's color (site.css --ap-dusk). */
      --scalar-sidebar-background-1: #394E9A;
      --scalar-sidebar-width: 220px;
      --scalar-sidebar-color-1: #DCE4FF;
      --scalar-sidebar-color-2: #DCE4FF;
      --scalar-sidebar-color-active: #ffffff;
      --scalar-sidebar-item-hover-color: #ffffff;
      --scalar-sidebar-item-hover-background: rgba(255,255,255,.1);
      --scalar-sidebar-item-active-background: rgba(255,255,255,.16);
      --scalar-sidebar-border-color: transparent;
      --scalar-sidebar-indent-border: rgba(255,255,255,.2);
      --scalar-sidebar-indent-border-hover: rgba(255,255,255,.35);
      --scalar-sidebar-indent-border-active: #ffffff;
    }
    /* Scalar's blue method badge (GET) vanishes on the blue sidebar. */
    .sidebar-heading-type { color: #E9D985 !important; }
    /* No option turns these off: Scalar's own promotions ("Generate SDKs & MCP",
       "Generate SDK"), and the introduction's "Client Libraries" card. */
    .explore-scalar-card,
    .generate-sdk-button,
    .scalar-reference-intro-clients { display: none !important; }
    /* Each response (200, 401, …) in its own box. This Scalar version always draws
       responses as an unboxed tree; older ones boxed them, which reads better. */
    .responses-list--tree > .parameter-item {
      border: 1px solid var(--scalar-border-color) !important;
      border-radius: 8px;
      /* Room on the left for the tree's +/− toggles, which sit outside the text. */
      padding: 10px 16px 10px 30px;
      margin-bottom: 10px;
    }
    /* The "Responses" heading's underline would sit right on top of the first box. */
    .responses-title--tree { border-bottom: 0 !important; padding-bottom: 0; margin-bottom: 8px; }
    /* The content-type pill is pinned to the box's top-right corner; keep it inside
       the box, level with the status line. */
    .responses-list--tree > .parameter-item > .absolute.right-0 { right: 12px; top: calc(18px + 0.5lh); }
    /* Scalar's default 90px section padding leaves large gaps. */
    .references-rendered section.section { padding-top: 48px; padding-bottom: 48px; }
  `,
});
