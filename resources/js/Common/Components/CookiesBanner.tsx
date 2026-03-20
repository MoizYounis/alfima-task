import { usePage } from "@inertiajs/react";
import { useMemo, useEffect, useState, useCallback } from "react";

/* eslint-disable react-hooks/set-state-in-effect */

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { cookieBannerSettingsInitialValues } from "@/Forms/Settings";

type Placement = "head" | "body_start" | "body_end";

type TrackingCode = {
  id: number;
  name: string;
  scriptCode: string;
  isExternal: boolean;
  placement: Placement;
  isActive: boolean;
};

const CONSENT_KEY = "alfima_cookie_consent_v1";
const CONSENT_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.replace("#", "");
  const sixCharHex =
    normalized.length === 3
      ? normalized
          .split("")
          .map((ch) => ch + ch)
          .join("")
      : normalized;

  if (!/^[0-9A-Fa-f]{6}$/.test(sixCharHex)) {
    return null;
  }

  const int = Number.parseInt(sixCharHex, 16);

  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
}

export default function CookiesBanner() {
  const [choice, setChoice] = useState<"accepted" | "rejected" | null>(null);
  const [visible, setVisible] = useState(false);

  const { props, url } = usePage<{
    settings?: { cookieBannerColor?: string };
    customerTrackingCodes?: TrackingCode[];
  }>();

  const serverColor = props.settings?.cookieBannerColor;
  const selectedColor =
    serverColor ?? cookieBannerSettingsInitialValues.cookieBannerColor;

  const styles = useMemo(() => {
    const rgb = hexToRgb(selectedColor);

    if (!rgb) {
      return {
        cardBackground: "rgba(47, 75, 254, 0.12)",
        textColor: cookieBannerSettingsInitialValues.cookieBannerColor,
      };
    }

    return {
      cardBackground: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`,
      textColor: selectedColor,
    };
  }, [selectedColor]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const raw = window.localStorage.getItem(CONSENT_KEY);

      if (!raw) {
        setChoice(null);
        setVisible(true);

        return;
      }

      const parsed = JSON.parse(raw) as {
        choice?: "accepted" | "rejected";
        expiresAt?: number;
      };

      if (!parsed.choice || typeof parsed.expiresAt !== "number") {
        setChoice(null);
        setVisible(true);

        return;
      }

      if (Date.now() > parsed.expiresAt) {
        window.localStorage.removeItem(CONSENT_KEY);
        setChoice(null);
        setVisible(true);

        return;
      }

      setChoice(parsed.choice);
      setVisible(false);
    } catch {
      setChoice(null);
      setVisible(true);
    }
  }, []);

  const removeInjectedTrackingCodes = useCallback(() => {
    if (typeof document === "undefined") {
      return;
    }

    // Remove all previously injected tracking scripts.
    // This matters when navigating away from customer-facing pages (e.g. to
    // /dashboard) after consent was accepted.
    const previous = document.querySelectorAll(
      'script[data-alfima-tracking-code="true"]',
    );
    previous.forEach((el) => el.remove());
  }, []);

  useEffect(() => {
    return () => {
      removeInjectedTrackingCodes();
    };
  }, [removeInjectedTrackingCodes]);

  function setConsentAndHide(next: "accepted" | "rejected") {
    setChoice(next);
    setVisible(false);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        CONSENT_KEY,
        JSON.stringify({
          choice: next,
          expiresAt: Date.now() + CONSENT_TTL_MS,
        }),
      );
    }
  }

  const injectTrackingCodes = useCallback(async (codes: TrackingCode[]) => {
    if (typeof document === "undefined") {
      return;
    }

    // Clear existing tracking scripts first, regardless of whether we end up
    // injecting any new active scripts. This prevents scripts from lingering
    // when the backend provides an empty set (e.g. dashboard routes).
    removeInjectedTrackingCodes();

    const activeCodes = codes
      .filter((c) => c.isActive)
      .filter((c) => Boolean(c.scriptCode?.trim()));

    if (activeCodes.length === 0) {
      return;
    }

    const injectIntoPlacement = (scriptEl: HTMLScriptElement, placement: Placement) => {
      if (placement === "head") {
        document.head.appendChild(scriptEl);

        return;
      }

      if (placement === "body_start") {
        if (document.body.firstChild) {
          document.body.insertBefore(scriptEl, document.body.firstChild);
        } else {
          document.body.appendChild(scriptEl);
        }

        return;
      }

      document.body.appendChild(scriptEl);
    };

    const loadScriptAndWait = (scriptEl: HTMLScriptElement) =>
      new Promise<void>((resolve) => {
        scriptEl.addEventListener("load", () => resolve(), { once: true });
        scriptEl.addEventListener("error", () => resolve(), { once: true });
      });

    const externals = activeCodes.filter((c) => c.isExternal);
    const inlines = activeCodes.filter((c) => !c.isExternal);

    // External scripts must be loaded BEFORE inline scripts.
    for (const code of externals) {
      const script = document.createElement("script");
      script.setAttribute("data-alfima-tracking-code", "true");
      script.setAttribute("data-alfima-tracking-code-id", String(code.id));
      script.setAttribute("data-alfima-tracking-code-external", "true");
      script.src = code.scriptCode;

      injectIntoPlacement(script, code.placement);
      await loadScriptAndWait(script);
    }

    for (const code of inlines) {
      const script = document.createElement("script");
      script.setAttribute("data-alfima-tracking-code", "true");
      script.setAttribute("data-alfima-tracking-code-id", String(code.id));
      script.innerHTML = code.scriptCode;

      injectIntoPlacement(script, code.placement);
    }
  }, [removeInjectedTrackingCodes]);

  useEffect(() => {
    if (choice !== "accepted") {
      return;
    }

    // Safety guard: tracking scripts should never be injected into dashboard
    // routes (even if this component is mounted there in the future).
    const dashboardSafeUrl = url ? String(url) : "";
    const withoutQuery = dashboardSafeUrl.split("?")[0];
    const withoutOrigin = withoutQuery.replace(/^https?:\/\/[^/]+/i, "");
    const normalizedPath = withoutOrigin.startsWith("/")
      ? withoutOrigin.slice(1)
      : withoutOrigin;

    if (normalizedPath.startsWith("dashboard")) {
      removeInjectedTrackingCodes();

      return;
    }

    const codes = props.customerTrackingCodes ?? [];

    if (codes.length === 0) {
      return;
    }

    injectTrackingCodes(codes);

  }, [
    choice,
    url,
    props.customerTrackingCodes,
    injectTrackingCodes,
    removeInjectedTrackingCodes,
  ]);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-sm">
      <Card
        className="rounded-xl border-border/70 shadow-lg p-4"
        style={{ backgroundColor: styles.cardBackground }}
      >
        <p className="text-sm font-semibold" style={{ color: styles.textColor }}>
          Cookies
        </p>
        <p className="mt-2 text-xs leading-5" style={{ color: styles.textColor }}>
          We use cookies to improve your experience.
        </p>
        <div className="mt-4 flex items-center gap-2">
          <Button
            size="sm"
            style={{
              backgroundColor: styles.textColor,
              color: "#FFFFFF",
            }}
            onClick={() => setConsentAndHide("accepted")}
          >
            Accept all
          </Button>
          <Button
            size="sm"
            variant="outline"
            style={{
              color: styles.textColor,
              borderColor: styles.textColor,
            }}
            onClick={() => setConsentAndHide("rejected")}
          >
            Reject all
          </Button>
        </div>
      </Card>
    </div>
  );
}

