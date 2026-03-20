import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/Separator";
import { mapTrackingCodeFormValues } from "@/Forms/TrackingCodes";
import type { TrackingCodeFormValues } from "@/Forms/TrackingCodes";
import TrackingCodeFormFields from "@/Pages/Dashboard/TrackingCodes/Components/TrackingCodeFormFields";
import type { PageProps } from "@/types";

type TrackingCodeWizardModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "edit" | "view";
    draftValues: TrackingCodeFormValues;
    onSubmit: (values: TrackingCodeFormValues) => void;
};

export default function TrackingCodeWizardModal({
    open,
    onOpenChange,
    mode,
    draftValues,
    onSubmit,
}: TrackingCodeWizardModalProps) {
    const title =
        mode === "create"
            ? "Add Tracking Code"
            : mode === "edit"
                ? "Edit Tracking Code"
                : "Preview Tracking Code";

    const { props } = usePage<PageProps>();

    const [values, setValues] = useState<TrackingCodeFormValues>(
        mapTrackingCodeFormValues(draftValues),
    );
    const [submitAttempted, setSubmitAttempted] = useState(false);

    useEffect(() => {
        if (!open) {
            return;
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setValues(mapTrackingCodeFormValues(draftValues));
        setSubmitAttempted(false);
    }, [open, draftValues]);

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitAttempted(true);
        onSubmit(values);
    }

    if (mode === "view") {
        const wrapped = values.isExternal
            ? `<script src="${values.scriptCode}"></script>`
            : `<script>\n${values.scriptCode}\n</script>`;

        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-2xl p-0">
                    <div className="p-6">
                        <DialogHeader>
                            <DialogTitle>{title}</DialogTitle>
                            <DialogDescription>
                                Tracking code details (read-only).
                            </DialogDescription>
                        </DialogHeader>

                        <Separator className="my-4" />

                        <div className="grid gap-4">
                            <div className="grid gap-1">
                                <div className="text-sm font-medium">Name</div>
                                <div className="rounded-md border border-border bg-background px-3 py-2 text-sm">
                                    {values.name}
                                </div>
                            </div>

                            <div className="grid gap-1">
                                <div className="text-sm font-medium">Script Code</div>
                                <div className="rounded-md border border-border bg-background p-4">
                                    <pre className="whitespace-pre-wrap font-mono text-xs sm:text-sm">
                                        {wrapped}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Close
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <form onSubmit={handleSubmit}>
                <DialogContent className="max-w-2xl p-0">
                    <div className="p-6">
                        <DialogHeader>
                            <DialogTitle>{title}</DialogTitle>
                            <DialogDescription>
                                Enter the tracking code details.
                            </DialogDescription>
                        </DialogHeader>

                        <Separator className="my-4" />

                        <TrackingCodeFormFields
                            name={values.name}
                            scriptCode={values.scriptCode}
                            setName={(value) => setValues((prev) => ({ ...prev, name: value }))}
                            setScriptCode={(value) =>
                                setValues((prev) => ({ ...prev, scriptCode: value }))
                            }
                            isExternal={values.isExternal}
                            setIsExternal={(value) =>
                                setValues((prev) => ({ ...prev, isExternal: value }))
                            }
                            placement={values.placement}
                            setPlacement={(value) =>
                                setValues((prev) => ({ ...prev, placement: value }))
                            }
                            isActive={values.isActive}
                            setIsActive={(value) =>
                                setValues((prev) => ({ ...prev, isActive: value }))
                            }
                            errors={
                                submitAttempted
                                    ? {
                                        name: props.errors?.name,
                                        scriptCode: props.errors?.scriptCode,
                                        isExternal: props.errors?.isExternal,
                                        placement: props.errors?.placement,
                                        isActive: props.errors?.isActive,
                                    }
                                    : undefined
                            }
                        />

                        <div className="mt-4 rounded-md border border-border/70 bg-muted/30 p-3 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">External script:</span>{" "}
                            When enabled, the script code is treated as a URL and rendered as
                            <code> {"<script src=\"...\">"} </code>. When disabled, the script code
                            is injected inline inside <code>{"<script>...</script>"}</code>.
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </form>
        </Dialog>
    );
}

