import { useEffect, useRef } from 'react'

const volumeAudioCampeao = .48

function obterUrlAudio(campeao, acao) {
  return acao === 'ban' ? campeao.audioBan : campeao.audioPick
}

export function useAudioCampeao() {
  const audiosPorUrl = useRef(new Map())
  const audioAtual = useRef(null)

  function obterAudio(url) {
    if (!url) {
      return null
    }

    if (!audiosPorUrl.current.has(url)) {
      const audio = new Audio(url)
      audio.preload = 'auto'
      audio.volume = volumeAudioCampeao
      audiosPorUrl.current.set(url, audio)
    }

    return audiosPorUrl.current.get(url)
  }

  function prepararAudioCampeao(campeao, acao) {
    obterAudio(obterUrlAudio(campeao, acao))
  }

  function tocarAudioCampeao(campeao, acao) {
    const audio = obterAudio(obterUrlAudio(campeao, acao))

    if (!audio) {
      return
    }

    if (audioAtual.current && audioAtual.current !== audio) {
      audioAtual.current.pause()
      audioAtual.current.currentTime = 0
    }

    audio.currentTime = 0
    audio.volume = volumeAudioCampeao
    audioAtual.current = audio
    audio.play().catch(() => undefined)
  }

  useEffect(() => () => {
    audiosPorUrl.current.forEach((audio) => {
      audio.pause()
      audio.currentTime = 0
    })
    audiosPorUrl.current.clear()
  }, [])

  return { prepararAudioCampeao, tocarAudioCampeao }
}
