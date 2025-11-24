
import { Button } from '@/components/ui/button'
interface TrailerModalProps {
  setShowTrailer: (show: boolean) => void
  showTrailer: boolean
}

export function TrailerModal({ setShowTrailer, showTrailer }: TrailerModalProps) {
  return (
    <>
      <button onClick={() => setShowTrailer(!showTrailer)} className="text-primary underline">
        Xem trailer
      </button>
      {showTrailer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-surface rounded-xl overflow-hidden w-full max-w-3xl shadow-lg animate-fadeIn">
              <iframe
                src="https://www.youtube.com/embed/h9Q4zZS2v1k"
                title="Trailer"
                className="w-full aspect-video"
                allowFullScreen
              />
              <div className="p-3 flex justify-end border-t border-border bg-secondary">
                <Button variant="outline" className="text-sm" onClick={() => setShowTrailer(false)}>
                  Đóng
                </Button>
              </div>
            </div>
          </div>
      )}
    </>
  )
}
