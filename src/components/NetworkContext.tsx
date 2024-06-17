import type { Entity, Relationship } from '@/api/search.ts';
import { BaseNetwork, type ReadonlyNetwork } from '@/network/Network.ts';
import { createContext } from 'react';

export const NetworkContext = createContext<ReadonlyNetwork<Entity, Relationship>>(new BaseNetwork());
