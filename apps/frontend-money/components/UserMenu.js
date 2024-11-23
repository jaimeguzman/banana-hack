import Link from 'next/link'
import { useState } from 'react'
import { FaUser, FaBug, FaLightbulb, FaSignOutAlt, FaMoon, FaSun } from 'react-icons/fa'
import useAuth from '../hooks/useAuth'
import { motion } from 'framer-motion'

const UserMenu = () => {
  const { signOut } = useAuth()

  const user = JSON.parse(localStorage.getItem('userSession'))

  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    // TODO: Implementar la lógica para cambiar el tema de la aplicación
  }

  const handleLogout = () => {
    signOut()
  }

  return (
    <motion.div
      className="absolute right-0 z-20 w-48 py-1 mt-2 bg-white border rounded-md shadow-lg text-dark-blue border-primary/10 shadow-primary/20"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.33 }}
    >
      <Link
        href="/profile"
        className="flex items-center px-4 py-2 text-sm font-semibold truncate hover:bg-gray-100"
      >
        <FaUser className="mr-3 text-primary" />
        {user?.email?.split('@')?.[0] ?? 'Perfil'}
      </Link>
      <Link href="/report-error" className="flex items-center px-4 py-2 text-sm hover:bg-gray-100">
        <FaBug className="mr-3 text-primary" />
        Reportar error
      </Link>
      <Link href="/suggest" className="flex items-center px-4 py-2 text-sm hover:bg-gray-100">
        <FaLightbulb className="mr-3 text-primary" />
        Enviar sugerencia
      </Link>
      <button
        onClick={handleLogout}
        className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
      >
        <FaSignOutAlt className="mr-3" />
        Cerrar sesión
      </button>
      <div className="my-1 border-t border-gray-100"></div>
      <button
        onClick={toggleDarkMode}
        className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
      >
        {darkMode ? <FaSun className="mr-3" /> : <FaMoon className="mr-3" />}
        Modo {darkMode ? 'claro' : 'oscuro'}
      </button>
    </motion.div>
  )
}

export default UserMenu
