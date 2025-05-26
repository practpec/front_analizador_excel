import { useState } from 'react'
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react'
import { contactsApi } from '../services/api'
import toast from 'react-hot-toast'

// Página principal para cargar archivos Excel
function HomePage() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStats, setUploadStats] = useState(null)

  // Manejar selección de archivo
  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && 
          file.type !== 'application/vnd.ms-excel') {
        toast.error('Por favor selecciona un archivo Excel válido (.xlsx o .xls)')
        return
      }
      setSelectedFile(file)
      setUploadStats(null)
    }
  }

  // Subir archivo al backend
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Por favor selecciona un archivo')
      return
    }

    setIsUploading(true)
    try {
      const result = await contactsApi.uploadExcel(selectedFile)
      setUploadStats(result)
      toast.success('Archivo cargado exitosamente')
      setSelectedFile(null)
      // Reset input file
      document.getElementById('fileInput').value = ''
    } catch (error) {
      toast.error('Error al cargar el archivo: ' + (error.response?.data?.error || error.message))
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Analizador Léxico de Excel
        </h1>
       
      </div>

      {/* Validation Rules */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          Reglas de Validación
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <strong>Clave Cliente:</strong> Solo números, sin letras ni caracteres especiales
          </div>
          <div>
            <strong>Nombre:</strong> Solo letras y espacios, sin números
          </div>
          <div>
            <strong>Correo:</strong> Dominios reconocidos (gmail.com, yahoo.com, hotmail.com, etc.)
          </div>
          <div>
            <strong>Teléfono:</strong> 10 dígitos con lada de Chiapas (961, 962, 963, 964, 965, 966, 967, 968, 994)
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Cargar Archivo Excel
        </h2>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          
          <input
            id="fileInput"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <label
            htmlFor="fileInput"
            className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            Seleccionar Archivo Excel
          </label>
          
          <p className="text-gray-500 mt-2">
            Formatos soportados: .xlsx, .xls
          </p>
        </div>

        {selectedFile && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUploading ? 'Subiendo...' : 'Subir Archivo'}
              </button>
            </div>
          </div>
        )}

        {uploadStats && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Archivo cargado exitosamente
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>{uploadStats.message}</p>
                  <p>Registros procesados: {uploadStats.count}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Next Steps */}
      {uploadStats && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Siguientes Pasos
          </h3>
          <div className="space-y-3">
            <a
              href="/contacts"
              className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-blue-600">Ver Contactos</div>
              <div className="text-sm text-gray-500">
                Revisa todos los contactos cargados y busca registros específicos
              </div>
            </a>
            <a
              href="/validation"
              className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-blue-600">Validar Datos</div>
              <div className="text-sm text-gray-500">
                Analiza los errores encontrados y corrige los datos inválidos
              </div>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage