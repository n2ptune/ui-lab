document.addEventListener('DOMContentLoaded', () => {
  const audioBtn = document.querySelector('.audio-btn')

  audioBtn.addEventListener('click', () => {
    // const audio = new Audio()
    // audio.crossOrigin = 'anonymous'
    // audio.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
    // audio.play()
    const audio = document.querySelector('audio')
    // audio.play()

    const audioCtx = new window.AudioContext()
    const analyser = audioCtx.createAnalyser()
    const source = audioCtx.createMediaElementSource(audio)

    source.connect(analyser)
    analyser.connect(audioCtx.destination)
    analyser.fftSize = 32

    const bufLen = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufLen)

    function run() {
      analyser.getByteFrequencyData(dataArray)

      for (let i = 0; i < bufLen; i++) {
        console.log(dataArray[i])
      }

      requestAnimationFrame(run)
    }

    run()
  })
})
