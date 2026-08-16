import { useEffect, useState } from 'react'
import { buscarCampeoes } from '../services/dadosCampeoes'

const estadoInicial = { campeoes: [], carregando: true, erro: false }

export function useDadosCampeoes() {
  const [estado, definirEstado] = useState(estadoInicial)

  useEffect(() => {
    const controlador = new AbortController()

    async function carregarCampeoes() {
      try {
        const campeoes = await buscarCampeoes(controlador.signal)
        definirEstado({ campeoes, carregando: false, erro: false })
      } catch (erro) {
        if (erro.name !== 'AbortError') {
          definirEstado({ campeoes: [], carregando: false, erro: true })
        }
      }
    }

    carregarCampeoes()

    return () => controlador.abort()
  }, [])

  return estado
}
