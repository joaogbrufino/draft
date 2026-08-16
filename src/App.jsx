import Lenis from 'lenis'
import { useEffect, useRef, useState } from 'react'
import { CardCampeao } from './components/CardCampeao'
import { ControlesGradeCampeoes } from './components/ControlesGradeCampeoes'
import { FiltrosCampeoes } from './components/FiltrosCampeoes'
import { SkeletonCardCampeao } from './components/SkeletonCardCampeao'
import { useDadosCampeoes } from './hooks/useDadosCampeoes'
import './App.css'

const opcaoNenhum = {
  id: -1,
  nome: 'Nenhum',
  icone: 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/-1.png',
  posicoes: [],
}
const quantidadeCardsSkeleton = 49
const tamanhoCardPadrao = 74
const tamanhoCardMinimo = 62
const tamanhoCardMaximo = 98
const passoTamanhoCard = 4
const espacamentoGradePadrao = 12
const espacamentoGradeMinimo = 4
const espacamentoGradeMaximo = 24
const passoEspacamentoGrade = 2

function App() {
  const { campeoes, carregando, erro } = useDadosCampeoes()
  const [busca, definirBusca] = useState('')
  const [campeaoSelecionado, definirCampeaoSelecionado] = useState(opcaoNenhum.id)
  const [posicaoSelecionada, definirPosicaoSelecionada] = useState(null)
  const [tamanhoCard, definirTamanhoCard] = useState(tamanhoCardPadrao)
  const [espacamentoGrade, definirEspacamentoGrade] = useState(espacamentoGradePadrao)
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

  function alternarPosicao(posicao) {
    definirPosicaoSelecionada((posicaoAtual) => (posicaoAtual === posicao ? null : posicao))
  }

  function ajustarTamanhoCard(variacao) {
    definirTamanhoCard((tamanhoAtual) => Math.min(
      tamanhoCardMaximo,
      Math.max(tamanhoCardMinimo, tamanhoAtual + variacao),
    ))
  }

  function ajustarEspacamentoGrade(variacao) {
    definirEspacamentoGrade((espacamentoAtual) => Math.min(
      espacamentoGradeMaximo,
      Math.max(espacamentoGradeMinimo, espacamentoAtual + variacao),
    ))
  }

  const termoBusca = busca.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('pt-BR')
  const campeoesVisiveis = opcoesCampeao.filter((campeao) => {
    const nomeCampeao = campeao.nome.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('pt-BR')
    const correspondeBusca = nomeCampeao.includes(termoBusca)
    const correspondePosicao = !posicaoSelecionada || campeao.posicoes.includes(posicaoSelecionada)

    return correspondeBusca && correspondePosicao
  })

  return (
    <main className="selecao-campeoes" aria-label="Seleção de campeões">
      {erro && <p className="mensagem-erro">Não foi possível carregar os campeões.</p>}

      <FiltrosCampeoes
        aoAlterarBusca={definirBusca}
        aoSelecionarPosicao={alternarPosicao}
        controles={(
          <ControlesGradeCampeoes
            aoAgrupar={() => ajustarEspacamentoGrade(-passoEspacamentoGrade)}
            aoAumentarTamanho={() => ajustarTamanhoCard(passoTamanhoCard)}
            aoDiminuirTamanho={() => ajustarTamanhoCard(-passoTamanhoCard)}
            aoSeparar={() => ajustarEspacamentoGrade(passoEspacamentoGrade)}
            podeAgrupar={espacamentoGrade > espacamentoGradeMinimo}
            podeAumentarTamanho={tamanhoCard < tamanhoCardMaximo}
            podeDiminuirTamanho={tamanhoCard > tamanhoCardMinimo}
            podeSeparar={espacamentoGrade < espacamentoGradeMaximo}
          />
        )}
        busca={busca}
        posicaoSelecionada={posicaoSelecionada}
      />

      <section
        className="catalogo-campeoes"
        aria-busy={carregando}
        aria-label="Campeões disponíveis"
        ref={referenciaCatalogo}
        tabIndex="0"
      >
        <div
          className="grade-campeoes"
          ref={referenciaGrade}
          style={{ '--espacamento-grade': `${espacamentoGrade}px`, '--tamanho-card': `${tamanhoCard}px` }}
        >
          {campeoesVisiveis.map((campeao) => (
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
