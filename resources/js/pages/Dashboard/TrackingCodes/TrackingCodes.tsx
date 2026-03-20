import { usePage } from "@inertiajs/react";
import { Plus } from "lucide-react";
import type { FC } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";

import { Layout } from "@/Layouts/Layout";
import TrackingCodeCard from "@/Pages/Dashboard/TrackingCodes/Components/TrackingCodeCard";
import { useTrackingCodes } from "@/Pages/Dashboard/TrackingCodes/Hooks/useTrackingCodes";
import type { TrackingCode } from "@/Pages/Dashboard/TrackingCodes/Hooks/useTrackingCodes";
import DeleteTrackingCodeModal from "@/Pages/Dashboard/TrackingCodes/Modals/DeleteTrackingCodeModal";
import TrackingCodeWizardModal from "@/Pages/Dashboard/TrackingCodes/Modals/TrackingCodeWizardModal";

const TrackingCodesPage: FC = () => {
    const { props } = usePage<{
        trackingCodes: TrackingCode[];
        flash?: { success?: string; error?: string };
    }>();

    const {
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
    } = useTrackingCodes(props.trackingCodes);

    return (
        <Layout>
            <div className="mx-auto w-full max-w-6xl">
                <Card className="rounded-xl border-border bg-background p-5 shadow-sm sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-3xl font-semibold tracking-tight">
                                Tracking Codes
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Manage your tracking scripts in one place.
                            </p>
                        </div>

                        <Button onClick={openCreateTrackingModal} className="sm:self-start">
                            <Plus className="size-4" />
                            Add Tracking Code
                        </Button>
                    </div>

                    {props.flash?.success ? (
                        <p className="mt-4 text-sm text-green-600">{props.flash.success}</p>
                    ) : null}
                    {props.flash?.error ? (
                        <p className="mt-4 text-sm text-destructive">{props.flash.error}</p>
                    ) : null}

                    <Card className="shadow-none border-none pt-8">
                        {isEmpty ? (
                            <Card className="rounded-xl border-border bg-background shadow-none">
                                <div className="p-6">
                                    <div className="text-sm font-semibold">
                                        No tracking codes yet
                                    </div>
                                    <div className="mt-2 text-sm text-muted-foreground">
                                        Use the{" "}
                                        <span className="font-medium">Add Tracking Code</span> button
                                        to create your first code.
                                    </div>
                                </div>
                            </Card>
                        ) : (
                            <div className="space-y-3">
                                {trackingCodes.map((tc) => (
                                    <TrackingCodeCard
                                        key={tc.id}
                                        trackingCode={tc}
                                        onPreview={openPreviewTrackingModal}
                                        onEdit={openEditTrackingModal}
                                        onDelete={openDeleteConfirm}
                                    />
                                ))}
                            </div>
                        )}
                    </Card>
                </Card>

                <TrackingCodeWizardModal
                    open={trackingModalOpen}
                    onOpenChange={(open) =>
                        open ? setTrackingModalOpen(true) : closeTrackingModal()
                    }
                    mode={trackingModalMode}
                    draftValues={draftValues}
                    onSubmit={submitTrackingModalForm}
                />

                <DeleteTrackingCodeModal
                    open={confirmOpen}
                    onOpenChange={setConfirmOpen}
                    onCancel={closeDeleteConfirm}
                    onConfirm={confirmDelete}
                />
            </div>
        </Layout>
    );
};

export default TrackingCodesPage;

