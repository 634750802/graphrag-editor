import { Outlet, useNavigation } from 'react-router-dom';
import { Loader } from '../components/Loader';

export default function RootLayout () {
  const { state } = useNavigation();

  return (
    <>
      <Outlet />
      <Loader loading={state !== 'idle'}>
        Loading data...
      </Loader>
    </>
  );
}