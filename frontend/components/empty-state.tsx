'use client';

import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'small' | 'premium';
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = 'small',
}: EmptyStateProps) {
  if (variant === 'premium') {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        {Icon && (
          <div className="mb-6 p-4 rounded-full bg-gradient-to-br from-[#8b5cf6]/10 to-[#7c3aed]/10">
            <Icon className="w-8 h-8 text-[#8b5cf6]" />
          </div>
        )}
        <h3 className="text-2xl font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground max-w-sm mb-8">{description}</p>
        {action && (
          <Button
            onClick={action.onClick}
            className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white hover:shadow-lg"
          >
            {action.label}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {Icon && <Icon className="w-8 h-8 text-muted-foreground mb-3" />}
      <h3 className="font-semibold text-foreground text-sm mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground mb-4">{description}</p>
      {action && (
        <Button size="sm" variant="outline" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
