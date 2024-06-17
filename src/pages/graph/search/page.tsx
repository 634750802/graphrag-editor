import { NetworkEditor } from '@/components/NetworkEditor.tsx';
import { QuestionQuery } from '@/components/QuestionQuery.tsx';
import { useSearchPage } from './data';

export function SearchPage () {
  const { query, network } = useSearchPage();

  return (
    <>
      <NetworkEditor network={network} />
      <QuestionQuery query={query} />
    </>
  );
}