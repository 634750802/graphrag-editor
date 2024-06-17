import { Loader } from '../components/Loader';

export function LoadingPage () {
  return (
    <div className="w-screen h-screen fixed left-0 top-0">
      <Loader loading={true}>
        Loading data...
      </Loader>
    </div>
  );
}