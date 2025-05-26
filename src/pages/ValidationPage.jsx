import { useState, useEffect } from 'react'
import { AlertTriangle, CheckCircle, Edit2, RefreshCw, Download } from 'lucide-react'
import { contactsApi } from '../services/api'
import toast from 'react-hot-toast'
import ContactEditModal from '../components/contacts/ContactEditModal'

// Página para validar contactos y mostrar errores
function ValidationPage() {
  const [validationResults, setValidationResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [editingContact, setEditingContact] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  // Cargar validaciones al montar el componente
  useEffect(() => {
    loadValidations()
  }, [])

  // Obtener validaciones de todos los contactos
  const loadValidations = async () => {
    setLoading(true)
    try {
      const response = await contactsApi.validateContacts()
      setValidationResults(response.data || [])
    } catch (error) {
      toast.error('Error al validar contactos: ' + (error.response?.data?.error || error.message))
    } finally {
      setLoading(false)
    }
  }

  // Filtrar resultados según el estado de validación
  const filteredResults = validationResults.filter(result => {
    switch (filter) {
      case 'valid':
        return result.is_valid
      case 'invalid':
        return !result.is_valid
      default:
        return true
    }
  })

  // Obtener estadísticas
  const stats = {
    total: validationResults.length,
    valid: validationResults.filter(r => r.is_valid).length,
    invalid: validationResults.filter(r => !r.is_valid).length
  }

  // Obtener color del badge de error según el tipo
  const getErrorBadgeColor = (type) => {
    switch (type) {
      case 'REQUIRED':
        return 'bg-red-100 text-red-800'
      case 'INVALID_FORMAT':
        return 'bg-orange-100 text-orange-800'
      case 'INVALID_CHARACTER':
        return 'bg-yellow-100 text-yellow-800'
      case 'INVALID_DOMAIN':
        return 'bg-purple-100 text-purple-800'
      case 'INVALID_AREA_CODE':
        return 'bg-blue-100 text-blue-800'
      case 'INVALID_LENGTH':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Abrir modal de edición
  const handleEditContact = (contact) => {
    setEditingContact(contact)
    setIsModalOpen(true)
  }

  // Manejar actualización de contacto
  const handleUpdateContact = async (updatedContact) => {
    try {
      await contactsApi.updateContact(updatedContact.id, updatedContact)
      toast.success('Contacto actualizado exitosamente')
      setIsModalOpen(false)
      setEditingContact(null)
      // Recargar validaciones
      loadValidations()
    } catch (error) {
      toast.error('Error al actualizar contacto: ' + (error.response?.data?.error || error.message))
    }
  }

  // Descargar Excel con contactos corregidos
  const handleDownloadExcel = async () => {
    setIsDownloading(true)
    try {
      await contactsApi.downloadExcel()
      toast.success('Excel descargado exitosamente')
    } catch (error) {
      toast.error('Error al descargar Excel: ' + (error.response?.data?.error || error.message))
    } finally {
      setIsDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <AlertTriangle className="w-6 h-6 text-orange-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">
            Validación de Contactos
          </h1>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleDownloadExcel}
            disabled={isDownloading || stats.total === 0}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Download className={`w-4 h-4 mr-2 ${isDownloading ? 'animate-spin' : ''}`} />
            {isDownloading ? 'Descargando...' : 'Descargar Excel'}
          </button>
          <button
            onClick={loadValidations}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Revalidar
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">{stats.total}</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Válidos</p>
              <p className="text-2xl font-semibold text-green-600">{stats.valid}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Con Errores</p>
              <p className="text-2xl font-semibold text-red-600">{stats.invalid}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos ({stats.total})
          </button>
          <button
            onClick={() => setFilter('valid')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === 'valid'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Válidos ({stats.valid})
          </button>
          <button
            onClick={() => setFilter('invalid')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === 'invalid'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Con Errores ({stats.invalid})
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filteredResults.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <p className="text-gray-500">
              {stats.total === 0 
                ? 'No hay contactos para validar. Carga un archivo Excel primero.'
                : 'No se encontraron resultados con el filtro seleccionado.'
              }
            </p>
          </div>
        ) : (
          filteredResults.map((result) => (
            <div key={result.contact.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {/* Contact Header */}
              <div className={`p-4 border-l-4 ${
                result.is_valid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      result.is_valid ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {result.is_valid ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {result.contact.name || 'Sin nombre'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Clave: {result.contact.client_key} | Email: {result.contact.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditContact(result.contact)}
                    className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    Editar
                  </button>
                </div>
              </div>

              {/* Contact Details */}
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Clave Cliente
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{result.contact.client_key}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{result.contact.name}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Correo
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{result.contact.email}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teléfono
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{result.contact.phone}</p>
                  </div>
                </div>

                {/* Errors */}
                {!result.is_valid && result.errors && result.errors.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Errores encontrados:
                    </h4>
                    <div className="space-y-2">
                      {result.errors.map((error, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getErrorBadgeColor(error.type)}`}>
                              {error.field}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{error.message}</p>
                            {error.value && (
                              <p className="text-xs text-gray-500">Valor actual: "{error.value}"</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      <ContactEditModal
        contact={editingContact}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingContact(null)
        }}
        onSave={handleUpdateContact}
      />
    </div>
  )
}

export default ValidationPage