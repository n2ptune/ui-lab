document.addEventListener('DOMContentLoaded', start)

// 카드 복사 횟수 if 2 = CARD_COUNT(5) * 2 = 10개 복사
const COPY_ITER_COUNT = 2

function setVariables(wrapper, width, len, realLen) {
  const els = document.documentElement.style

  els.setProperty('--card-wrapper-width', width * len + 'px')
  els.setProperty('--card-wrapper-real-width', width * realLen + 'px')
  els.setProperty(
    '--card-wrapper-real-width-x',
    -1 * parseInt((width * len) / (COPY_ITER_COUNT + 1)) + 'px'
  )
}

function setAnimation(wrapper) {
  wrapper.style.animationName = 'slide-horizontal'
  wrapper.style.opacity = '1'
}

function start() {
  const wrapper = document.querySelector('.marquee-container > ul.cards')

  // 카드 하나 사이즈 계산
  const sampleCard = wrapper.querySelectorAll('.card')
  const cardWidth = sampleCard[0].clientWidth
  const cardLen = sampleCard.length

  // 카드 복사
  for (let i = 0; i < COPY_ITER_COUNT; i++) {
    for (let j = 0; j < cardLen; j++) {
      const cloneEl = sampleCard[j].cloneNode(true)

      cloneEl.dataset.copyElement = `${i}${j}`
      cloneEl.setAttribute('aria-hidden', true)

      wrapper.appendChild(cloneEl)
    }
  }

  const clonedCardLen = wrapper.querySelectorAll('.card').length

  // CSS 변수 설정
  setVariables(wrapper, cardWidth, clonedCardLen, cardLen)
  setAnimation(wrapper)
}
