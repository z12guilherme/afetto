/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { Builder } from './pages/Builder';
import { AdminLayout } from './pages/admin/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { ProductsAdmin } from './pages/admin/ProductsAdmin';
import { BasketAdmin } from './pages/admin/BasketAdmin';
import { AdminLogin } from './pages/admin/AdminLogin';
import { OrderConfirmed } from './pages/OrderConfirmed';
import { OrdersAdmin } from './pages/admin/OrdersAdmin';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/montar-cesta" element={<Builder />} />
            <Route path="/pedido-confirmado" element={<OrderConfirmed />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/contato" element={<Contact />} />
            <Route path="/privacidade" element={<Privacy />} />
            <Route path="/termos" element={<Terms />} />
          </Route>
          
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="produtos" element={<ProductsAdmin />} />
            <Route path="cestas" element={<BasketAdmin />} />
            <Route path="pedidos" element={<OrdersAdmin />} />
          </Route>
        </Routes>
      </Router>
      <Toaster position="top-center" richColors />
    </>
  );
}
