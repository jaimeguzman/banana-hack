import { Fragment, useState } from 'react'
import { Icon } from '@iconify/react'
import { Button } from '@nextui-org/react'
import UserMenu from './UserMenu'
import Link from 'next/link'
import ModalContinue from './modals/ModalContinue'

export default function Navbar() {
  const [modalContinue, setModalContinue] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }
  return (
    <Fragment>
      <nav className="p-4 bg-white shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center mt-1">
            <Link href="/">
              <img src="/logo.png" alt="Logo" className="w-auto h-8 mr-2" />
            </Link>
            <div className="flex items-center gap-3 -mt-[14px] text-[30px]">
              {/* <h4 className="font-bold text-primary">Mejora tu Salud Financiera</h4> */}
              {/* <Icon icon="logos:openai" /> */}
            </div>
          </div>
          <div className="flex items-center">
            <Button
              variant="light"
              className="!p-0 !rounded-3xl"
              isIconOnly
              onClick={() => setModalContinue(true)}
            >
              <Icon icon="ph:bell-duotone" className="text-3xl text-primary" />
            </Button>
            <div className="relative">
              <Button variant="light" className="!p-0 !rounded-3xl" isIconOnly onClick={toggleMenu}>
                <Icon icon="ph:user-circle-gear-duotone" className="text-3xl text-primary" />
              </Button>
              {isMenuOpen && <UserMenu />}
            </div>
          </div>
        </div>
      </nav>
      <ModalContinue visible={modalContinue} setVisible={setModalContinue} />
    </Fragment>
  )
}
