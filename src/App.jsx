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
const ordemDraft = [
  { acao: 'ban', equipe: 'azul', indice: 0 },
  { acao: 'ban', equipe: 'vermelha', indice: 0 },
  { acao: 'ban', equipe: 'azul', indice: 1 },
  { acao: 'ban', equipe: 'vermelha', indice: 1 },
  { acao: 'ban', equipe: 'azul', indice: 2 },
  { acao: 'ban', equipe: 'vermelha', indice: 2 },
  { acao: 'pick', equipe: 'azul', indice: 0 },
  { acao: 'pick', equipe: 'vermelha', indice: 0 },
  { acao: 'pick', equipe: 'vermelha', indice: 1 },
  { acao: 'pick', equipe: 'azul', indice: 1 },
  { acao: 'pick', equipe: 'azul', indice: 2 },
  { acao: 'pick', equipe: 'vermelha', indice: 2 },
  { acao: 'ban', equipe: 'vermelha', indice: 3 },
  { acao: 'ban', equipe: 'azul', indice: 3 },
  { acao: 'ban', equipe: 'vermelha', indice: 4 },
  { acao: 'ban', equipe: 'azul', indice: 4 },
  { acao: 'pick', equipe: 'vermelha', indice: 3 },
  { acao: 'pick', equipe: 'azul', indice: 3 },
  { acao: 'pick', equipe: 'azul', indice: 4 },
  { acao: 'pick', equipe: 'vermelha', indice: 4 },
]

function criarSelecoesVazias() {
  return Array(quantidadePicksPorEquipe).fill(null)
}

function obterIndiceEtapa(acao, equipe, indice) {
  return ordemDraft.findIndex((etapa) => etapa.acao === acao && etapa.equipe === equipe && etapa.indice === indice)
}

function obterIdentificadoresIndisponiveis(selecoesPorEquipe, banimentosPorEquipe, identificadoresFearless = []) {
  const identificadoresPicks = Object.values(selecoesPorEquipe)
    .flat()
    .filter(Boolean)
    .map((campeao) => campeao.id)
  const identificadoresBanimentos = Object.values(banimentosPorEquipe)
    .flat()
    .filter(Boolean)
    .map((campeao) => campeao.id)

  return [...new Set([...identificadoresPicks, ...identificadoresBanimentos, ...identificadoresFearless])]
}

function App() {
  const { campeoes, carregando, erro } = useDadosCampeoes()
  const [busca, definirBusca] = useState('')
  const [campeaoSelecionado, definirCampeaoSelecionado] = useState(opcaoNenhum.id)
  const [posicaoSelecionada, definirPosicaoSelecionada] = useState(null)
  const [tamanhoCard, definirTamanhoCard] = useState(tamanhoCardPadrao)
  const [espacamentoGrade, definirEspacamentoGrade] = useState(espacamentoGradePadrao)
  const [indiceEtapaAtual, definirIndiceEtapaAtual] = useState(0)
  const [preSelecao, definirPreSelecao] = useState(null)
  const [confirmandoAcao, definirConfirmandoAcao] = useState(false)
  const [selecoesPorEquipe, definirSelecoesPorEquipe] = useState({
    azul: criarSelecoesVazias(),
    vermelha: criarSelecoesVazias(),
  })
  const [banimentosPorEquipe, definirBanimentosPorEquipe] = useState({
    azul: criarSelecoesVazias(),
    vermelha: criarSelecoesVazias(),
  })
  const referenciaCatalogo = useRef(null)
  const referenciaGrade = useRef(null)
  const referenciaConfirmacaoAcao = useRef(null)
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

  useEffect(() => () => window.clearTimeout(referenciaConfirmacaoAcao.current), [])

  function selecionarCampeao(identificadorCampeao) {
    if (identificadorCampeao === opcaoNenhum.id) {
      definirCampeaoSelecionado(opcaoNenhum.id)
      definirPreSelecao(null)
      return
    }

    const campeao = campeoes.find((item) => item.id === identificadorCampeao)

    if (!campeao || !etapaAtual || identificadoresIndisponiveis.includes(identificadorCampeao)) {
      return
    }

    definirCampeaoSelecionado(identificadorCampeao)
    definirPreSelecao(campeao)
  }

  function confirmarEscolha() {
    if (!preSelecao || !etapaAtual || confirmandoAcao) {
      return
    }

    definirConfirmandoAcao(true)
    referenciaConfirmacaoAcao.current = window.setTimeout(() => {
      const atualizarSelecoes = etapaAtual.acao === 'pick' ? definirSelecoesPorEquipe : definirBanimentosPorEquipe

      atualizarSelecoes((selecoesAtuais) => ({
        ...selecoesAtuais,
        [etapaAtual.equipe]: selecoesAtuais[etapaAtual.equipe].map((selecao, indice) => (
          indice === etapaAtual.indice ? preSelecao : selecao
        )),
      }))
      definirIndiceEtapaAtual((indiceAtual) => indiceAtual + 1)
      definirCampeaoSelecionado(opcaoNenhum.id)
      definirPreSelecao(null)
      definirConfirmandoAcao(false)
    }, 460)
  }

  function removerCampeao(equipe, indice) {
    const indiceEtapa = obterIndiceEtapa('pick', equipe, indice)

    if (indiceEtapa === -1) {
      return
    }

    definirSelecoesPorEquipe((selecoesAtuais) => ({
      azul: selecoesAtuais.azul.map((selecao, indiceSelecao) => (
        obterIndiceEtapa('pick', 'azul', indiceSelecao) >= indiceEtapa ? null : selecao
      )),
      vermelha: selecoesAtuais.vermelha.map((selecao, indiceSelecao) => (
        obterIndiceEtapa('pick', 'vermelha', indiceSelecao) >= indiceEtapa ? null : selecao
      )),
    }))
    definirBanimentosPorEquipe((banimentosAtuais) => ({
      azul: banimentosAtuais.azul.map((banimento, indiceBanimento) => (
        obterIndiceEtapa('ban', 'azul', indiceBanimento) >= indiceEtapa ? null : banimento
      )),
      vermelha: banimentosAtuais.vermelha.map((banimento, indiceBanimento) => (
        obterIndiceEtapa('ban', 'vermelha', indiceBanimento) >= indiceEtapa ? null : banimento
      )),
    }))
    definirCampeaoSelecionado(opcaoNenhum.id)
    definirPreSelecao(null)
    definirIndiceEtapaAtual(indiceEtapa)
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
  const identificadoresFearless = []
  const identificadoresIndisponiveis = obterIdentificadoresIndisponiveis(
    selecoesPorEquipe,
    banimentosPorEquipe,
    identificadoresFearless,
  )
  const equipePorBanimento = Object.fromEntries(
    Object.entries(banimentosPorEquipe)
      .flatMap(([equipe, banimentos]) => banimentos
        .filter(Boolean)
        .map((campeao) => [campeao.id, equipe])),
  )
  const etapaAtual = ordemDraft[indiceEtapaAtual] ?? null
  const draftFinalizado = etapaAtual === null
  const acaoAtual = etapaAtual?.acao ?? null
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
          banimentos={banimentosPorEquipe.azul}
          confirmandoAcao={confirmandoAcao}
          equipe="azul"
          podeRemover={draftFinalizado}
          preSelecao={preSelecao}
          selecoes={selecoesPorEquipe.azul}
          etapaAtual={etapaAtual}
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
                  equipeBanidora={equipePorBanimento[campeao.id]}
                  estaIndisponivel={campeao.id !== opcaoNenhum.id && (confirmandoAcao || draftFinalizado || identificadoresIndisponiveis.includes(campeao.id))}
                  estaSelecionado={campeao.id === campeaoSelecionado}
                  key={campeao.id}
                />
              ))}

              {carregando && Array.from({ length: quantidadeCardsSkeleton }, (_, indice) => (
                <SkeletonCardCampeao key={indice} />
              ))}
            </div>
          </section>

          <button
            aria-label={confirmandoAcao ? 'Confirmando campeão' : preSelecao ? `Confirmar ${acaoAtual}` : `Selecione um campeão para confirmar o ${acaoAtual ?? 'draft'}`}
            className={`botao-confirmar-pick${preSelecao && etapaAtual ? ` botao-confirmar-pick-${etapaAtual.equipe} esta-pronto` : ''}${confirmandoAcao ? ' esta-confirmando' : ''}${acaoAtual === 'ban' ? ' em-banimento' : ''}`}
            disabled={!preSelecao || confirmandoAcao}
            onClick={confirmarEscolha}
            type="button"
          >
            <span className="rotulo-lock-in">
              {confirmandoAcao ? <span aria-hidden="true" className="indicador-carregando-lock-in" /> : acaoAtual === 'ban' ? 'BAN' : 'LOCK IN'}
            </span>
          </button>
        </div>

        <PainelEquipe
          aoRemoverCampeao={removerCampeao}
          banimentos={banimentosPorEquipe.vermelha}
          confirmandoAcao={confirmandoAcao}
          equipe="vermelha"
          podeRemover={draftFinalizado}
          preSelecao={preSelecao}
          selecoes={selecoesPorEquipe.vermelha}
          etapaAtual={etapaAtual}
        />
      </div>
    </main>
  )
}

export default App
