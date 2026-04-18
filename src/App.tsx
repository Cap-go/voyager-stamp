import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { GridPage } from './pages/GridPage'
import { DetailPage } from './pages/DetailPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GridPage />} />
        <Route path="/stamp/:id" element={<DetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}
