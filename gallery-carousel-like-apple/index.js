const container = document.querySelector('.gallery-container')
const items = document.querySelectorAll('.gallery-item')
const dots = document.querySelectorAll('.nav-dot')
const playPauseBtn = document.querySelector('.play-pause-btn')
const playIcon = document.querySelector('.play-icon')
const pauseIcon = document.querySelector('.pause-icon')

let isPlaying = false
let autoplayTimer = null
let currentIndex = 0

// IntersectionObserver 설정
// 중앙에 가까울 때만 상태를 업데이트하기 위해 threshold 상향
const observerOptions = {
  root: container,
  threshold: 0.7
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    // entry.isIntersecting이 참일 때만 해당 인덱스로 업데이트
    if (entry.isIntersecting) {
      const index = Array.from(items).indexOf(entry.target)
      currentIndex = index
      updateActiveState(index)
    }
  })
}, observerOptions)

// 모든 아이템 관찰 시작
items.forEach((item) => observer.observe(item))

function updateActiveState(index) {
  // 모든 활성 상태 제거
  items.forEach((item) => item.classList.remove('active'))
  dots.forEach((dot) => dot.classList.remove('active'))

  // 현재 인덱스 활성화
  if (items[index]) items[index].classList.add('active')
  if (dots[index]) dots[index].classList.add('active')
}

// 특정 인덱스로 스크롤 이동
function scrollToItem(index) {
  const targetItem = items[index]
  // 컨테이너 내에서의 상대적 위치 계산
  const containerRect = container.getBoundingClientRect()
  const itemRect = targetItem.getBoundingClientRect()
  
  // 아이템의 중앙을 컨테이너의 중앙에 맞춤
  const targetLeft = container.scrollLeft + (itemRect.left - containerRect.left) - (containerRect.width / 2) + (itemRect.width / 2)

  container.scrollTo({
    left: targetLeft,
    behavior: 'smooth'
  })
}

// 점 클릭 이벤트
dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    pauseAutoplay()
    scrollToItem(index)
  })
})

// 자동 재생 로직
function startAutoplay() {
  if (isPlaying) return
  isPlaying = true
  playIcon.style.display = 'none'
  pauseIcon.style.display = 'block'
  
  autoplayTimer = setInterval(() => {
    currentIndex = (currentIndex + 1) % items.length
    scrollToItem(currentIndex)
  }, 3000)
}

function pauseAutoplay() {
  isPlaying = false
  playIcon.style.display = 'block'
  pauseIcon.style.display = 'none'
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

// 재생/정지 버튼 클릭 이벤트
playPauseBtn.addEventListener('click', () => {
  if (isPlaying) {
    pauseAutoplay()
  } else {
    startAutoplay()
  }
})

// 사용자 상호작용 감지 시 일시정지
container.addEventListener('mousedown', pauseAutoplay)
container.addEventListener('touchstart', pauseAutoplay)
container.addEventListener('wheel', pauseAutoplay)

// 초기 로드 시 스크롤 위치 보정 및 자동 재생 시작
window.addEventListener('load', () => {
  container.scrollLeft = 0 // 처음 위치로 강제 설정
  updateActiveState(0) // 첫 번째 아이템 강제 활성화
  startAutoplay() // 자동 재생 시작 추가
})
