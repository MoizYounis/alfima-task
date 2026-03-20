import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  cookieBannerSettingsInitialValues,
  mapCookieBannerSettingsFormValues,
} from "@/Forms/Settings";
import type { CookieBannerSettingsFormValues } from "@/Forms/Settings";
import { Layout } from "@/Layouts/Layout";
import { useCookieBannerSettings } from "@/Pages/Dashboard/Settings/Hooks/useCookieBannerSettings";

export default function SettingsPage() {
  const { props } = usePage<{
    savedValues: CookieBannerSettingsFormValues;
    flash?: { success?: string; error?: string };
    errors?: Record<string, string>;
  }>();

  const { savedValues, saveSettings, isSaving } =
    useCookieBannerSettings(props.savedValues);

  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [cookieBannerColor, setCookieBannerColor] = useState(
    mapCookieBannerSettingsFormValues(savedValues).cookieBannerColor,
  );

  useEffect(() => {
    setCookieBannerColor(
      mapCookieBannerSettingsFormValues(savedValues).cookieBannerColor,
    );
  }, [savedValues]);

  const normalizedColorValue = /^#(?:[0-9A-F]{3}){1,2}$/i.test(
    cookieBannerColor ?? "",
  )
    ? cookieBannerColor
    : cookieBannerSettingsInitialValues.cookieBannerColor;

  return (
    <Layout>
      <div className="mx-auto w-full max-w-6xl">
        <Card className="rounded-xl border-border bg-background shadow-sm p-5 sm:p-6">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Settings</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Configure website cookie banner style.
            </p>
          </div>

          <Card className="mt-6 max-w-3xl rounded-xl border-border bg-muted/20 p-5 shadow-none sm:p-6">
            <h3 className="text-2xl font-semibold">Cookie Banner Colors</h3>

            <form
              className="mt-6 flex flex-col gap-6"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitAttempted(true);
                saveSettings({
                  cookieBannerColor,
                });
              }}
            >
              <div className="grid gap-2">
                <Label htmlFor="cookie-banner-color">Cookie Banner Color</Label>
                <div className="flex items-center gap-3">
                  <input
                    id="cookie-banner-color"
                    type="color"
                    value={normalizedColorValue}
                    onChange={(event) => {
                      setCookieBannerColor(event.target.value);
                    }}
                    className="h-11 w-11 rounded-md border border-input bg-background p-1"
                  />
                  <Input
                    value={cookieBannerColor}
                    onChange={(event) => setCookieBannerColor(event.target.value)}
                    placeholder="#2F4BFE"
                    className="max-w-md"
                  />
                </div>
              </div>

              {submitAttempted && props.errors?.cookieBannerColor ? (
                <p className="text-sm text-destructive">
                  {props.errors.cookieBannerColor}
                </p>
              ) : null}
              {props.flash?.success ? (
                <p className="text-sm text-green-600">{props.flash.success}</p>
              ) : null}
              {props.flash?.error ? (
                <p className="text-sm text-destructive">{props.flash.error}</p>
              ) : null}

              <div>
                <Button type="submit" disabled={isSaving}>
                  Save Settings
                </Button>
              </div>
            </form>
          </Card>
        </Card>
      </div>
    </Layout>
  );
}

