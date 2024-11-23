import React from 'react'
import { Button as NUIButton } from '@nextui-org/react'

const Button = ({ color = 'primary', variant = 'shadow', className = '', children, ...props }) => {
  return (
    <NUIButton
      color={color}
      variant={variant}
      className={`${defaultClassName} ${className}`}
      {...props}
    >
      {children}
    </NUIButton>
  )
}

export default Button

const defaultClassName = 'py-2.5 px-4 font-semibold text-center rounded-lg'
