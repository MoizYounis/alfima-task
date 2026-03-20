export interface TrackingCodeFormValues {
  name: string;
  scriptCode: string;
  isExternal: boolean;
  placement: "head" | "body_start" | "body_end";
  isActive: boolean;
}

export const trackingCodeFormInitialValues: TrackingCodeFormValues = {
  name: "",
  scriptCode: "",
  isExternal: false,
  placement: "head",
  isActive: true,
};

export function mapTrackingCodeFormValues(
  values?: Partial<TrackingCodeFormValues> | null,
): TrackingCodeFormValues {
  return {
    name: values?.name ?? "",
    scriptCode: values?.scriptCode ?? "",
    isExternal: values?.isExternal ?? false,
    placement: values?.placement ?? "head",
    isActive: values?.isActive ?? true,
  };
}

