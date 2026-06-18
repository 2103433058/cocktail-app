import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import FilterPage from './pages/FilterPage'
import CategoryPage from './pages/CategoryPage'
import DrinkDetailPage from './pages/DrinkDetailPage'
import FavoritesPage from './pages/FavoritesPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/filter" element={<FilterPage />} />
        <Route path="/category/:name" element={<CategoryPage />} />
        <Route path="/drink/:id" element={<DrinkDetailPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
      </Route>
    </Routes>
  )
}
