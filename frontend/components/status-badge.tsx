'use client';

import { Badge } from '@/components/ui/badge';
import { Check, Clock, AlertCircle, X } from 'lucide-react';

interface StatusBadgeProps {
  status: 'pending' | 'shortlisted' | 'interview' | 'accepted' | 'rejected';
  variant?: 'small' | 'premium';
}

export function StatusBadge({ status, variant = 'small' }: StatusBadgeProps) {
  const statusConfig = {
    pending: {
      badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: Clock,
      label: 'Pending Review',
    },
    shortlisted: {
      badge: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: Check,
      label: 'Shortlisted',
    },
    interview: {
      badge: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: AlertCircle,
      label: 'Interview Scheduled',
    },
    accepted: {
      badge: 'bg-green-100 text-green-800 border-green-200',
      icon: Check,
      label: 'Accepted',
    },
    rejected: {
      badge: 'bg-red-100 text-red-800 border-red-200',
      icon: X,
      label: 'Rejected',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  if (variant === 'premium') {
    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${config.badge}`}>
        <Icon className="w-4 h-4" />
        <span className="font-semibold text-sm">{config.label}</span>
      </div>
    );
  }

  return (
    <Badge variant="outline" className={config.badge}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
}
