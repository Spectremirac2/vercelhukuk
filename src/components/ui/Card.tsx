"use client";

import React from "react";
import { cn } from "@/utils/cn";

/**
 * Card bileşeni - Modern kart tasarımı
 * Glassmorphism ve gradient border destekli
 */

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "interactive" | "glass" | "gradient";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

const paddingMap = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
  xl: "p-8",
};

const variantMap = {
  default: "card",
  elevated: "card-elevated",
  interactive: "card-interactive",
  glass: "glass rounded-xl",
  gradient: "gradient-border rounded-xl",
};

export function Card({
  variant = "default",
  padding = "md",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(variantMap[variant], paddingMap[padding], className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * CardHeader - Kart başlık bölümü
 */
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function CardHeader({
  title,
  description,
  icon,
  action,
  className,
  ...props
}: CardHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between mb-4", className)} {...props}>
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
            {icon}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

/**
 * CardContent - Kart içerik bölümü
 */
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

/**
 * CardFooter - Kart alt bölümü
 */
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between pt-4 mt-4 border-t border-gray-200 dark:border-gray-700",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * StatCard - İstatistik kartı
 */
interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease" | "neutral";
  };
  icon?: React.ReactNode;
  color?: "blue" | "emerald" | "gold" | "rose" | "purple";
}

const colorMap = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    icon: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    icon: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800",
  },
  gold: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    icon: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-900/20",
    icon: "text-rose-600 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-800",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-900/20",
    icon: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
  },
};

export function StatCard({ title, value, change, icon, color = "blue" }: StatCardProps) {
  const colors = colorMap[color];

  return (
    <Card variant="elevated" padding="lg" className={cn("border-l-4", colors.border)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {change && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={cn(
                  "text-sm font-medium",
                  change.type === "increase" && "text-emerald-600 dark:text-emerald-400",
                  change.type === "decrease" && "text-rose-600 dark:text-rose-400",
                  change.type === "neutral" && "text-gray-500 dark:text-gray-400"
                )}
              >
                {change.type === "increase" ? "↑" : change.type === "decrease" ? "↓" : "→"}
                {" "}{Math.abs(change.value)}%
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">geçen aya göre</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", colors.bg)}>
            <span className={colors.icon}>{icon}</span>
          </div>
        )}
      </div>
    </Card>
  );
}

/**
 * FeatureCard - Özellik kartı (Dashboard için)
 */
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  badge?: string;
  color?: "blue" | "emerald" | "gold" | "rose" | "purple" | "cyan";
}

const featureColorMap = {
  blue: "from-blue-500 to-blue-600",
  emerald: "from-emerald-500 to-emerald-600",
  gold: "from-amber-500 to-amber-600",
  rose: "from-rose-500 to-rose-600",
  purple: "from-purple-500 to-purple-600",
  cyan: "from-cyan-500 to-cyan-600",
};

export function FeatureCard({
  title,
  description,
  icon,
  href,
  onClick,
  badge,
  color = "blue",
}: FeatureCardProps) {
  const Wrapper = href ? "a" : "button";
  const wrapperProps = href ? { href } : { onClick, type: "button" as const };

  return (
    <Wrapper
      {...wrapperProps}
      className="group relative block w-full text-left"
    >
      <Card
        variant="interactive"
        padding="lg"
        className="h-full transition-all duration-300 group-hover:shadow-lg"
      >
        {badge && (
          <span className="absolute top-3 right-3 badge badge-primary text-xs">
            {badge}
          </span>
        )}
        
        <div
          className={cn(
            "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white mb-4 transition-transform duration-300 group-hover:scale-110",
            featureColorMap[color]
          )}
        >
          {icon}
        </div>
        
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
          {description}
        </p>
        
        <div className="mt-4 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Kullan</span>
          <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Card>
    </Wrapper>
  );
}
