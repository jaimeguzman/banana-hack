import { useEffect, useState } from 'react'
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js'
import { useRouter } from 'next/router'
import { usePathname } from 'next/navigation'
import toast from 'react-hot-toast'

const useAuth = () => {
  const pathname = usePathname()
  const router = useRouter()

  const userPool = new CognitoUserPool({
    UserPoolId: 'us-west-2_gnmhDvffJ',
    ClientId: '18r4dpgri2k5ds2on24pi9mbpn',
  })

  const [loading, setLoading] = useState(false)

  function signUp(username, email, password) {
    return new Promise((resolve, reject) => {
      setLoading(true)
      userPool.signUp(
        username,
        password,
        [{ Name: 'email', Value: email }],
        null,
        (err, result) => {
          if (err) {
            setLoading(false)
            reject(err)
            toast.error(err?.message ?? 'Error al registrarse')
            return
          }
          setLoading(false)
          resolve(result.user)
          toast.success('Registro exitoso')
        },
      )
    })
  }

  function confirmSignUp(username, code) {
    return new Promise((resolve, reject) => {
      setLoading(true)
      const cognitoUser = new CognitoUser({
        Username: username,
        Pool: userPool,
      })
      cognitoUser.confirmRegistration(code, true, (err, result) => {
        if (err) {
          setLoading(false)
          reject(err)
          toast.error(err?.message ?? 'Error al confirmar el registro')
          return
        }
        setLoading(false)
        resolve(result)
        toast.success('Registro confirmado, inicia sesión')
      })
    })
  }

  function signIn(username, password) {
    return new Promise((resolve, reject) => {
      setLoading(true)
      const authenticationDetails = new AuthenticationDetails({
        Username: username,
        Password: password,
      })
      const cognitoUser = new CognitoUser({
        Username: username,
        Pool: userPool,
      })
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          const idToken = result.getIdToken().getJwtToken()
          cognitoUser.getUserAttributes((err, attributes) => {
            if (err) {
              reject(err)
              return
            }
            const userData = attributes.reduce((acc, attribute) => {
              acc[attribute.Name] = attribute.Value
              return acc
            }, {})
            const sessionData = {
              idToken,
              username: cognitoUser.getUsername(),
              ...userData,
            }
            localStorage.setItem('userSession', JSON.stringify(sessionData))
            resolve(result)
            setLoading(false)
            toast.success('Inicio de sesión exitoso')
            router.push('/')
          })
        },
        onFailure: (err) => {
          setLoading(false)
          toast.error(err?.message ?? 'Error al iniciar sesión')
          reject(err)
        },
      })
    })
  }

  function signOut() {
    const cognitoUser = userPool.getCurrentUser()
    if (cognitoUser) {
      cognitoUser.signOut()
    }
    localStorage.removeItem('userSession')
    toast.success('Has cerrado tu sesión')
    router.push('/login')
  }

  useEffect(() => {
    const authRoutes = ['/login', '/register', '/confirm']
    if (authRoutes.includes(pathname)) {
      return
    }
    const userSession = localStorage.getItem('userSession')
    if (!userSession) {
      const showToast = () => toast.error('Primero debes iniciar sesión')
      const debounceToast = setTimeout(() => {
        showToast()
        router.push('/login')
      }, 100)
      return () => clearTimeout(debounceToast)
    }
  }, [])

  return {
    signUp,
    confirmSignUp,
    signIn,
    signOut,
    loading,
  }
}

export default useAuth
