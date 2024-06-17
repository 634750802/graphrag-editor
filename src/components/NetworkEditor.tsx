import { type Entity, type Relationship } from '@/api/search.ts';
import { Details } from '@/components/Details.tsx';
import { NetworkCanvas } from '@/components/NetworkCanvas.tsx';
import { NetworkContext } from '@/components/NetworkContext.tsx';
import { cn } from '@/lib/utils.ts';
import { BaseNetwork, type IdType } from '@/network/Network.ts';
import { useState } from 'react';
import type { NetworkRendererOptions } from '../network/NetworkRenderer';
import { ScrollArea } from './ui/scroll-area';

export interface NetworkEditorProps {
  network: BaseNetwork<Entity, Relationship>;
}

export function NetworkEditor ({ network }: NetworkEditorProps) {
  const [target, setTarget] = useState<{ type: string, id: IdType }>();

  const networkOptions: NetworkRendererOptions<Entity, Relationship> = {
    showId: true,
    getNodeLabel: node => node.name,
    getNodeDetails: node => node.description,
    getNodeRadius: node => Math.pow(Math.log(1 + (network.nodeNeighborhoods(node.id)?.size ?? 0)) / Math.log(2), 2) * 2 + 5,
    getNodeColor: node => {
      if (node.entity_type === 'synopsis') {
        return `hsl(var(--brand1))`;
      } else {
        return `hsl(var(--primary))`;
      }
    },
    getNodeStrokeColor: node => {
      if (node.entity_type === 'synopsis') {
        return `hsl(var(--brand1))`;
      } else {
        return `hsl(var(--primary))`;
      }
    },
    getNodeLabelColor: node => {
      if (node.entity_type === 'synopsis') {
        return `hsl(var(--brand1))`;
      } else {
        return `hsl(var(--primary))`;
      }
    },
    getNodeLabelStrokeColor: node => {
      if (node.entity_type === 'synopsis') {
        return `hsl(var(--brand1-foreground))`;
      } else {
        return `hsl(var(--primary-foreground))`;
      }
    },
    getNodeMeta: node => node.meta,
    getLinkLabel: link => {
      const source = network.node(link.source)!;
      const target = network.node(link.target)!;
      return link.description
        .replace(source.name + ' -> ', '')
        .replace(' -> ' + target.name, '');
    },
    getLinkDetails: link => link.description,
    getLinkMeta: link => link.meta,
    getLinkLabelColor: () => {
      return `hsl(var(--primary) / 50%)`;
    },
    getLinkLabelStrokeColor: () => {
      return `hsl(var(--primary-foreground) / 50%)`;
    },

    onClickNode: (node) => {
      setTarget({ type: 'node', id: node.id });
    },
    onClickLink: (link) => {
      setTarget({ type: 'link', id: link.id });
    },
    onClickCanvas: () => {
      setTarget(undefined);
    },
  };

  return (
    <NetworkContext.Provider value={network}>
      <div className="w-screen h-screen overflow-hidden flex relative">
        <NetworkCanvas
          className={cn('w-[calc(100vw-480px)] h-screen overflow-hidden')}
          network={network}
          target={target}
          {...networkOptions}
        />
        <div className="w-[480px] flex-shrink-0 border-l bg-slate-50 overflow-x-hidden">
          <ScrollArea className="box-border w-[480px] h-full">
            <div className="w-[480px] overflow-x-hidden">
              <Details
                network={network}
                target={target}
                onTargetChange={setTarget}
              />
            </div>
          </ScrollArea>
        </div>
      </div>
    </NetworkContext.Provider>
  );
}
