import React, { useState } from 'react'
import { Checkbox, Input } from '@nextui-org/react'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/router'
import Button from '../components/ui/Button'
import useAuth from '../hooks/useAuth'
import AuthLayout from '../components/AuthLayout'

const Register = () => {
  const router = useRouter()

  const { signUp, loading } = useAuth()

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [showPassword, setShowPassword] = useState(false)

  const handleSignUp = async () => {
    try {
      const { email, password } = form
      await signUp(email, email, password)
      router.push(`/confirm?email=${email}`)
    } catch (error) {
      console.error(error)
    }
  }

  const validate = () => {
    return (
      form.email.includes('@') &&
      form.password === form.confirmPassword &&
      form.password.length >= 8
    )
  }

  return (
    <AuthLayout>
      <div className="flex flex-col items-center max-w-xs gap-6">
        <h1 className="text-3xl font-bold text-primary">Registrarse</h1>
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
            endContent={
              <Icon
                icon={showPassword ? 'line-md:watch' : 'line-md:watch-off'}
                onClick={() => setShowPassword(!showPassword)}
                className="text-xl cursor-pointer text-primary"
              />
            }
          />
          <Input
            color="primary"
            variant="bordered"
            placeholder="Confirmar contraseña"
            type={showPassword ? 'text' : 'password'}
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            endContent={
              <Icon
                icon={showPassword ? 'line-md:watch' : 'line-md:watch-off'}
                onClick={() => setShowPassword(!showPassword)}
                className="text-xl cursor-pointer text-primary"
              />
            }
          />
          <Checkbox color="primary" defaultSelected>
            <small className="text-dark-blue">Quiero recibir las últimas novedades</small>
          </Checkbox>
          <Button
            className="w-full"
            variant="shadow"
            endContent={<Icon icon="line-md:log-in" className="mt-1 text-lg" />}
            onClick={handleSignUp}
            isLoading={loading}
            isDisabled={!validate()}
          >
            Registrarme
          </Button>
        </div>
        <p>
          ¿Ya posees una cuenta?{' '}
          <a href="/login" className="text-primary">
            Ingresar
          </a>
        </p>
      </div>
    </AuthLayout>
  )
}

export default Register
