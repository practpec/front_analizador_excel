import { useState, useEffect } from 'react'
import { X, Save } from 'lucide-react'

// Modal para editar contactos
function ContactEditModal({ contact, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    client_key: '',
    name: '',
    email: '',
    phone: ''
  })

  // Actualizar formulario cuando cambie el contacto
  useEffect(() => {
    if (contact) {
      setFormData({
        client_key: contact.client_key || '',
        name: contact.name || '',
        email: contact.email || '',
        phone: contact.phone || ''
      })
    }
  }, [contact])

  // Manejar cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault()
    
    const updatedContact = {
      ...contact,
      ...formData
    }
    
    onSave(updatedContact)
  }

  if (!isOpen || !contact) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Editar Contacto
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="client_key" className="block text-sm font-medium text-gray-700 mb-1">
              Clave Cliente
            </label>
            <input
              type="text"
              id="client_key"
              name="client_key"
              value={formData.client_key}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Solo letras y espacios"
            />
            <p className="text-xs text-gray-500 mt-1">
              Solo letras y espacios, sin números
            </p>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="usuario@dominio.com"
            />
            <p className="text-xs text-gray-500 mt-1">
              Dominios válidos: gmail.com, yahoo.com, hotmail.com, etc.
            </p>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono Contacto
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="9611234567"
              maxLength="10"
            />
            <p className="text-xs text-gray-500 mt-1">
              10 dígitos con lada de Chiapas (961, 962, 963, 964, 965, 966, 967, 968, 994)
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ContactEditModal