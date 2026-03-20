import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";

import {
  mapTrackingCodeFormValues,
  trackingCodeFormInitialValues,
} from "@/Forms/TrackingCodes";
import type { TrackingCodeFormValues } from "@/Forms/TrackingCodes";

export type TrackingCode = {
  id: number;
  name: string;
  scriptCode: string;
  isExternal: boolean;
  placement: "head" | "body_start" | "body_end";
  isActive: boolean;
};

export function useTrackingCodes(serverTrackingCodes: TrackingCode[]) {
  const [trackingCodes, setTrackingCodes] = useState<TrackingCode[]>(
    serverTrackingCodes,
  );

  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [trackingModalMode, setTrackingModalMode] = useState<
    "create" | "edit" | "view"
  >("create");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draftValues, setDraftValues] = useState<TrackingCodeFormValues>(
    trackingCodeFormInitialValues,
  );

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    setTrackingCodes(serverTrackingCodes);
  }, [serverTrackingCodes]);

  const isEmpty = trackingCodes.length === 0;

  function openCreateTrackingModal() {
    setTrackingModalMode("create");
    setEditingId(null);
    // Ensure a new object reference so the form component resets correctly.
    setDraftValues({ ...trackingCodeFormInitialValues });
    setTrackingModalOpen(true);
  }

  function openEditTrackingModal(code: TrackingCode) {
    setTrackingModalMode("edit");
    setEditingId(code.id);
    setDraftValues(mapTrackingCodeFormValues(code));
    setTrackingModalOpen(true);
  }

  function openPreviewTrackingModal(code: TrackingCode) {
    setTrackingModalMode("view");
    setEditingId(code.id);
    setDraftValues(mapTrackingCodeFormValues(code));
    setTrackingModalOpen(true);
  }

  function closeTrackingModal() {
    setTrackingModalOpen(false);
  }

  function submitTrackingModalForm(values: TrackingCodeFormValues) {
    const nextValues = {
      name: values.name,
      scriptCode: values.scriptCode,
      isExternal: values.isExternal,
      placement: values.placement,
      isActive: values.isActive,
    };

    if (trackingModalMode === "create") {
      router.post(
        "/dashboard/tracking-codes",
        {
          name: nextValues.name,
          scriptCode: nextValues.scriptCode,
          isExternal: nextValues.isExternal,
          placement: nextValues.placement,
          isActive: nextValues.isActive,
        },
        {
          preserveScroll: true,
          onSuccess: () => {
            closeTrackingModal();
          },
        },
      );
    } else if (editingId !== null) {
      router.post(
        `/dashboard/tracking-codes/${editingId}`,
        {
          name: nextValues.name,
          scriptCode: nextValues.scriptCode,
          isExternal: nextValues.isExternal,
          placement: nextValues.placement,
          isActive: nextValues.isActive,
        },
        {
          preserveScroll: true,
          onSuccess: () => {
            closeTrackingModal();
          },
        },
      );
    }
  }

  function openDeleteConfirm(codeId: number) {
    setDeletingId(codeId);
    setConfirmOpen(true);
  }

  function closeDeleteConfirm() {
    setConfirmOpen(false);
    setDeletingId(null);
  }

  function confirmDelete() {
    if (deletingId === null) {
      return;
    }

    router.delete(`/dashboard/tracking-codes/${deletingId}`, {
      preserveScroll: true,
      onSuccess: () => {
        closeDeleteConfirm();
      },
    });
  }

  return {
    trackingCodes,
    isEmpty,
    trackingModalOpen,
    trackingModalMode,
    draftValues,
    confirmOpen,
    openCreateTrackingModal,
    openEditTrackingModal,
    openPreviewTrackingModal,
    closeTrackingModal,
    submitTrackingModalForm,
    setTrackingModalOpen,
    openDeleteConfirm,
    closeDeleteConfirm,
    confirmDelete,
    setConfirmOpen,
  };
}

