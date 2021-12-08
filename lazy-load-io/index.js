document.addEventListener('DOMContentLoaded', run)

function run() {
  const MAX_ITEM = 500
  const rootEl = document.querySelector('.root')
  const observes = []

  for (let i = 0; i < MAX_ITEM; i++) {
    const item = document.createElement('div')

    item.classList.add('item')

    const img = document.createElement('img')
    const observer = new IntersectionObserver(observeCallback, {
      threshold: 0.5
    })

    function observeCallback(entries, observer) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const _image = new Image()
          _image.src = `https://picsum.photos/id/${i + 1}/200/400`
          _image.onload = () => {
            img.src = _image.src
            img.classList.add('loaded')
          }
        }
      })
    }

    observer.observe(item)

    item.appendChild(img)
    rootEl.appendChild(item)
  }
}
