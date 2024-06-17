import { type GraphData } from '@/api/search.ts';
import { useNetwork } from '@/components/use-network.ts';
import { useLoaderData, useSearchParams } from 'react-router-dom';

export function useSearchPage () {
  const data = useLoaderData() as GraphData;

  const network = useNetwork(data);

  const [usp] = useSearchParams();

  return {
    network,
    data,
    query: usp.get('query')?.trim() ?? '',
  };
}
