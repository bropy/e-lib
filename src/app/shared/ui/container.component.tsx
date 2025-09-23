import { FC, ReactNode } from 'react'

import { cn } from '@heroui/react'

// interface
interface IProps {
  children: ReactNode
  className?: string
  variant?: 'main' | 'section'
}

// component
const ContainerComponent: FC<Readonly<IProps>> = (props) => {
  const { children, className = '', variant = 'main' } = props

  // return
  return (
    <>
      {variant === 'main' ? (
        <main
          className={cn(
            `mx-auto flex min-h-[calc(100vh-60px)] w-full max-w-screen-lg flex-col gap-6 px-4 pt-4 pb-8 md:px-6`,
            className,
          )}
        >
          {children}
        </main>
      ) : (
        <div className={cn(`mx-auto flex w-full max-w-screen-lg flex-col gap-4`, className)}>{children}</div>
      )}
    </>
  )
}

export default ContainerComponent
