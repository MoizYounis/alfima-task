import Input from "@/components/Input/Input";
import Textarea from "@/components/Textarea/Textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/Label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { TrackingCodeFormValues } from "@/Forms/TrackingCodes";

type TrackingCodeFormFieldsProps = {
    name: string;
    scriptCode: string;
    setName: (value: string) => void;
    setScriptCode: (value: string) => void;
    isExternal: boolean;
    setIsExternal: (value: boolean) => void;
    placement: "head" | "body_start" | "body_end";
    setPlacement: (value: "head" | "body_start" | "body_end") => void;
    isActive: boolean;
    setIsActive: (value: boolean) => void;
    errors?: Partial<Record<keyof TrackingCodeFormValues, string>>;
};

export default function TrackingCodeFormFields({
    name,
    scriptCode,
    setName,
    setScriptCode,
    isExternal,
    setIsExternal,
    placement,
    setPlacement,
    isActive,
    setIsActive,
    errors,
}: TrackingCodeFormFieldsProps) {
    return (
        <div className="grid gap-5">
            <div className="grid gap-2">
                <Input
                    name="name"
                    type="text"
                    label="Name"
                    placeholder="Google Analytics"
                    value={name}
                    onChange={setName}
                    classNames="focus-visible:border-primary focus-visible:ring-primary/50"
                    error={errors?.name}
                />
            </div>

            <div className="grid gap-2">
                <Textarea
                    name="scriptCode"
                    label="Tracking Code Script"
                    placeholder="Paste script content without script tags"
                    value={scriptCode}
                    onChange={setScriptCode}
                    classNames="min-h-[180px] font-mono text-xs sm:text-sm focus-visible:border-primary focus-visible:ring-primary/50"
                    error={errors?.scriptCode}
                />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                    <Label
                        htmlFor="tracking-code-placement"
                        className="shrink-0"
                    >
                        Placement
                    </Label>
                    <Select
                        value={placement}
                        onValueChange={(value) =>
                            setPlacement(value as "head" | "body_start" | "body_end")
                        }
                    >
                        <SelectTrigger
                            id="tracking-code-placement"
                            className="w-full sm:w-[140px] focus-visible:border-primary focus-visible:ring-primary/50"
                        >
                            <SelectValue placeholder="Select placement" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="head">head</SelectItem>
                            <SelectItem value="body_start">body_start</SelectItem>
                            <SelectItem value="body_end">body_end</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <Checkbox
                        id="tracking-code-is-external"
                        checked={isExternal}
                        onCheckedChange={(checked) => setIsExternal(checked === true)}
                    />
                    <Label htmlFor="tracking-code-is-external">
                        External script
                    </Label>
                </div>

                <div className="flex items-center gap-2">
                    <Checkbox
                        id="tracking-code-is-active"
                        checked={isActive}
                        onCheckedChange={(checked) => setIsActive(checked === true)}
                    />
                    <Label htmlFor="tracking-code-is-active">Active</Label>
                </div>
            </div>

            {errors?.isExternal ? (
                <p className="text-xs text-destructive">{errors.isExternal}</p>
            ) : null}
            {errors?.placement ? (
                <p className="text-xs text-destructive">{errors.placement}</p>
            ) : null}
            {errors?.isActive ? (
                <p className="text-xs text-destructive">{errors.isActive}</p>
            ) : null}
        </div>
    );
}
