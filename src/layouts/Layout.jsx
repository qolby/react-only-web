import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const Layout = () => {
  return (
    <div className="flex flex-row bg-neutral-200 h-screen w-screen overflow-hidden">
      <div>
        <Sidebar />
      </div>

      <div className="flex flex-col w-screen">
        <div className="bg-neutral-200 py-6 px-6">
          <Header />
        </div>
        <div className="flex-grow p-6 overflow-auto">{<Outlet />}</div>
      </div>
    </div>
  );
};

export default Layout;
