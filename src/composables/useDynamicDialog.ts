import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions'
import { useDialog } from 'primevue/usedialog'
import { type Component, markRaw, ref } from 'vue'
import DynamicDialogContent from '@/components/DynamicDialogContent.vue'
import DynamicDialogFooter from '@/components/DynamicDialogFooter.vue'
import DynamicDialogHeader from '@/components/DynamicDialogHeader.vue'

type MessageText = {
  message: string
}

type MessageComponent = {
  messageComponent: Component
  messageProps?: Record<string, unknown>
}

export type DynamicDialogData = {
  header: string
  confirmLabel: string
  cancelLabel?: string
  severity?: 'danger' | 'warn' | 'info' | 'primary'
  isDelete?: boolean
  cancelOnly?: boolean
  headerIcon?: string
  headerIconClass?: string
  list?: string[]
  listOf?: string
} & (MessageText | MessageComponent)

export function useDynamicDialog() {
  const dialog = useDialog()
  const dialogRef = ref<DynamicDialogInstance>()
  const isConfirming = ref(false)

  const closeDialog = () => {
    dialogRef.value?.close()
  }

  const openDialog = ({
    data,
    onConfirm,
    onCancel,
    dialogProps,
  }: {
    data: DynamicDialogData
    onConfirm: () => void | Promise<void>
    onCancel?: () => void
    dialogProps?: Record<string, unknown>
  }) => {
    isConfirming.value = false

    const guardedConfirm = async () => {
      if (isConfirming.value) return
      isConfirming.value = true
      try {
        await onConfirm()
      } finally {
        isConfirming.value = false
      }
    }

    dialogRef.value = dialog.open(DynamicDialogContent, {
      props: {
        closable: false,
        draggable: false,
        modal: true,
        ...dialogProps,
      },
      templates: {
        header: markRaw(DynamicDialogHeader),
        footer: markRaw(DynamicDialogFooter),
      },
      data: { ...data, isConfirming },
      emits: {
        onConfirm: guardedConfirm,
        onCancel: onCancel ?? closeDialog,
      },
    })
  }

  return {
    openDialog,
    closeDialog,
    isConfirming,
  }
}
