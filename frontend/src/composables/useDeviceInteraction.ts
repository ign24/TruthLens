import { ref, onMounted, onUnmounted } from 'vue'

export function useDeviceInteraction() {
  const isMobile = ref(false)
  const isHoverEnabled = ref(false)

  // Detectar si el dispositivo es móvil
  const checkMobile = () => {
    // Usar múltiples métodos de detección
    const userAgent = navigator.userAgent.toLowerCase()
    const mobileKeywords = [
      'android',
      'iphone',
      'ipad',
      'ipod',
      'windows phone',
      'mobile'
    ]
    
    // Detectar por user agent
    const isMobileByUA = mobileKeywords.some(keyword => userAgent.includes(keyword))
    
    // Detectar por tamaño de pantalla
    const isMobileByScreen = window.innerWidth <= 768
    
    // Detectar por capacidad de hover
    const hasHover = window.matchMedia('(hover: hover)').matches
    
    isMobile.value = isMobileByUA || isMobileByScreen
    isHoverEnabled.value = hasHover && !isMobile.value
  }

  // Manejar interacciones
  const handleInteraction = (
    element: HTMLElement,
    onEnter: () => void,
    onLeave: () => void
  ) => {
    let isActive = false
    let touchTimeout: number | null = null

    const handleEnter = () => {
      if (touchTimeout) {
        clearTimeout(touchTimeout)
        touchTimeout = null
      }
      isActive = true
      onEnter()
    }

    const handleLeave = () => {
      if (touchTimeout) {
        clearTimeout(touchTimeout)
        touchTimeout = null
      }
      isActive = false
      onLeave()
    }

    if (isHoverEnabled.value) {
      // Desktop: usar hover
      element.addEventListener('mouseenter', handleEnter)
      element.addEventListener('mouseleave', handleLeave)
    } else {
      // Mobile: usar tap
      element.addEventListener('touchstart', (e) => {
        e.preventDefault()
        if (isActive) {
          handleLeave()
        } else {
          handleEnter()
        }
      }, { passive: false })

      // Cerrar al hacer tap fuera
      const handleClickOutside = (event: MouseEvent | TouchEvent) => {
        const target = event.target as Node
        if (!element.contains(target) && isActive) {
          handleLeave()
        }
      }

      document.addEventListener('touchstart', handleClickOutside)
      document.addEventListener('click', handleClickOutside)

      // Limpiar event listeners
      onUnmounted(() => {
        document.removeEventListener('touchstart', handleClickOutside)
        document.removeEventListener('click', handleClickOutside)
        if (touchTimeout) {
          clearTimeout(touchTimeout)
        }
      })
    }
  }

  onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
    window.addEventListener('orientationchange', checkMobile)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
    window.removeEventListener('orientationchange', checkMobile)
  })

  return {
    isMobile,
    isHoverEnabled,
    handleInteraction
  }
} 