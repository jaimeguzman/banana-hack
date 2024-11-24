import Navbar from './Navbar'
import Sidebar from './Sidebar'
import ProcessHeader from './process/ProcessHeader'
import useAuth from '../hooks/useAuth'

export default function Layout({ children, process }) {
  useAuth()
  return (
    <div className="flex bg-white">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        {process && <ProcessHeader process={process} />}
        <main className="p-4">{children}</main>
      </div>
    </div>
  )
}
