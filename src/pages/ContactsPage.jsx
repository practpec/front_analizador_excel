import { useState, useEffect } from 'react'
import { Search, Edit2, Users, Download } from 'lucide-react'
import { contactsApi } from '../services/api'
import toast from 'react-hot-toast'
import ContactEditModal from '../components/contacts/ContactEditModal'

// Página para ver y buscar contactos
function ContactsPage() {
  const [contacts, setContacts] = useState([])
  const [filteredContacts, setFilteredContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchField, setSearchField] = useState('name')
  const [searchValue, setSearchValue] = useState('')
  const [editingContact, setEditingContact] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  // Cargar contactos al montar el componente
  useEffect(() => {
    loadContacts()
  }, [])

  // Obtener todos los contactos
  const loadContacts = async () => {
    try {
      const response = await contactsApi.getAllContacts()
      setContacts(response.data || [])
      setFilteredContacts(response.data || [])
    } catch (error) {
      toast.error('Error al cargar contactos: ' + (error.response?.data?.error || error.message))
    } finally {
      setLoading(false)
    }
  }

  // Buscar contactos
  const handleSearch = async () => {
    if (!searchValue.trim()) {
      setFilteredContacts(contacts)
      return
    }

    try {
      const response = await contactsApi.searchContacts(searchField, searchValue)
      setFilteredContacts(response.data || [])
    } catch (error) {
      toast.error('Error en la búsqueda: ' + (error.response?.data?.error || error.message))
    }
  }

  // Limpiar búsqueda
  const handleClearSearch = () => {
    setSearchValue('')
    setFilteredContacts(contacts)
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
      
      // Actualizar estado local
      const updatedContacts = contacts.map(contact => 
        contact.id === updatedContact.id ? updatedContact : contact
      )
      setContacts(updatedContacts)
      setFilteredContacts(updatedContacts)
      
      toast.success('Contacto actualizado exitosamente')
      setIsModalOpen(false)
      setEditingContact(null)
    } catch (error) {
      toast.error('Error al actualizar contacto: ' + (error.response?.data?.error || error.message))
    }
  }

  // Descargar Excel con contactos actuales
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
          <Users className="w-6 h-6 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Contactos
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Total: {contacts.length} contactos
          </div>
          <button
            onClick={handleDownloadExcel}
            disabled={isDownloading || contacts.length === 0}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Download className={`w-4 h-4 mr-2 ${isDownloading ? 'animate-spin' : ''}`} />
            {isDownloading ? 'Descargando...' : 'Descargar Excel'}
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Buscar Contactos
        </h2>
        
        <div className="flex gap-4">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="client_key">Clave Cliente</option>
            <option value="name">Nombre</option>
            <option value="email">Correo</option>
            <option value="phone">Teléfono</option>
          </select>
          
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Ingresa el valor a buscar..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </button>
          
          <button
            onClick={handleClearSearch}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Lista de Contactos ({filteredContacts.length})
          </h3>
        </div>

        {filteredContacts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {contacts.length === 0 
              ? 'No hay contactos cargados. Sube un archivo Excel primero.'
              : 'No se encontraron contactos con los criterios de búsqueda.'
            }
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clave Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Correo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {contact.client_key}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {contact.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {contact.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {contact.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditContact(contact)}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

export default ContactsPage