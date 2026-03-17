let bounds
let current
let blurElement // blur 요소를 저장할 변수 추가
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

  // 카드 회전 효과
  current.style.transform = `
    scale3d(1.07, 1.07, 1.07)
    rotate3d(
      ${center.y / 100},
      ${-center.x / 100},
      0,
      ${Math.log(distance) * 2}deg
    )
  `

  // blur 요소가 마우스 위치를 따라가도록 업데이트 (중심점 보정 포함)
  if (blurElement) {
    blurElement.style.transform = `translate3d(${leftX - 100}px, ${topY - 100}px, 0)`
  }
}

document.addEventListener('DOMContentLoaded', () => {
  Array.from(cards).forEach((card) => {
    card.addEventListener('mouseenter', () => {
      current = card
      blurElement = card.querySelector('.blur') // 현재 카드의 blur 요소 캐싱
      bounds = card.getBoundingClientRect()
      document.addEventListener('mousemove', mouseMoveEvent)
    })

    card.addEventListener('mouseleave', () => {
      // 위치 초기화 로직을 제거하여 마지막 상태 유지
      document.removeEventListener('mousemove', mouseMoveEvent)
    })
  })
})
