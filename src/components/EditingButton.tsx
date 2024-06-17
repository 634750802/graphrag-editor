import { ExternalLinkIcon, Loader2Icon, PencilIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

export interface EditingButtonProps {
  editing: boolean;
  gotoUrl?: string;
  onStartEdit: () => void;
  onSave: () => void;
  onReset: () => void;
  busy: boolean;
}

export function EditingButton ({ gotoUrl, editing, onStartEdit, onReset, onSave, busy }: EditingButtonProps) {
  return editing
    ? (
      <div className="flex gap-2 items-center">
        <Button
          size="sm"
          disabled={busy}
          onClick={onSave}>
          {busy && <Loader2Icon className="w-3 h-3 mr-1 animate-spin repeat-infinite" />}
          Save
        </Button>
        <Button
          size="sm"
          variant="ghost"
          disabled={busy}
          onClick={onReset}>
          exit
        </Button>
      </div>
    )
    : (
      <div className="flex gap-1 items-center">
        <Button size="sm" variant="default" onClick={onStartEdit}>
          <PencilIcon className="w-3 h-3 mr-2" />
          Edit
        </Button>
        {gotoUrl && <Button size="sm" variant="secondary" asChild>
          <Link to={gotoUrl}>
            <ExternalLinkIcon className="w-3 h-3 mr-2" />
            Subgraph
          </Link>
        </Button>}
      </div>
    );
}