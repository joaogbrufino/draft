import Lenis from 'lenis'
import { useEffect, useRef, useState } from 'react'
import { CardCampeao } from './components/CardCampeao'
import { SkeletonCardCampeao } from './components/SkeletonCardCampeao'
import { useDadosCampeoes } from './hooks/useDadosCampeoes'
import './App.css'

const opcaoNenhum = {
  id: -1,
  nome: 'Nenhum',
  icone: 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/-1.png',
}
const quantidadeCardsSkeleton = 49

function App() {
  const { campeoes, carregando, erro } = useDadosCampeoes()
  const [campeaoSelecionado, definirCampeaoSelecionado] = useState(opcaoNenhum.id)
  const referenciaCatalogo = useRef(null)
  const referenciaGrade = useRef(null)
  const opcoesCampeao = [opcaoNenhum, ...campeoes]

  useEffect(() => {
    const catalogo = referenciaCatalogo.current
    const grade = referenciaGrade.current
    const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!catalogo || !grade || movimentoReduzido) {
      return undefined
    }

    const rolagemSuave = new Lenis({
      content: grade,
      lerp: 0.075,
      smoothWheel: true,
      syncTouch: true,
      wrapper: catalogo,
    })
    let identificadorAnimacao

    function atualizarRolagem(tempo) {
      rolagemSuave.raf(tempo)
      identificadorAnimacao = requestAnimationFrame(atualizarRolagem)
    }

    identificadorAnimacao = requestAnimationFrame(atualizarRolagem)

    return () => {
      cancelAnimationFrame(identificadorAnimacao)
      rolagemSuave.destroy()
    }
  }, [])

  function selecionarCampeao(identificadorCampeao) {
    definirCampeaoSelecionado(identificadorCampeao)
  }

  return (
    <main className="selecao-campeoes" aria-label="Seleção de campeões">
      {erro && <p className="mensagem-erro">Não foi possível carregar os campeões.</p>}

      <section
        className="catalogo-campeoes"
        aria-busy={carregando}
        aria-label="Campeões disponíveis"
        ref={referenciaCatalogo}
        tabIndex="0"
      >
        <div className="grade-campeoes" ref={referenciaGrade}>
          {opcoesCampeao.map((campeao) => (
            <CardCampeao
              aoSelecionar={selecionarCampeao}
              campeao={campeao}
              estaSelecionado={campeao.id === campeaoSelecionado}
              key={campeao.id}
            />
          ))}

          {carregando && Array.from({ length: quantidadeCardsSkeleton }, (_, indice) => (
            <SkeletonCardCampeao key={indice} />
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
