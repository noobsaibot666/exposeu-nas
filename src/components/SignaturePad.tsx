import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import './SignaturePad.css'

export interface SignaturePadHandle {
  clear: () => void
  isEmpty: () => boolean
  toDataURL: () => string | null
}

interface SignaturePadProps {
  onChange?: (hasSignature: boolean) => void
  strokeColor?: string
}

const SignaturePad = forwardRef<SignaturePadHandle, SignaturePadProps>(function SignaturePad(
  { onChange, strokeColor = '#f5f5f4' },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const drawingRef = useRef(false)
  const hasSignatureRef = useRef(false)
  const lastPointRef = useRef<{ x: number; y: number } | null>(null)
  const [isEmpty, setIsEmpty] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1)
      const { width, height } = canvas.getBoundingClientRect()
      if (width === 0 || height === 0) return

      const preserved = hasSignatureRef.current ? canvas.toDataURL('image/png') : null
      canvas.width = width * ratio
      canvas.height = height * ratio

      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.scale(ratio, ratio)
      ctx.lineWidth = 2.5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.strokeStyle = strokeColor

      if (preserved) {
        const img = new Image()
        img.onload = () => ctx.drawImage(img, 0, 0, width, height)
        img.src = preserved
      }
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx) ctx.strokeStyle = strokeColor
  }, [strokeColor])

  const getPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.setPointerCapture(e.pointerId)
    drawingRef.current = true
    lastPointRef.current = getPoint(e)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return
    const ctx = canvasRef.current?.getContext('2d')
    const last = lastPointRef.current
    if (!ctx || !last) return

    const point = getPoint(e)
    ctx.beginPath()
    ctx.moveTo(last.x, last.y)
    ctx.lineTo(point.x, point.y)
    ctx.stroke()
    lastPointRef.current = point

    if (!hasSignatureRef.current) {
      hasSignatureRef.current = true
      setIsEmpty(false)
      onChange?.(true)
    }
  }

  const endStroke = () => {
    drawingRef.current = false
    lastPointRef.current = null
  }

  const clear = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    hasSignatureRef.current = false
    setIsEmpty(true)
    onChange?.(false)
  }

  useImperativeHandle(ref, () => ({
    clear,
    isEmpty: () => !hasSignatureRef.current,
    toDataURL: () => (hasSignatureRef.current ? (canvasRef.current?.toDataURL('image/png') ?? null) : null),
  }))

  return (
    <div className={`signature-pad ${isEmpty ? 'signature-pad--empty' : ''}`}>
      <canvas
        ref={canvasRef}
        className="signature-pad__canvas"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endStroke}
        onPointerLeave={endStroke}
        onPointerCancel={endStroke}
      />
      {isEmpty && <span className="signature-pad__hint">Sign here with your finger</span>}
    </div>
  )
})

export default SignaturePad
