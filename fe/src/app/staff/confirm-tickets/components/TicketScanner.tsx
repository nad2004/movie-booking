'use client'

import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { QrCode, ScanLine, Camera, X, AlertCircle, RotateCw } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser'
import { Booking } from '@/types/booking'
interface TicketScannerProps {
  onScan: (ticketData: Booking) => void
  isLoading?: boolean
}

export function TicketScanner({ onScan, isLoading }: TicketScannerProps) {
  const [ticketCode, setTicketCode] = useState('')
  const [isCameraMode, setIsCameraMode] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([])
  const [selectedCameraId, setSelectedCameraId] = useState<string>('')

  const videoRef = useRef<HTMLVideoElement>(null)
  const readerRef = useRef<BrowserQRCodeReader | null>(null)
  const controlsRef = useRef<IScannerControls | null>(null)

  // Initialize ZXing Reader
  useEffect(() => {
    readerRef.current = new BrowserQRCodeReader()
    return () => {
      stopCamera()
    }
  }, [])

  // Get available cameras
  const getCameras = async () => {
    try {
      const devices = await BrowserQRCodeReader.listVideoInputDevices()
      setAvailableCameras(devices)

      // Tự động chọn camera sau (back camera) nếu có
      const backCamera = devices.find(
        device =>
          device.label.toLowerCase().includes('back') ||
          device.label.toLowerCase().includes('rear') ||
          device.label.toLowerCase().includes('environment')
      )

      setSelectedCameraId(backCamera?.deviceId || devices[0]?.deviceId || '')

      return devices
    } catch (error) {
      console.error('Error getting cameras:', error)
      setCameraError('Không thể truy cập danh sách camera')
      return []
    }
  }

  // Start camera scanning
  const startCamera = async () => {
    await setIsCameraMode(true)
    if (!readerRef.current || !videoRef.current) return
    setIsInitializing(true)
    setCameraError(null)
    try {
      // Get cameras nếu chưa có
      if (availableCameras.length === 0) {
        const cameras = await getCameras()
        if (cameras.length === 0) {
          setCameraError('Không tìm thấy camera trên thiết bị')
          setIsInitializing(false)
          return
        }
      }
      // Start decoding from video device
      const controls = await readerRef.current.decodeFromVideoDevice(
        selectedCameraId || undefined, 
        videoRef.current,
        (result, error) => {
          if (result) {
            // Scan success
            const scannedText = result.getText()
            const ticketData = JSON.parse(scannedText);
            console.log('QR Code detected:', ticketData)
            onScan(ticketData)
            stopCamera() // Tự động dừng sau khi quét xong
          }
          // Error callback được gọi liên tục khi không phát hiện QR
          // Chỉ log lỗi thực sự, không log "not found"
          if (error) {
            const isNotFound =
              error.name === 'NotFoundException' || error.message?.includes('NotFound')

            if (!isNotFound) {
              // Đây mới là lỗi thực sự cần quan tâm (ví dụ: mất quyền camera)
              console.warn('Decode error:', error)
            }
          }
        }
      )
      controlsRef.current = controls
      setIsCameraMode(true)
    } catch (error: any) {
      console.error('Camera error:', error)
      // Parse error messages
      if (error.name === 'NotAllowedError') {
        setCameraError('Quyền truy cập camera bị từ chối. Vui lòng cho phép truy cập.')
      } else if (error.name === 'NotFoundError') {
        setCameraError('Không tìm thấy camera trên thiết bị.')
      } else if (error.name === 'NotReadableError') {
        setCameraError('Camera đang được sử dụng bởi ứng dụng khác.')
      } else if (error.name === 'OverconstrainedError') {
        setCameraError('Không thể khởi tạo camera với cấu hình này.')
      } else {
        setCameraError('Lỗi khi khởi động camera. Vui lòng thử lại.')
      }
    } finally {
      setIsInitializing(false)
    }
  }
  // Stop camera
  const stopCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.stop()
      controlsRef.current = null
    }
    setIsCameraMode(false)
  }

  // Switch camera
  const switchCamera = async () => {
    if (availableCameras.length <= 1) return

    const currentIndex = availableCameras.findIndex(cam => cam.deviceId === selectedCameraId)
    const nextIndex = (currentIndex + 1) % availableCameras.length
    const nextCamera = availableCameras[nextIndex]

    setSelectedCameraId(nextCamera.deviceId)

    // Restart với camera mới
    stopCamera()

    // Đợi một chút để đảm bảo camera cũ đã stop
    setTimeout(() => {
      startCamera()
    }, 300)
  }

  // Handle manual input
  const handleManualScan = async () => {
    if (ticketCode.trim()) {
      onScan(ticketCode)
      setTicketCode('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && ticketCode.trim()) {
      handleManualScan()
    }
  }

  return (
    <Card className="p-6 border border-border rounded-[10px] shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-[10px] flex items-center justify-center">
            <QrCode className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-foreground">Quét mã QR</h3>
            <p className="text-sm text-muted-foreground">
              {isCameraMode ? 'Đang quét bằng camera' : 'Quét mã vé của khách hàng'}
            </p>
          </div>
        </div>

        {isCameraMode && (
          <div className="flex gap-2">
            {availableCameras.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={switchCamera}
                className="rounded-[10px]"
                title="Chuyển camera"
              >
                <RotateCw className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={stopCamera}
              className="rounded-full"
              title="Đóng camera"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Camera Error Alert */}
      {cameraError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{cameraError}</AlertDescription>
        </Alert>
      )}

      {/* QR Scan Area */}
      <div className="mb-6">
        {!isCameraMode ? (
          // Placeholder khi chưa bật camera
          <div className="aspect-square bg-linear-to-br from-primary/5 to-primary/10 rounded-[10px] flex flex-col items-center justify-center border-2 border-dashed border-primary/30">
            <ScanLine className="w-16 h-16 text-primary/60 mb-4 animate-pulse" />
            <p className="text-foreground mb-2 font-medium">Quét mã QR với camera</p>
            <p className="text-sm text-muted-foreground mb-4">hoặc nhập mã thủ công bên dưới</p>
            <Button
              onClick={startCamera}
              disabled={isInitializing || isLoading}
              className="bg-primary hover:bg-primary/90 text-white rounded-[10px]"
            >
              <Camera className="w-4 h-4 mr-2" />
              {isInitializing ? 'Đang khởi động...' : 'Bật Camera'}
            </Button>
          </div>
        ) : (
          // Camera Scanner
          <div className="relative rounded-[10px] overflow-hidden bg-black aspect-square">
            <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />

            {/* Scan frame overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Corners */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64">
                {/* Top-left corner */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                {/* Top-right corner */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                {/* Bottom-left corner */}
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                {/* Bottom-right corner */}
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />

                {/* Scanning line animation */}
                <div className="absolute inset-x-0 top-0 h-1 bg-primary/80 animate-scan-line" />
              </div>
            </div>

            {/* Instructions overlay */}
            <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
              <div className="inline-block bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                Hướng mã QR vào khung hình
              </div>
            </div>

            {/* Camera info */}
            {availableCameras.length > 1 && (
              <div className="absolute top-4 left-0 right-0 text-center pointer-events-none">
                <div className="inline-block bg-black/70 text-white px-3 py-1 rounded-full text-xs">
                  {availableCameras.find(cam => cam.deviceId === selectedCameraId)?.label ||
                    'Camera'}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Manual Input */}
      {!isCameraMode && (
        <div className="space-y-3">
          <label className="text-sm text-muted-foreground">Hoặc nhập mã vé thủ công:</label>
          <Input
            value={ticketCode}
            onChange={e => setTicketCode(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập mã vé (VD: VE123456789)"
            className="rounded-[10px]"
            disabled={isLoading}
          />
          <Button
            onClick={handleManualScan}
            disabled={!ticketCode.trim() || isLoading}
            className="w-full bg-primary hover:bg-primary-hover text-primary-foreground rounded-[10px] shadow-md shadow-primary/20"
          >
            {isLoading ? 'Đang kiểm tra...' : 'Kiểm tra vé'}
          </Button>
        </div>
      )}
    </Card>
  )
}
