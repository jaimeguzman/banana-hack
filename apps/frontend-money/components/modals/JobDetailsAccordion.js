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
 * @param {string} props.jobFunctions - HTML con las funciones del trabajo
 * @param {string} props.jobRequirements - HTML con los requerimientos del trabajo
 */
const JobDetailsAccordion = ({ jobFunctions, jobRequirements }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="overflow-hidden border rounded-lg">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between px-4 py-2 transition-colors cursor-pointer bg-gray-20 hover:bg-gray-100"
      >
        <h3 className="mr-2 font-semibold">Recomendaciones o Consideraciones</h3>
        {isExpanded ? (
          <FiChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <FiChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </div>

      <div
        className={`transition-all duration-200 ease-in-out ${
          isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-4 py-2 bg-white">
          <div className="mb-2">
            <h4 className="mb-1 font-semibold text-gray-700 text-md">Funciones del Cargo</h4>
            <div
              className="ql-editor !p-0"
              dangerouslySetInnerHTML={{
                __html: sanitizeContent(jobFunctions) || 'No se han especificado funciones.',
              }}
            />
          </div>

          <div>
            <h4 className="mb-1 font-semibold text-gray-700 text-md">Requerimientos del Cargo</h4>
            <div
              className="ql-editor !p-0"
              dangerouslySetInnerHTML={{
                __html:
                  sanitizeContent(jobRequirements) || 'No se han especificado requerimientos.',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDetailsAccordion
