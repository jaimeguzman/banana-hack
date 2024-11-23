import React, { useState } from 'react'
import { Input } from '@nextui-org/react'
import { Icon } from '@iconify/react'
import Button from '../components/ui/Button'
import useAuth from '../hooks/useAuth'
import AuthLayout from '../components/AuthLayout'

/**
 * @component Login
 * @description Componente de inicio de sesión que maneja la autenticación de usuarios
 * @returns {JSX.Element} Formulario de inicio de sesión
 */
const Login = () => {
  const { signIn, loading } = useAuth()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async () => {
    try {
      const { email, password } = form
      await signIn(email, password)
    } catch (error) {
      console.error(error)
    }
  }

  const validate = () => {
    return form.email.includes('@') && form.password.length >= 8
  }

  /**
   * @function handleKeyPress
   * @description Maneja el evento de presionar Enter en el input de contraseña
   * @param {React.KeyboardEvent} event - Evento del teclado
   */
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && validate()) {
      handleLogin()
    }
  }

  return (
    <AuthLayout>
      <div className="flex flex-col items-center max-w-sm gap-6">
        <div className="flex flex-col items-center gap-10">
          <img src="/logo.png" alt="Logo" className="w-auto h-12" />
          <h1 className="text-3xl font-bold text-primary">Iniciar sesión</h1>
        </div>
        <p>Ingresa tus datos para continuar</p>
        <div className="w-full space-y-3">
          <Input
            color="primary"
            variant="bordered"
            placeholder="Correo electrónico"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            color="primary"
            variant="bordered"
            placeholder="Contraseña"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onKeyPress={handleKeyPress}
            endContent={
              <Icon
                icon={showPassword ? 'line-md:watch' : 'line-md:watch-off'}
                onClick={() => setShowPassword(!showPassword)}
                className="text-xl cursor-pointer text-primary"
              />
            }
          />
          <Button
            className="w-full"
            variant="shadow"
            endContent={<Icon icon="line-md:log-in" className="mt-1 text-lg" />}
            onClick={handleLogin}
            isLoading={loading}
            isDisabled={!validate()}
          >
            Ingresar
          </Button>
        </div>
        <p>
          ¿No tienes una cuenta?{' '}
          <a href="/register" className="text-primary">
            Regístrate
          </a>
        </p>
      </div>
    </AuthLayout>
  )
}

export default Login
