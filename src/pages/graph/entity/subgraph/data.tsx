import type { GraphData } from '@/api/search.ts';
import { useNetwork } from '@/components/use-network.ts';
import { useLoaderData } from 'react-router-dom';

export function useGraphEntitySubgraphPageData () {
  const data = useLoaderData() as GraphData;
  const network = useNetwork(data);
  return {
    network,
  };
}