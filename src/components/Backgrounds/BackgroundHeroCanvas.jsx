import { useEffect, useRef, useState } from 'react'

export function BackgroundHeroCanvas () {
  const canvasRef = useRef(null)
  const [canvasSize, setCanvasSize] = useState({
    width: null,
    height: null
  })
  const idTimeoutRef = useRef(null)

  useEffect(() => {
    let idTimeout = idTimeoutRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let { width, height } = canvasSize

    width = (canvas.width = window.innerWidth)
    height = (canvas.height = window.innerHeight)

    const colors = [
      ['#004e92', '#000428'],
      ['#00C9FF', '#92FE9D'],
      ['#e0f7f4', '#a3e9ff']
    ]

    const shadow = {
      colors: [
        { r: 0, g: 201, b: 255, a: 0.7 },
        { r: 0, g: 78, b: 146, a: 0.7 },
        { r: 224, g: 247, b: 244, a: 0.7 }
      ],
      blur: 10,
      spread: 10,
      x: 0,
      y: 0
    }

    const particles = Array.from({ length: 10 }, () => {
      const duration = Math.random() * 20 + 50 // 50s - 70s
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        r: 15,
        scale: 0,
        speed: height / (duration * 60), // speed per frame
        duration,
        colorIndex: Math.floor(Math.random() * colors.length),
        shadowIndex: Math.floor(Math.random() * shadow.colors.length)
      }
    })

    function createRadialGradient (x0, y0, r0 = 0, x1, y2, r2, color1, color2) {
      const gradient = ctx.createRadialGradient(x0, y0, r0, x1, y2, r2)
      gradient.addColorStop(0, color1)
      gradient.addColorStop(1, color2)
      return gradient
    }

    function drawCircleWithShadow (x, y, baseRadius, startAngle, endAngle, ctx, shadowColorIndex) {
      for (let i = 0; i < 3; i++) {
        const subtractAlpha = 0.2 * i
        const plusblur = 15 * i
        const spread = 4 * i
        const radius = baseRadius + spread

        ctx.beginPath()
        ctx.arc(x, y, radius, startAngle, endAngle)
        ctx.shadowColor = `rgba(
          ${shadow.colors[shadowColorIndex].r},
          ${shadow.colors[shadowColorIndex].g},
          ${shadow.colors[shadowColorIndex].b},
          ${shadow.colors[shadowColorIndex].a - subtractAlpha})`
        ctx.shadowBlur = shadow.blur + plusblur// Difuminado de la sombra
        ctx.shadowOffsetX = shadow.x // Desplazamiento horizontal
        ctx.shadowOffsetY = shadow.y
        ctx.fill()
        ctx.closePath()
      }
    }

    function draw () {
      ctx.clearRect(0, 0, width, height)

      particles.forEach(p => {
        p.y -= p.speed
        p.scale = Math.max(0, 1 - p.y / height)

        // reset if off screen
        if (p.y + p.r < -30) {
          p.y = height + Math.random() * 30
          p.x = Math.random() * width
          p.scale = 0
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, Math.abs(p.r * p.scale), 0, Math.PI * 2)
        ctx.fillStyle = createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.r,
          colors[p.colorIndex][0],
          colors[p.colorIndex][1]
        )
        ctx.fill()
        ctx.closePath()
        drawCircleWithShadow(
          p.x,
          p.y,
          Math.abs(p.r * p.scale),
          0,
          Math.PI * 2,
          ctx,
          p.colorIndex)
      })

      requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      clearTimeout(idTimeout)
      idTimeout = setTimeout(() => {
        setCanvasSize({
          width: canvas.width = window.innerWidth,
          height: canvas.height = window.innerHeight
        })
      }, 100)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [canvasSize])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        maxWidth: '100%',
        width: '100vw',
        height: '100vh',
        zIndex: -9999,
        background: 'radial-gradient(circle, #111117 0%, rgba(17, 17, 23, 0) 100%)',
        overflow: 'hidden'
      }}
    />
  )
}
