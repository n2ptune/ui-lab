const viewport = document.querySelector('[data-carousel-viewport]')
const slides = Array.from(document.querySelectorAll('[data-slide]'))
const progress = document.querySelector('[data-progress]')
const prevButton = document.querySelector('[data-prev]')
const nextButton = document.querySelector('[data-next]')
const toggleButton = document.querySelector('[data-toggle]')

const state = {
  current: 0,
  target: 0,
  step: 392,
  total: 0,
  activeIndex: -1,
  isDragging: false,
  isPaused: false,
  isHovering: false,
  dragStartX: 0,
  dragStartTarget: 0,
  lastTime: performance.now()
}

const options = {
  parallaxIntensity: 0.4,
  lerp: 0.08,
  autoplaySpeed: 84,
  dragSensitivity: 1.4,
  wheelSensitivity: 1
}

const progressButtons = slides.map((_, index) => {
  const button = document.createElement('button')
  button.type = 'button'
  button.setAttribute('aria-label', `Go to slide ${index + 1}`)
  button.addEventListener('click', () => scrollToIndex(index))
  progress.appendChild(button)
  return button
})

function measure() {
  const slideWidth = slides[0].offsetWidth
  const styles = getComputedStyle(document.documentElement)
  const gap = parseFloat(styles.getPropertyValue('--gap')) || 32
  state.step = slideWidth + gap
  state.total = state.step * slides.length
}

function wrap(value, min, max) {
  const size = max - min
  return ((((value - min) % size) + size) % size) + min
}

function closestLoopTarget(index) {
  const raw = index * state.step
  const delta = wrap(raw - state.target, -state.total / 2, state.total / 2)
  return state.target + delta
}

function scrollToIndex(index) {
  state.target = closestLoopTarget(index)
  state.isPaused = true
  updateToggleState()
}

function updateToggleState() {
  toggleButton.classList.toggle('is-paused', state.isPaused)
  toggleButton.setAttribute(
    'aria-label',
    state.isPaused ? 'Resume autoplay' : 'Pause autoplay'
  )
}

function updateProgress(index) {
  if (index === state.activeIndex) return
  state.activeIndex = index
  progressButtons.forEach((button, buttonIndex) => {
    button.classList.toggle('is-active', buttonIndex === index)
  })
}

function render(time = performance.now()) {
  const deltaSeconds = Math.min((time - state.lastTime) / 1000, 0.05)
  state.lastTime = time

  if (!state.isPaused && !state.isDragging && !state.isHovering) {
    state.target += options.autoplaySpeed * deltaSeconds
  }

  state.current += (state.target - state.current) * options.lerp

  const viewportWidth = viewport.offsetWidth
  let nearestIndex = 0
  let nearestDistance = Infinity

  slides.forEach((slide, index) => {
    const centerOffset = wrap(
      index * state.step - state.current,
      -state.total / 2,
      state.total / 2
    )
    const distanceRatio = Math.min(Math.abs(centerOffset) / viewportWidth, 1)
    const scale = 1 - distanceRatio * 0.12
    const rotate = (centerOffset / viewportWidth) * -5
    const opacity = 1 - distanceRatio * 0.34
    const parallax = centerOffset * -options.parallaxIntensity * 0.28

    slide.style.transform = `translate3d(${centerOffset - slide.offsetWidth / 2}px, 0, 0) scale(${scale}) rotateY(${rotate}deg)`
    slide.style.opacity = opacity.toFixed(3)
    slide.style.zIndex = String(1000 - Math.round(Math.abs(centerOffset)))
    slide.style.setProperty('--parallax', `${parallax}px`)

    if (Math.abs(centerOffset) < nearestDistance) {
      nearestDistance = Math.abs(centerOffset)
      nearestIndex = index
    }
  })

  updateProgress(nearestIndex)
}

function addTicker() {
  if (window.gsap) {
    window.gsap.ticker.add(() => render(performance.now()))
    return
  }

  function frame(time) {
    render(time)
    requestAnimationFrame(frame)
  }

  requestAnimationFrame(frame)
}

function onPointerMove(event) {
  if (!state.isDragging) return
  const diff = state.dragStartX - event.clientX
  state.target = state.dragStartTarget + diff * options.dragSensitivity
}

function onPointerUp() {
  state.isDragging = false
  viewport.classList.remove('is-dragging')
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
}

viewport.addEventListener('pointerdown', (event) => {
  state.isDragging = true
  state.isPaused = true
  state.dragStartX = event.clientX
  state.dragStartTarget = state.target
  viewport.classList.add('is-dragging')
  viewport.setPointerCapture?.(event.pointerId)
  updateToggleState()
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
})

viewport.addEventListener(
  'wheel',
  (event) => {
    event.preventDefault()
    const delta =
      Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ? event.deltaX
        : event.deltaY
    state.target += delta * options.wheelSensitivity
    state.isPaused = true
    updateToggleState()
  },
  { passive: false }
)

viewport.addEventListener('mouseenter', () => {
  state.isHovering = true
})

viewport.addEventListener('mouseleave', () => {
  state.isHovering = false
})

prevButton.addEventListener('click', () => {
  scrollToIndex(
    state.activeIndex - 1 < 0 ? slides.length - 1 : state.activeIndex - 1
  )
})

nextButton.addEventListener('click', () => {
  scrollToIndex((state.activeIndex + 1) % slides.length)
})

toggleButton.addEventListener('click', () => {
  state.isPaused = !state.isPaused
  updateToggleState()
})

window.addEventListener('resize', () => {
  const active = state.activeIndex
  measure()
  state.current = active * state.step
  state.target = state.current
  render()
})

measure()
updateToggleState()
updateProgress(0)
addTicker()
