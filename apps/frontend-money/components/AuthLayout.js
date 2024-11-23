import React from 'react'

const AuthLayout = ({ children }) => {
  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className="text-5xl font-bold">
            Facilitamos entender tus finanzas, priorizando tu salud financiera.
          </h2>
          <p className="text-2xl">
            Kairo es una herramienta simple que deja lo manual a la tecnología y lo esencial a tu salud financiera.
          </p>
        </div>
      </div>
      <div className={styles.children}>{children}</div>
    </div>
  )
}

export default AuthLayout

const styles = {
  main: 'flex items-center justify-center h-screen text-dark-blue',
  container: 'flex items-center justify-center w-full h-full bg-primary',
  content: 'flex flex-col max-w-2xl px-4 text-white space-y-9',
  children: 'flex items-center justify-center w-full',
}
