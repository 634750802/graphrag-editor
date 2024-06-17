import { Loader2Icon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

export function Loader ({ loading, children }: { loading: boolean, children?: ReactNode }) {
  return (
    <div className={cn('w-full h-full left-0 top-0 absolute bg-white/90 flex items-center justify-center transition-opacity z-50', loading ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none')}>
      <div className="flex gap-2 items-center pointer-events-none select-none text-sm text-primary font-bold rounded p-2">
        <Loader2Icon className="w-4 h-4 animate-spin repeat-infinite" />
        <div>{children}</div>
      </div>
    </div>
  );
}