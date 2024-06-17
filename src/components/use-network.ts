import { useMemo } from 'react';
import type { Entity, GraphData, Relationship } from '../api/search';
import { BaseNetwork } from '../network/Network';

export function useNetwork ({ entities, relationships }: GraphData) {
  return useMemo(() => {
    const network = new BaseNetwork<Entity, Relationship>();
    entities.forEach((entity) => network.addNode(entity));
    relationships.forEach((relationship) => network.addLink(relationship));

    return network;
  }, [entities, relationships]);
}