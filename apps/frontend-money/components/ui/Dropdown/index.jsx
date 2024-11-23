import React from 'react'
import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Dropdown as NUIDropdown,
} from '@nextui-org/react'
import { Icon } from '@iconify/react'

const Dropdown = ({ items = [] }) => {
  return (
    <NUIDropdown>
      <DropdownTrigger>
        <Button variant="light" className="rounded-3xl" isIconOnly size="sm">
          <Icon icon="entypo:dots-three-vertical" className="text-xl text-neutral-600" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu color="primary" aria-label="dropdown">
        {items.map((item) => {
          if (item?.visible === false) return null
          return (
            <DropdownItem onClick={() => item.onClick()} key={item.key}>
              {item.label}
            </DropdownItem>
          )
        })}
      </DropdownMenu>
    </NUIDropdown>
  )
}

export default Dropdown
