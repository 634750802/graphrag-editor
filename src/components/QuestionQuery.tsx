import { Input } from '@/components/ui/input.tsx';
import { SearchIcon } from 'lucide-react';
import { Form } from 'react-router-dom';
import { Button } from './ui/button';

export interface QuestionQueryProps {
  disabled?: boolean;
  query?: string;
}

export function QuestionQuery ({ query, disabled }: QuestionQueryProps) {
  return (
    <Form className="absolute left-2 top-2 flex gap-2" action="/graph/search" method="get">
      <Input name="query" className=' py-2 px-1.5 h-9' placeholder="Embedding search..." defaultValue={query} disabled={disabled} />
      <Button className="gap-1" type="submit" size='sm'>
        <SearchIcon className='w-3 h-3' />
        Search
      </Button>
    </Form>
  );
}
