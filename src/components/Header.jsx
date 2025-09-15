import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const [date, setDate] = useState(new Date());
  const { pathname } = useLocation();

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const formattedDate = date.toLocaleDateString('en-US', options);
    const [weekday, month, day, year] = formattedDate.split(' ');
    return `${weekday.replace(',', '')}, ${day.replace(
      ',',
      ''
    )} ${month} ${year}`;
  };

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-800 capitalize">
        {' '}
        {pathname === '/' ? 'dashboard' : pathname.split('/')}{' '}
      </h1>
      <div> {formatDate(date)} </div>
    </div>
  );
};

export default Header;
