import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Library from './pages/Library';
import Sagas from './pages/Sagas';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/biblioteca" element={<Library />} />
          <Route path="/sagas" element={<Sagas />} />
          <Route path="/buscar" element={<Search />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;