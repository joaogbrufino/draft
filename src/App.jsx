import Lenis from 'lenis'
import { useEffect, useRef, useState } from 'react'
import { CardCampeao } from './components/CardCampeao'
import { ControlesGradeCampeoes } from './components/ControlesGradeCampeoes'
import { FiltrosCampeoes } from './components/FiltrosCampeoes'
import { PainelEquipe } from './components/PainelEquipe'
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
const quantidadePicksPorEquipe = 5
const ordemPicks = [
  { equipe: 'azul', indice: 0 },
  { equipe: 'vermelha', indice: 0 },
  { equipe: 'vermelha', indice: 1 },
  { equipe: 'azul', indice: 1 },
  { equipe: 'azul', indice: 2 },
  { equipe: 'vermelha', indice: 2 },
  { equipe: 'vermelha', indice: 3 },
  { equipe: 'azul', indice: 3 },
  { equipe: 'azul', indice: 4 },
  { equipe: 'vermelha', indice: 4 },
]

function criarSelecoesVazias() {
  return Array(quantidadePicksPorEquipe).fill(null)
}

function App() {
  const { campeoes, carregando, erro } = useDadosCampeoes()
  const [busca, definirBusca] = useState('')
  const [campeaoSelecionado, definirCampeaoSelecionado] = useState(opcaoNenhum.id)
  const [posicaoSelecionada, definirPosicaoSelecionada] = useState(null)
  const [tamanhoCard, definirTamanhoCard] = useState(tamanhoCardPadrao)
  const [espacamentoGrade, definirEspacamentoGrade] = useState(espacamentoGradePadrao)
  const [indicePickAtual, definirIndicePickAtual] = useState(0)
  const [preSelecao, definirPreSelecao] = useState(null)
  const [confirmandoPick, definirConfirmandoPick] = useState(false)
  const [selecoesPorEquipe, definirSelecoesPorEquipe] = useState({
    azul: criarSelecoesVazias(),
    vermelha: criarSelecoesVazias(),
  })
  const referenciaCatalogo = useRef(null)
  const referenciaGrade = useRef(null)
  const referenciaConfirmacaoPick = useRef(null)
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

  useEffect(() => () => window.clearTimeout(referenciaConfirmacaoPick.current), [])

  function selecionarCampeao(identificadorCampeao) {
    if (identificadorCampeao === opcaoNenhum.id) {
      definirCampeaoSelecionado(opcaoNenhum.id)
      definirPreSelecao(null)
      return
    }

    const campeao = campeoes.find((item) => item.id === identificadorCampeao)

    if (!campeao || identificadoresSelecionados.includes(identificadorCampeao) || !pickAtual) {
      return
    }

    definirCampeaoSelecionado(identificadorCampeao)
    definirPreSelecao(campeao)
  }

  function confirmarPick() {
    if (!preSelecao || !pickAtual || confirmandoPick) {
      return
    }

    definirConfirmandoPick(true)
    referenciaConfirmacaoPick.current = window.setTimeout(() => {
      definirSelecoesPorEquipe((selecoesAtuais) => ({
        ...selecoesAtuais,
        [pickAtual.equipe]: selecoesAtuais[pickAtual.equipe].map((selecao, indice) => (
          indice === pickAtual.indice ? preSelecao : selecao
        )),
      }))
      definirIndicePickAtual((indiceAtual) => indiceAtual + 1)
      definirPreSelecao(null)
      definirConfirmandoPick(false)
    }, 460)
  }

  function removerCampeao(equipe, indice) {
    const indicePick = ordemPicks.findIndex((pick) => pick.equipe === equipe && pick.indice === indice)

    if (indicePick === -1) {
      return
    }

    definirSelecoesPorEquipe((selecoesAtuais) => ({
      azul: selecoesAtuais.azul.map((selecao, indiceSelecao) => (
        ordemPicks.findIndex((pick) => pick.equipe === 'azul' && pick.indice === indiceSelecao) >= indicePick ? null : selecao
      )),
      vermelha: selecoesAtuais.vermelha.map((selecao, indiceSelecao) => (
        ordemPicks.findIndex((pick) => pick.equipe === 'vermelha' && pick.indice === indiceSelecao) >= indicePick ? null : selecao
      )),
    }))
    definirCampeaoSelecionado(opcaoNenhum.id)
    definirPreSelecao(null)
    definirIndicePickAtual(indicePick)
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
  const identificadoresSelecionados = Object.values(selecoesPorEquipe)
    .flat()
    .filter(Boolean)
    .map((campeao) => campeao.id)
  const pickAtual = ordemPicks[indicePickAtual] ?? null
  const draftFinalizado = pickAtual === null
  const campeoesVisiveis = opcoesCampeao.filter((campeao) => {
    const nomeCampeao = campeao.nome.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('pt-BR')
    const correspondeBusca = nomeCampeao.includes(termoBusca)
    const correspondePosicao = !posicaoSelecionada || campeao.posicoes.includes(posicaoSelecionada)

    return correspondeBusca && correspondePosicao
  })
  return (
    <main className="selecao-campeoes" aria-label="Seleção de campeões">
      {erro && <p className="mensagem-erro">Não foi possível carregar os campeões.</p>}

      <div className="layout-selecao">
        <PainelEquipe
          aoRemoverCampeao={removerCampeao}
          confirmandoPick={confirmandoPick}
          equipe="azul"
          podeRemover={draftFinalizado}
          preSelecao={preSelecao}
          selecoes={selecoesPorEquipe.azul}
          slotAtivo={pickAtual}
        />

        <div className="area-catalogo">
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
                  estaIndisponivel={campeao.id !== opcaoNenhum.id && (confirmandoPick || draftFinalizado || identificadoresSelecionados.includes(campeao.id))}
                  estaSelecionado={campeao.id === campeaoSelecionado}
                  key={campeao.id}
                />
              ))}

              {carregando && Array.from({ length: quantidadeCardsSkeleton }, (_, indice) => (
                <SkeletonCardCampeao key={indice} />
              ))}
            </div>
          </section>

          {preSelecao && (
            <button
              className={`botao-confirmar-pick botao-confirmar-pick-${pickAtual.equipe}`}
              disabled={confirmandoPick}
              onClick={confirmarPick}
              type="button"
            >
              {confirmandoPick ? 'Confirmando...' : 'Pick'}
            </button>
          )}
        </div>

        <PainelEquipe
          aoRemoverCampeao={removerCampeao}
          confirmandoPick={confirmandoPick}
          equipe="vermelha"
          podeRemover={draftFinalizado}
          preSelecao={preSelecao}
          selecoes={selecoesPorEquipe.vermelha}
          slotAtivo={pickAtual}
        />
      </div>
    </main>
  )
}

export default App
