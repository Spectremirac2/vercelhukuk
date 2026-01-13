"use client";

import React from "react";
import { cn } from "@/utils/cn";
import { Loader2 } from "lucide-react";

/**
 * Button bileşeni - Modern buton tasarımı
 * Gradient, outline ve ghost varyantları
 */

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

const sizeMap = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-6 py-3 text-base gap-2",
  xl: "px-8 py-4 text-lg gap-3",
};

const variantMap = {
  primary: cn(
    "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
    "shadow-lg shadow-blue-500/25",
    "hover:from-blue-600 hover:to-blue-700 hover:shadow-xl hover:shadow-blue-500/30",
    "active:from-blue-700 active:to-blue-800",
    "disabled:from-blue-400 disabled:to-blue-500 disabled:shadow-none"
  ),
  secondary: cn(
    "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200",
    "hover:bg-gray-200 dark:hover:bg-gray-700",
    "active:bg-gray-300 dark:active:bg-gray-600",
    "border border-gray-200 dark:border-gray-700"
  ),
  outline: cn(
    "bg-transparent text-blue-600 dark:text-blue-400",
    "border-2 border-blue-500 dark:border-blue-400",
    "hover:bg-blue-50 dark:hover:bg-blue-900/20",
    "active:bg-blue-100 dark:active:bg-blue-900/40"
  ),
  ghost: cn(
    "bg-transparent text-gray-600 dark:text-gray-300",
    "hover:bg-gray-100 dark:hover:bg-gray-800",
    "active:bg-gray-200 dark:active:bg-gray-700"
  ),
  danger: cn(
    "bg-gradient-to-r from-red-500 to-red-600 text-white",
    "shadow-lg shadow-red-500/25",
    "hover:from-red-600 hover:to-red-700 hover:shadow-xl hover:shadow-red-500/30",
    "active:from-red-700 active:to-red-800"
  ),
  success: cn(
    "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white",
    "shadow-lg shadow-emerald-500/25",
    "hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl hover:shadow-emerald-500/30",
    "active:from-emerald-700 active:to-emerald-800"
  ),
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-xl",
        "transition-all duration-200 ease-out",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-60",
        sizeMap[size],
        variantMap[variant],
        fullWidth && "w-full",
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" size={size === "sm" ? 14 : size === "lg" ? 20 : 16} />
          <span>Yükleniyor...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && icon}
          {children}
          {icon && iconPosition === "right" && icon}
        </>
      )}
    </button>
  );
}

/**
 * IconButton - Sadece ikon içeren buton
 */
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  tooltip?: string;
}

const iconSizeMap = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

const iconVariantMap = {
  primary: cn(
    "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
    "hover:from-blue-600 hover:to-blue-700",
    "shadow-md shadow-blue-500/20"
  ),
  secondary: cn(
    "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300",
    "hover:bg-gray-200 dark:hover:bg-gray-700",
    "border border-gray-200 dark:border-gray-700"
  ),
  ghost: cn(
    "bg-transparent text-gray-500 dark:text-gray-400",
    "hover:bg-gray-100 dark:hover:bg-gray-800",
    "hover:text-gray-700 dark:hover:text-gray-200"
  ),
  danger: cn(
    "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    "hover:bg-red-100 dark:hover:bg-red-900/40"
  ),
};

export function IconButton({
  variant = "ghost",
  size = "md",
  loading = false,
  tooltip,
  className,
  children,
  disabled,
  ...props
}: IconButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl",
        "transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        "disabled:cursor-not-allowed disabled:opacity-60",
        iconSizeMap[size],
        iconVariantMap[variant],
        tooltip && "tooltip",
        className
      )}
      disabled={isDisabled}
      data-tooltip={tooltip}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={size === "sm" ? 14 : size === "lg" ? 20 : 16} />
      ) : (
        children
      )}
    </button>
  );
}

/**
 * ButtonGroup - Buton grubu
 */
interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function ButtonGroup({ children, className }: ButtonGroupProps) {
  return (
    <div
      className={cn(
        "inline-flex rounded-xl overflow-hidden",
        "[&>button]:rounded-none [&>button:first-child]:rounded-l-xl [&>button:last-child]:rounded-r-xl",
        "[&>button]:border-r-0 [&>button:last-child]:border-r",
        className
      )}
    >
      {children}
    </div>
  );
}
