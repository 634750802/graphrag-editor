import type { Relationship } from '@/api/search.ts';
import { NetworkContext } from '@/components/NetworkContext.tsx';
import type { IdType } from '@/network/Network.ts';
import { useContext, useEffect, useMemo, useState } from 'react';
import { getRelationship } from '../api/search';
import { useRemote } from '../lib/remote';
import { toastError, toastSuccess } from '../lib/ui-error';
import { cn } from '../lib/utils';
import { EditingButton } from './EditingButton';
import { InputField } from './editor-fields/InputField';
import { JsonField } from './editor-fields/JsonField';
import { TextareaField } from './editor-fields/TextareaField';
import { Loader } from './Loader';
import { useDirtyRelationship } from './use-dirty-relationship';

export function LinkDetails ({
  relationship,
  onClickTarget,
  onUpdate,
}: {
  relationship: Relationship,
  onClickTarget?: (target: { type: string, id: IdType }) => void;
  onUpdate?: (newRelationship: Relationship) => void;
}) {
  const network = useContext(NetworkContext);

  const { source, target } = useMemo(() => {
    return {
      source: network.node(relationship.source)!,
      target: network.node(relationship.target)!,
    };
  }, [network, relationship.source, relationship.target]);

  const [editing, setEditing] = useState(false);
  const latestData = useRemote(relationship, getRelationship, relationship.id);
  const dirtyRelationship = useDirtyRelationship(relationship.id);

  relationship = latestData.data;

  const handleSave = () => {
    void dirtyRelationship.save()
      .then((newRelationshipData) => {
        setEditing(false);
        onUpdate?.(latestData.mutate(prev => Object.assign({}, prev, newRelationshipData)));
        toastSuccess('Successfully saved.');
      })
      .catch((error: any) => {
        toastError('Failed to save relationship', error);
      });
  };

  const handleReset = () => {
    dirtyRelationship.resetSave();
    dirtyRelationship.reset(relationship);
    setEditing(false);
  };

  useEffect(() => {
    handleReset();
    onUpdate?.(latestData.data);
  }, [latestData.data]);

  const busy = dirtyRelationship.saving || latestData.revalidating;
  const controlsDisabled = !editing || busy;

  return (
    <div className="p-2 space-y-4 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground font-normal ">
          <b>#{relationship.id}</b> relationship
        </span>
        <EditingButton editing={editing} onStartEdit={() => setEditing(true)} onSave={handleSave} onReset={handleReset} busy={busy} />
      </div>
      <TextareaField label="Description" ref={dirtyRelationship.descriptionRef} defaultValue={relationship.description} disabled={controlsDisabled} />
      <InputField label="Weight" ref={dirtyRelationship.weightRef} defaultValue={relationship.weight} disabled={controlsDisabled} min={0} step={1} type="number" />
      <JsonField label="meta" ref={dirtyRelationship.metaRef} defaultValue={relationship.meta} disabled={controlsDisabled} />
      <section className="space-y-2">
        <h6 className="text-xs font-bold text-accent-foreground mb-1">Source</h6>
        <div className={cn('text-sm cursor-pointer transition-all hover:text-primary', editing && 'pointer-events-none opacity-50')} onClick={() => !editing && onClickTarget?.({ type: 'node', id: source.id })}>{source.name} <span className="text-muted-foreground">#{source.id}</span></div>
        <p className={cn('text-xs text-accent-foreground max-h-40 overflow-y-auto border p-1 bg-card rounded', editing && 'opacity-50')}>{source.description}</p>
      </section>
      <section className="space-y-2">
        <h6 className="text-xs font-bold text-accent-foreground mb-1">Target</h6>
        <div className={cn('text-sm cursor-pointer transition-all hover:text-primary', editing && 'pointer-events-none opacity-50')} onClick={() => !editing && onClickTarget?.({ type: 'node', id: target.id })}>{target.name} <span className="text-muted-foreground">#{target.id}</span></div>
        <p className={cn('text-xs text-accent-foreground max-h-40 overflow-y-auto border p-1 bg-card rounded', editing && 'opacity-50')}>{target.description}</p>
      </section>
      <Loader loading={latestData.revalidating}>
        Loading relationship #{relationship.id}
      </Loader>
    </div>
  );
}