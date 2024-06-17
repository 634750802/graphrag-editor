import type { Entity, Relationship } from '@/api/search.ts';
import { LinkDetails } from '@/components/LinkDetails.tsx';
import { NodeDetails } from '@/components/NodeDetails.tsx';
import { BaseNetwork, type IdType } from '@/network/Network.ts';

export interface DetailsProps {
  network: BaseNetwork<Entity, Relationship>;
  target: { type: string, id: IdType } | undefined;
  onTargetChange: (target: { type: string, id: IdType }) => void;
}

export function Details ({ network, target, onTargetChange }: DetailsProps) {
  if (!target) {
    return <div className="w-full h-80 flex items-center justify-center font-semibold text-sm text-muted-foreground pointer-events-none">
      Select an entity or relationship
    </div>;
  }
  switch (target.type) {
    case 'node':
      return <NodeDetails key={`node-${target.id}`} entity={network.node(target.id)!} onClickTarget={onTargetChange} onUpdate={({ id, ...attrs }) => network.replaceNodeAttrs(id, attrs)} />;
    case 'link':
      return <LinkDetails key={`link-${target.id}`} relationship={network.link(target.id)!} onClickTarget={onTargetChange} onUpdate={({ id, source, target, ...attrs }) => network.replaceLinkAttrs(id, attrs)} />;
  }

  return null;
}