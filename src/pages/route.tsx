import { createBrowserRouter, redirect } from 'react-router-dom';
import { describeByEntity, searchGraph } from '../api/search';
import { GraphEntitySubgraphPage } from './graph/entity/subgraph/page';
import { SearchPage } from './graph/search/page';
import RootLayout from './RootLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '',
        element: <div>hi</div>,
        loader: ({ request }) => {
          const url = new URL(request.url);
          const trace = url.searchParams.get('langfuse_trace');
          if (trace) {
            return redirect(`/graph/langfuse/trace/${trace}`);
          }
          const query = url.searchParams.get('query')?.trim() ?? '';
          return redirect(`/graph/search?query=${encodeURIComponent(query)}`);
        },
      },
      {
        path: 'graph/search',
        element: <SearchPage />,
        loader: ({ request }) => {
          const query = new URL(request.url).searchParams.get('query')?.trim() ?? '';
          return searchGraph(query, true);
        },
      },
      {
        path: 'graph/entities/:id/subgraph',
        element: <GraphEntitySubgraphPage />,
        loader: ({ params }) => {
          return describeByEntity(params.id);
        },
      },
      {
        path: '*',
        loader: () => {
          return redirect('/');
        },
      },
    ],
  },
]);

export default router;