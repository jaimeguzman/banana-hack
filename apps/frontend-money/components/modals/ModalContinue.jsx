import React, { Fragment } from 'react'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import { Icon } from '@iconify/react'
import Button from '../ui/Button'

const ModalContinue = ({ visible, setVisible }) => {
  return (
    <Modal isOpen={visible} onOpenChange={setVisible}>
      <ModalContent>
        {(onClose) => (
          <Fragment>
            <ModalHeader className={styles.modal.header}>
              <Icon icon="line-md:alert-circle-loop" className="text-4xl text-primary/90" />
              <h3>¡Has alcanzado el límite gratuito!</h3>
            </ModalHeader>
            <ModalBody className={styles.modal.body}>
              <p>
                Te invitamos a explorar nuestras opciones para seguir disfrutando de{' '}
                <b className="text-primary">Gemma</b>.
              </p>
              <hr />
              <small>
                Si eliges nuestro <span className="text-primary">plan premium</span>, tendrás acceso
                ilimitado a esta y otras funciones avanzadas, diseñadas para que obtengas resultados
                óptimos en menos tiempo.
              </small>
              <hr />
              <small>
                O sino, por cada persona que <span className="text-primary">invites</span> a unirse
                y usar la aplicación, podrás disfrutar de usos adicionales gratuitos.
              </small>
            </ModalBody>
            <ModalFooter className={styles.modal.footer}>
              <Button onClick={onClose}>Planes de pago</Button>
              <Button onClick={onClose}>Invitar contactos</Button>
            </ModalFooter>
          </Fragment>
        )}
      </ModalContent>
    </Modal>
  )
}

export default ModalContinue

const styles = {
  modal: {
    header: 'flex flex-col items-center gap-1 pb-0 text-xl text-dark-blue',
    body: 'flex flex-col text-center gap-2 text-dark-blue',
    footer: 'flex justify-center py-3',
  },
}
