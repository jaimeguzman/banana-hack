import Navbar from './Navbar'
import Sidebar from './Sidebar'
import ProcessHeader from './process/ProcessHeader'
import useAuth from '../hooks/useAuth'
import { useRouter } from 'next/router'
import Logo from './Logo'

export default function Layout({ children, process }) {
  useAuth()
  const router = useRouter()
  const isHomePage = router.pathname === '/'

  return (
    <div className="flex bg-white">
      {isHomePage ? (
        <div className="w-92 py-4 px-4">
          <Logo />
        </div>
      ) : (
        <Sidebar />
      )}
      <div className="flex-1">
        <Navbar />
        {process && <ProcessHeader process={process} />}
        <main className="p-4">{children}</main>
      </div>
    </div>
  )
}
