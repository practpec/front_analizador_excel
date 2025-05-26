import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api/v1'

// Configuración base de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// Servicio para operaciones con contactos
export const contactsApi = {
  // Subir archivo Excel
  uploadExcel: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post('/contacts/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  // Obtener todos los contactos con paginación
  getAllContacts: async (page = 1, limit = 50) => {
    const response = await api.get('/contacts', {
      params: { page, limit }
    })
    return response.data
  },

  // Buscar contactos
  searchContacts: async (field, value) => {
    const response = await api.get('/contacts/search', {
      params: { field, value }
    })
    return response.data
  },

  // Actualizar contacto
  updateContact: async (id, contactData) => {
    const response = await api.put(`/contacts/${id}`, contactData)
    return response.data
  },

  // Validar todos los contactos con paginación
  validateContacts: async (page = 1, limit = 50) => {
    const response = await api.get('/contacts/validate', {
      params: { page, limit }
    })
    return response.data
  },

  // Descargar Excel con contactos corregidos
  downloadExcel: async () => {
    try {
      const response = await api.get('/contacts/download', {
        responseType: 'blob'
      })
      
      console.log('Response received:', response)
      console.log('Response data size:', response.data.size)
      
      if (response.data.size === 0) {
        throw new Error('El archivo descargado está vacío')
      }
      
      // Crear URL del blob y descargar
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'contactos_corregidos.xlsx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      return { success: true }
    } catch (error) {
      console.error('Error downloading Excel:', error)
      throw error
    }
  }
}

export default api