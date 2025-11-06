'use client'
import { useState } from 'react'

export function TrailerModal() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)} className="text-primary underline">
        Xem trailer
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg p-4 w-[90%] max-w-2xl">
            <iframe
              className="w-full aspect-video rounded-lg"
              src="https://www.youtube.com/embed/u3V5KDHRQvk"
              allowFullScreen
            />
            <button
              onClick={() => setOpen(false)}
              className="mt-4 text-sm text-text-secondary hover:text-primary"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  )
}
