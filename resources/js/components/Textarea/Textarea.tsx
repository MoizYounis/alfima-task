import * as React from "react";

import { Label } from "@/components/ui/Label";
import { Textarea as ShadcnTextarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/utils";

type Props = {
  placeholder?: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  classNames?: string;
  readOnly?: boolean;
  allowAsterisk?: boolean;
  maxLength?: number;
  disabled?: boolean;
  error?: string;
};

const Textarea: React.FC<Props> = ({
  placeholder = "",
  name,
  label,
  value,
  onChange,
  classNames = "",
  readOnly,
  allowAsterisk = false,
  maxLength,
  disabled = false,
  error,
}) => {
  const remainingChars = maxLength !== undefined ? maxLength - value.length : null;
  const errorClassName = error
    ? "border-destructive focus-visible:border-destructive focus-visible:ring-3 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40"
    : "";

  return (
    <div className="w-full">
      <Label htmlFor={name} className="whitespace-nowrap">
        {label}
        {allowAsterisk && <span />}
      </Label>

      <div className="mt-2">
        <ShadcnTextarea
          id={name}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          readOnly={readOnly}
          className={cn(classNames, errorClassName)}
        />
      </div>

      {maxLength !== undefined && (
        <div className="flex justify-end">
          <span className={cn("mt-1 text-xs font-medium", remainingChars === 0 ? "text-destructive" : "text-muted-foreground")}>
            {remainingChars} Char
          </span>
        </div>
      )}

      {error ? (
        <span className="mt-1 block text-xs text-destructive">{error}</span>
      ) : null}
    </div>
  );
};

export default Textarea;
