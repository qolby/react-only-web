import React, { useState } from 'react';
import { BiFoodMenu } from 'react-icons/bi';
import { HiMenuAlt2, HiMenuAlt3 } from 'react-icons/hi';
import {
  MdOutlineDashboard,
  MdOutlineListAlt,
  MdOutlineShoppingCart,
} from 'react-icons/md';
import { TbReport } from 'react-icons/tb';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigations = [
    { name: 'dashboard', link: '/', icon: MdOutlineDashboard },
    { name: 'menu', link: '/menu', icon: BiFoodMenu },
    { name: 'transaction', link: '/transaction', icon: MdOutlineShoppingCart },
    { name: 'orders', link: '/orders', icon: MdOutlineListAlt },
    { name: 'reports', link: '/report', icon: TbReport },
  ];

  const [open, setOpen] = useState(true);
  const { pathname } = useLocation();

  return (
    <aside
      className={`bg-neutral-50 min-h-screen shadow-sm ${
        open ? 'w-72' : 'w-16'
      } duration-500 px-4`}
    >
      <div className={`py-6 flex ${open ? 'justify-between' : 'justify-end'}`}>
        <h1
          className={`${
            !open && 'hidden'
          } text-primary-500 text-xl font-bold flex items-center gap-1.5 duration-500`}
        >
          <span className="text-primary-500">
            <img
              src="./src/assets/logo.png"
              alt=""
              className="rounded-full h-10"
            />
          </span>
          WarungAyung
        </h1>
        <button
          className="cursor-pointer duration-500 hover:bg-neutral-100"
          onClick={() => setOpen(!open)}
        >
          {open ? <HiMenuAlt3 size={26} /> : <HiMenuAlt2 size={26} />}
        </button>
      </div>
      <nav className="mt-6 flex flex-col gap-4 relative capitalize">
        {navigations?.map((navigation, index) => (
          <Link
            to={navigation?.link}
            key={index}
            className={`group flex items-center text-sm gap-3.5 font-medium p-2 ${
              pathname === navigation.link
                ? 'bg-primary-500 text-white'
                : 'hover:bg-neutral-100'
            } rounded-md`}
          >
            <div>{React.createElement(navigation?.icon, { size: 20 })}</div>
            <h2
              className={`whitespace-pre duration-500 ${
                !open && 'opacity-0 translate-x-28 overflow-hidden'
              } `}
            >
              {' '}
              {navigation?.name}{' '}
            </h2>
            <h2
              className={`${
                open && 'hidden'
              } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}
            >
              {navigation?.name}
            </h2>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
