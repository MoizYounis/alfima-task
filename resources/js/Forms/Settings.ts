export interface CookieBannerSettingsFormValues {
  cookieBannerColor: string;
}

export const cookieBannerSettingsInitialValues: CookieBannerSettingsFormValues =
  {
    cookieBannerColor: "#2F4BFE",
  };

export function mapCookieBannerSettingsFormValues(
  values?: Partial<CookieBannerSettingsFormValues> | null,
): CookieBannerSettingsFormValues {
  return {
    cookieBannerColor:
      values?.cookieBannerColor ?? cookieBannerSettingsInitialValues.cookieBannerColor,
  };
}

