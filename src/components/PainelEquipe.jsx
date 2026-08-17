import { IconeCapacete } from './IconeCapacete'
import { PainelBanimentos } from './PainelBanimentos'

function SlotPickCampeao({ aoRemover, campeao, confirmandoAcao, estaAtivo, indice, nomeEquipe, podeRemover, preSelecao }) {
  const campeaoExibido = estaAtivo && preSelecao ? preSelecao : campeao
  const estaEmPreSelecao = estaAtivo && Boolean(preSelecao)
  const rotuloSlot = estaEmPreSelecao
    ? `Pré-seleção de ${campeaoExibido.nome}. Confirme o Pick para finalizar.`
    : campeaoExibido
      ? `${campeaoExibido.nome} selecionado.`
      : estaAtivo
        ? `Vez atual: slot ${indice + 1} da ${nomeEquipe}. Selecione um campeão no catálogo.`
        : `Slot ${indice + 1} da ${nomeEquipe}. Aguardando a vez.`

  return (
    <article
      aria-label={rotuloSlot}
      className={`slot-pick-campeao${campeaoExibido ? ' possui-campeao' : ''}${estaAtivo ? ' esta-ativo' : ''}${estaEmPreSelecao ? ' em-pre-selecao' : ''}${confirmandoAcao && estaAtivo ? ' esta-confirmando' : ''}`}
    >
      <div className="conteudo-slot-pick">
        {campeaoExibido ? (
          <img
            alt={`Retrato de ${campeaoExibido.nome}`}
            className="imagem-pick-campeao"
            src={campeaoExibido.retrato}
          />
        ) : (
          <IconeCapacete className="icone-placeholder-pick" />
        )}
        {campeaoExibido && <span className="nome-pick-campeao">{campeaoExibido.nome}</span>}
      </div>

      {campeao && podeRemover && (
        <button aria-label={`Remover ${campeao.nome}`} className="botao-remover-pick" onClick={aoRemover} type="button">
          ×
        </button>
      )}
    </article>
  )
}

export function PainelEquipe({ aoRemoverCampeao, banimentos, confirmandoAcao, equipe, etapaAtual, podeRemover, preSelecao, selecoes }) {
  const nomeEquipe = equipe === 'azul' ? 'Equipe azul' : 'Equipe vermelha'

  return (
    <aside className={`painel-equipe painel-equipe-${equipe}`} aria-label={`Campeões da ${nomeEquipe}`}>
      <div className="lista-picks-equipe">
        {selecoes.map((campeao, indice) => (
          <SlotPickCampeao
            aoRemover={() => aoRemoverCampeao(equipe, indice)}
            campeao={campeao}
            confirmandoAcao={confirmandoAcao}
            estaAtivo={etapaAtual?.acao === 'pick' && etapaAtual.equipe === equipe && etapaAtual.indice === indice}
            indice={indice}
            key={indice}
            nomeEquipe={nomeEquipe}
            podeRemover={podeRemover}
            preSelecao={preSelecao}
          />
        ))}
      </div>

      <PainelBanimentos
        banimentos={banimentos}
        confirmandoAcao={confirmandoAcao}
        equipe={equipe}
        etapaAtual={etapaAtual}
        preSelecao={preSelecao}
      />
    </aside>
  )
}
