import { NetworkEditor } from '@/components/NetworkEditor.tsx';
import { QuestionQuery } from '@/components/QuestionQuery.tsx';
import { useGraphEntitySubgraphPageData } from './data';

export function GraphEntitySubgraphPage () {
  const { network } = useGraphEntitySubgraphPageData();

  return (
    <>
      <NetworkEditor network={network} />
      <QuestionQuery />
    </>
  );
}
