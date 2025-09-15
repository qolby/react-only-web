import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Layout from './layouts/Layout';
import NotFound from './pages/NotFound';
import Menu from './pages/Menu';
import OrderPage from './pages/OrderPage';
import TransactionPage from './pages/TransactionPage';
import ReportPage from './pages/ReportPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/transaction" element={<TransactionPage />} />
          <Route path="/orders" element={<OrderPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
