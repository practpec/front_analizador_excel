import { Link, useLocation } from 'react-router-dom'
import { FileSpreadsheet, Users, CheckCircle } from 'lucide-react'

// Componente de navegación principal
function Layout({ children }) {
  const location = useLocation()

  const navigationItems = [
    { path: '/', icon: FileSpreadsheet, label: 'Inicio' },
    { path: '/contacts', icon: Users, label: 'Contactos' },
    { path: '/validation', icon: CheckCircle, label: 'Validación' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              Analizador Léxico de Excel
            </h1>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navigationItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                  location.pathname === path
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}

export default Layout