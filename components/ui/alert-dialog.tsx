'use client'

import * as React from 'react'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

// Root Component
const AlertDialog = ({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) => {
  return (
    <AlertDialogPrimitive.Root
      data-slot="alert-dialog-root"
      {...props}
    />
  )
}

// Trigger
const AlertDialogTrigger = ({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) => {
  return (
    <AlertDialogPrimitive.Trigger
      data-slot="alert-dialog-trigger"
      {...props}
    />
  )
}

// Portal Wrapper
const AlertDialogPortal = ({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) => {
  return (
    <AlertDialogPrimitive.Portal
      data-slot="alert-dialog-portal"
      {...props}
    />
  )
}

// Overlay
const AlertDialogOverlay = ({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) => {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-black/50',
        'data-[state=open]:animate-in data-[state=open]:fade-in-0',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
        className
      )}
      {...props}
    />
  )
}

// Content
const AlertDialogContent = ({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) => {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          'fixed top-1/2 left-1/2 z-50 w-full max-w-[calc(100%-2rem)]',
          'translate-x-[-50%] translate-y-[-50%]',
          'grid gap-4 rounded-lg border p-6 shadow-lg bg-background',
          'duration-200 sm:max-w-lg',
          'data-[state=open]:animate-in data-[state=open]:zoom-in-95',
          'data-[state=closed]:animate-out data-[state=closed]:zoom-out-95',
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  )
}

// Header
const AlertDialogHeader = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(
        'flex flex-col gap-2 text-center sm:text-left',
        className
      )}
      {...props}
    />
  )
}

// Footer
const AlertDialogFooter = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        className
      )}
      {...props}
    />
  )
}

// Title
const AlertDialogTitle = ({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) => {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn('text-lg font-semibold', className)}
      {...props}
    />
  )
}

// Description
const AlertDialogDescription = ({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) => {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn(
        'text-sm text-muted-foreground',
        className
      )}
      {...props}
    />
  )
}

// Action Button
const AlertDialogAction = ({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) => {
  return (
    <AlertDialogPrimitive.Action
      className={cn(buttonVariants(), className)}
      {...props}
    />
  )
}

// Cancel Button
const AlertDialogCancel = ({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) => {
  return (
    <AlertDialogPrimitive.Cancel
      className={cn(
        buttonVariants({ variant: 'outline' }),
        className
      )}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}