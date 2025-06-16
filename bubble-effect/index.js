const simplex = new SimplexNoise()

// 상수값
// 물방울 속도
const SCROLL_SPEED = 0.45
// 물방울 움직임 조정
const NOISE_SPEED = 0.0028
// 물방울 활동 영역
const NOISE_AMOUNT = 18
// 캔버스 사이즈
const CANVAS_WIDTH = 2800
const CANVAS_HEIGHT = 400
// 물방울이 가질 수 있는 최대, 최소 사이즈
const BUBBLE_MAX_SIZE = 110
const BUBBLE_MIN_SIZE = 80

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

// 물방울 클래스 팩토리 클래스
const Bubbles = function (specs, container) {
  this.bubbles = []
  this.container = container
  this.setupContainerStyle()

  specs.forEach((spec, i) => {
    this.bubbles.push(new Bubble(i, spec))
  })

  requestAnimationFrame(this.update.bind(this))
}

// 모든 물방울 업데이트 메서드 실행
Bubbles.prototype.update = function () {
  this.bubbles.forEach((bubble) => bubble.update())
  this.raf = requestAnimationFrame(this.update.bind(this))
}

Bubbles.prototype.setupContainerStyle = function () {
  this.container.style.width = CANVAS_WIDTH + 'px'
  this.container.style.height = CANVAS_HEIGHT + 'px'
}

// 물방울 클래스
const Bubble = function (index, spec) {
  this.index = index // 인덱스 값, 객체 조작시 필요
  this.x = spec.x // 캔버스 평면 위 X 값
  this.y = spec.y // 캔버스 평면 위 Y 값
  this.src = spec.src // 이미지 URL
  this.started = true // 시작 제어

  this.noiseSeedX = Math.floor(Math.random() * 64000)
  this.noiseSeedY = Math.floor(Math.random() * 64000)

  this.el = document.createElement('div') // 물방울 엘리먼트
  this.el.classList.add('bubble')
  this.el.style.width = spec.size + 'px'
  this.el.style.height = spec.size + 'px'

  this.setImage()
  this.getParent().appendChild(this.el)
}

Bubble.prototype.setImage = function () {
  const image = new Image()

  image.src = this.src

  image.onload = function () {
    imageLoad()
  }

  this.el.style.backgroundImage = `url('${this.src}')` // 이미지 설정
}

Bubble.prototype.update = function () {
  if (!this.started) return

  this.noiseSeedX += NOISE_SPEED // 노이즈를 발생시킬 기준 점 업데이트
  this.noiseSeedY += NOISE_SPEED
  const _x = simplex.noise(this.noiseSeedX, 0) // 랜덤 노이즈
  const _y = simplex.noise(this.noiseSeedY, 0)

  // 값이 음수로 진행하는 방향이면 오른쪽에서 왼쪽
  // 좌표 평면 위에 x 값을 조정하는 것이므로 x 축으로만 진행
  // 단순히 값을 더하거나 축을 변경하면 다양한 방향으로 진행하는
  // 이펙트 적용시킬 수 있음
  this.x -= SCROLL_SPEED
  this.qx = this.x + _x * NOISE_AMOUNT
  this.qy = this.y + _y * NOISE_AMOUNT

  if (this.x < -100) {
    // 캔버스 바깥으로 벗어날 경우
    this.x = CANVAS_WIDTH
  }

  this.el.style.transform = `translate(${this.qx}px, ${this.qy}px)`

  if (!loadedImage) this.started = false
}

Bubble.prototype.getParent = function () {
  return document.querySelector('.bubbles')
}

const specs = []

// 물방울 스펙 만들기
;(function () {
  // 물방울이 가질 수 있는 최대, 최소 영역
  const BUBBLE_MAX_SIZE_A = 150

  // 한 줄에 배치될 수 있는 물방울 갯수
  const ROW_MAX_BUBBLE_COUNT = CANVAS_WIDTH / BUBBLE_MAX_SIZE_A

  for (let i = 0; i < CANVAS_HEIGHT / BUBBLE_MAX_SIZE_A; i++) {
    for (let j = 0; j < ROW_MAX_BUBBLE_COUNT; j++) {
      // x 최소, 최댓값
      const minX = j * BUBBLE_MAX_SIZE_A
      const maxX = minX + BUBBLE_MAX_SIZE_A
      // y 최소, 최댓값
      const minY = i * BUBBLE_MAX_SIZE_A
      const maxY = minY + BUBBLE_MAX_SIZE_A

      specs.push({
        x: rand(minX, maxX),
        y: rand(minY, maxY),
        size: rand(BUBBLE_MIN_SIZE, BUBBLE_MAX_SIZE),
        src: `https://picsum.photos/seed/${rand(0, 10000)}/100/100`
      })
    }
  }
})()

console.log('Render bubble count :', specs.length)

let loadedImage = 0

function imageLoad() {
  loadedImage += 1

  if (loadedImage >= specs.length) {
    const wrap = document.querySelector('.bubbles')

    if (wrap) {
      // 모든 이미지 로드시 제어
      requestAnimationFrame((_) => {
        wrap.style.opacity = 1
        // 투명도 트랜지션이 끝나면 물방울 움직임 제어
        bubbles.bubbles.forEach((bubble) => {
          setTimeout(() => {
            bubble.started = true
          }, 900)
        })
      })
    }
  }
}

const bubbles = new Bubbles(specs, document.querySelector('.bubbles'))
