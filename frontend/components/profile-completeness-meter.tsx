'use client';

import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface ProfileCompletenessProps {
  percentage: number;
  variant?: 'small' | 'premium';
}

export function ProfileCompletenessMeter({ percentage, variant = 'small' }: ProfileCompletenessProps) {
  if (variant === 'premium') {
    return (
      <div className="p-6 rounded-lg border border-[#8b5cf6]/20 bg-gradient-to-r from-[#8b5cf6]/5 to-[#7c3aed]/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground">Profile Completeness</h3>
            <p className="text-sm text-muted-foreground mt-1">Complete your profile to increase visibility to recruiters</p>
          </div>
          <div className="text-2xl font-bold bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] bg-clip-text text-transparent">
            {percentage}%
          </div>
        </div>
        <Progress value={percentage} className="h-3 mb-4" />
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            { label: 'Profile Picture', done: percentage >= 25 },
            { label: 'Basic Info', done: percentage >= 50 },
            { label: 'Skills', done: percentage >= 75 },
            { label: 'Resume', done: percentage >= 100 },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              {item.done ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-500" />
              )}
              <span className={item.done ? 'text-foreground' : 'text-muted-foreground'}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 rounded border border-[#e5e5e5] bg-white">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-foreground">Profile {percentage}%</span>
        <span className="text-xs text-muted-foreground">{percentage}%</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}
