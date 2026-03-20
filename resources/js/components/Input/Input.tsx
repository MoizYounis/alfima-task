import * as React from "react";

import { Input as ShadcnInput } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { cn } from "@/lib/utils";

type Props = {
  type?: string;
  placeholder?: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactElement;
  iconPosition?: "left" | "right";
  classNames?: string;
  readOnly?: boolean;
  allowAsterisk?: boolean;
  maxLength?: number;
  disabled?: boolean;
  error?: string;
};

const Input: React.FC<Props> = ({
  type = "text",
  placeholder = "",
  name,
  label,
  value,
  onChange,
  icon,
  iconPosition,
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
  const iconClassName =
    iconPosition === "left" ? "pl-10" : iconPosition === "right" ? "pr-10" : "";

  return (
    <div className="w-full">
      <Label htmlFor={name} className="whitespace-nowrap">
        {label}
        {allowAsterisk && <span />}
      </Label>

      <div className="mt-2 relative">
        <ShadcnInput
          id={name}
          disabled={disabled}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          readOnly={readOnly}
          onKeyDown={(e) => {
            if (
              type === "number" &&
              (e.key === "-" || e.key === "e" || e.key === "E")
            ) {
              e.preventDefault();
            }
          }}
          className={cn(classNames, iconClassName, errorClassName)}
        />

        {icon && (
          <div
            className={cn(
              "absolute inset-y-0 flex items-center text-muted-foreground",
              iconPosition === "left" ? "left-3" : "right-3",
            )}
          >
            {icon}
          </div>
        )}
      </div>

      {maxLength !== undefined && (
        <div className="flex justify-end">
          <span
            className={cn(
              "mt-1 text-xs font-medium",
              remainingChars === 0
                ? "text-destructive"
                : "text-muted-foreground",
            )}
          >
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

export default Input;
