document.addEventListener('DOMContentLoaded', function() {
  const tabItems = document.querySelectorAll('.tabs .tab-item')
  const activePlaceholder = document.querySelector('.tabs .active-tab')
  const tabClickEvent = function(e) {
    if (e.target.classList.contains('active')) return

    tabItems.forEach(function(item) {
      item.classList.remove('active')
    })

    e.target.classList.add('active')

    activePlaceholder.style.height = `${e.target.clientHeight}px`
    activePlaceholder.style.width = `${e.target.clientWidth}px`
    activePlaceholder.style.left = `${e.target.offsetLeft}px`
  }

  tabItems.forEach(function(item) {
    item.addEventListener('click', tabClickEvent)
  })
})

// const interval = setInterval(() => {
//   if (window.isStyleLoaded) {
//     const tabItems = document.querySelectorAll('.tabs .tab-item')
//     tabItems[0].click()
//     clearInterval(interval)
//     console.log('go!')
//   }
// }, 15)

document.addEventListener('readystatechange', () => {
  if (document.readyState === 'complete') {
    const tabItems = document.querySelectorAll('.tabs .tab-item')
    if (tabItems && tabItems.length) tabItems[0].click()
  }
})