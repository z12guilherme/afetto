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
          </Route>
          
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="produtos" element={<ProductsAdmin />} />
            <Route path="cestas" element={<BasketAdmin />} />
          </Route>
        </Routes>
      </Router>
      <Toaster position="top-center" richColors />
    </>
  );
}
