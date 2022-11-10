let bounds
let current
const cards = document.querySelectorAll('.cards .card')

function mouseMoveEvent(e) {
  const mouseX = e.clientX
  const mouseY = e.clientY
  const leftX = mouseX - bounds.x
  const topY = mouseY - bounds.y
  const center = {
    x: leftX - bounds.width / 2,
    y: topY - bounds.height / 2
  }
  const distance = Math.sqrt(center.x ** 2 + center.y ** 2)

  current.style.transform = `
    scale3d(1.07, 1.07, 1.07)
    rotate3d(
      ${center.y / 100},
      ${-center.x / 100},
      0,
      ${Math.log(distance) * 2}deg
    )
  `
}

document.addEventListener('DOMContentLoaded', () => {
  Array.from(cards).forEach((card) => {
    card.addEventListener('mouseenter', () => {
      current = card
      bounds = card.getBoundingClientRect()
      document.addEventListener('mousemove', mouseMoveEvent)
    })

    card.addEventListener('mouseleave', () => {
      current.style.transform = ''
      current = null
      document.removeEventListener('mousemove', mouseMoveEvent)
    })
  })
})
