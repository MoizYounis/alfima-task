import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";

import type { CookieBannerSettingsFormValues } from "@/Forms/Settings";

export function useCookieBannerSettings(
  serverSavedValues: CookieBannerSettingsFormValues,
) {
  const [savedValues, setSavedValues] = useState<CookieBannerSettingsFormValues>(
    serverSavedValues,
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSavedValues(serverSavedValues);
  }, [serverSavedValues]);

  function saveSettings(values: CookieBannerSettingsFormValues) {
    const normalized: CookieBannerSettingsFormValues = {
      cookieBannerColor: values.cookieBannerColor.trim().toUpperCase(),
    };

    setIsSaving(true);
    router.post(
      "/dashboard/settings",
      { cookieBannerColor: normalized.cookieBannerColor },
      {
        preserveScroll: true,
        onSuccess: () => {
          setSavedValues(normalized);
          setIsSaving(false);
        },
        onError: () => {
          setIsSaving(false);
        },
      },
    );
  }

  return {
    savedValues,
    saveSettings,
    isSaving,
  };
}

