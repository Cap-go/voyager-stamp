interface OpenInputOptions {
  capture: boolean
}

function openFileInput({ capture }: OpenInputOptions): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    if (capture) input.capture = 'environment'

    let settled = false
    const settle = (file: File | null) => {
      if (settled) return
      settled = true
      resolve(file)
    }

    input.addEventListener('change', () => settle(input.files?.[0] ?? null))
    input.addEventListener('cancel', () => settle(null))

    input.click()
  })
}

export function capturePhoto(): Promise<File | null> {
  return openFileInput({ capture: true })
}

export function pickFromGallery(): Promise<File | null> {
  return openFileInput({ capture: false })
}
