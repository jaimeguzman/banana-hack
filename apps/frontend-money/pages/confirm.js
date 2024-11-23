import React, { useState } from 'react'
import { Input } from '@nextui-org/react'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation'
import Button from '../components/ui/Button'
import useAuth from '../hooks/useAuth'
import AuthLayout from '../components/AuthLayout'

const Register = () => {
  const router = useRouter()

  const { confirmSignUp, loading } = useAuth()

  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  const [form, setForm] = useState({
    code: '',
  })

  const handleConfirmSignUp = async () => {
    try {
      const { code } = form
      await confirmSignUp(email, code)
      router.push('/login')
    } catch (error) {
      console.error(error)
    }
  }

  const validate = () => {
    return form.code >= 6
  }

  return (
    <AuthLayout>
      <div className="flex flex-col items-center max-w-xs gap-6 text-center">
        <h1 className="text-3xl font-bold text-primary">Confirmar cuenta</h1>
        <p>Introduce el código de confirmación que ha sido enviado a tu correo 📧</p>
        <div className="w-full space-y-3">
          <Input
            color="primary"
            variant="bordered"
            placeholder="Código de verificación"
            type="number"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />
          <Button
            className="w-full"
            variant="shadow"
            endContent={<Icon icon="line-md:log-in" className="mt-1 text-lg" />}
            onClick={handleConfirmSignUp}
            isLoading={loading}
            isDisabled={!validate()}
          >
            Confirmar
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
