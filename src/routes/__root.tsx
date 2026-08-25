import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { LaunchScreen } from "../components/launch/LaunchScreen";
import { DesignTokens } from "../components/site/DesignTokens";
import { getLaunchState } from "../lib/cms/content.functions";
import { PREVIEW_PARAM, PREVIEW_STORAGE_KEY, PREVIEW_TOKEN, isPreLaunch } from "../lib/launch";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">404</p>
        <h1 className="display mt-4 text-5xl">Off the trail.</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          The page you're looking for has wandered elsewhere.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-90"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="display text-4xl">Something interrupted the journey.</h1>
        <p className="mt-3 text-sm text-muted-foreground">Try again, or head back to base camp.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "The Wandering Nomads — Small-group trips across India & beyond" },
      {
        name: "description",
        content:
          "Community expeditions with confirmed dates. India, the Himalayas, and custom international journeys — small groups, hosted departures, limited seats.",
      },
      { name: "author", content: "The Wandering Nomads" },
      { name: "theme-color", content: "#f8f6f0" },
      { property: "og:site_name", content: "The Wandering Nomads" },
      {
        property: "og:title",
        content: "The Wandering Nomads — Small-group trips across India & beyond",
      },
      {
        property: "og:description",
        content:
          "Community expeditions with confirmed dates. India, the Himalayas, and custom international journeys.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "The Wandering Nomads — Small-group trips across India & beyond",
      },
      {
        name: "twitter:description",
        content:
          "Community expeditions with confirmed dates. India, the Himalayas, and custom international journeys.",
      },
      {
        property: "og:image",
        content:
          "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/3fa00827-bd68-4f6b-9816-22dc609dc567",
      },
      {
        name: "twitter:image",
        content:
          "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/3fa00827-bd68-4f6b-9816-22dc609dc567",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('wn-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Evaluated identically on the server and the client, so pre-launch visitors
  // never receive the real site's markup — no flash, no overlay.
  const [bypassed, setBypassed] = useState(false);
  const [launchOverride, setLaunchOverride] = useState<"pre_launch" | "live" | null>(null);
  const [launchAt, setLaunchAt] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get(PREVIEW_PARAM) === PREVIEW_TOKEN) {
        window.sessionStorage.setItem(PREVIEW_STORAGE_KEY, PREVIEW_TOKEN);
      }
      if (window.sessionStorage.getItem(PREVIEW_STORAGE_KEY) === PREVIEW_TOKEN) {
        setBypassed(true);
      }
    } catch {
      /* storage unavailable — stay gated */
    }
  }, []);

  // The owner can flip the site live from the dashboard without a code change.
  useEffect(() => {
    let active = true;
    getLaunchState()
      .then((state) => {
        if (!active) return;
        if (state.launch_status) setLaunchOverride(state.launch_status);
        if (state.launch_at) setLaunchAt(state.launch_at);
      })
      .catch(() => {
        /* keep the scheduled behaviour */
      });
    return () => {
      active = false;
    };
  }, []);

  // The dashboard is a private surface and is never covered by the countdown.
  const isStudio = pathname.startsWith("/admin");
  // "live" from the Studio opens the site immediately. "pre_launch" (or no CMS
  // row) respects the scheduled launch time — so a stale 'pre_launch' flag can
  // never keep the site closed after the launch moment has actually passed.
  const scheduledAt = launchAt ? Date.parse(launchAt) : Number.NaN;
  const beforeLaunch = Number.isFinite(scheduledAt) ? Date.now() < scheduledAt : isPreLaunch();
  const gated = !isStudio && !bypassed && launchOverride !== "live" && beforeLaunch;

  if (gated) {
    return <LaunchScreen onLaunch={() => setBypassed(true)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      {isStudio ? null : <DesignTokens />}
      <Outlet />
    </QueryClientProvider>
  );
}
