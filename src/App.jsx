import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import ContactsPage from './pages/ContactsPage'
import ValidationPage from './pages/ValidationPage'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/validation" element={<ValidationPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App