import React, { useState } from 'react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import DOMPurify from 'dompurify'
import 'react-quill/dist/quill.snow.css'

/**
 * Sanitiza y valida el contenido HTML
 * @param {string} content - Contenido HTML a sanitizar
 * @returns {string} Contenido HTML sanitizado
 */
const sanitizeContent = (content) => {
  if (!content) return ''
  // Solo se ejecuta en el cliente
  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(content)
  }
  return content
}

/**
 * Componente acordeón para mostrar detalles del trabajo
 * @component
 * @param {Object} props - Propiedades del componente
 */
const JobDetailsAccordion = ({ process }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="overflow-hidden border rounded-lg">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between p-4 transition-colors cursor-pointer bg-gray-20 hover:bg-gray-100"
      >
        <h3 className="mr-2 font-semibold">Recomendaciones financieras</h3>
        {isExpanded ? (
          <FiChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <FiChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </div>

      <div
        className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}
      >
        {/* @TODO: Refactorizar para que sea un solo componente que te muestre si tienes o no tienes fuga de dinero */}
        <div className="p-4 bg-white">
          <p>
            {process.suggestion}
          </p>
        </div>
      </div>
    </div>
  )
}

export default JobDetailsAccordion