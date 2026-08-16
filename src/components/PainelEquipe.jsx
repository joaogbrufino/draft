import { IconeCapacete } from './IconeCapacete'

function SlotPickCampeao({ aoRemover, campeao, confirmandoPick, estaAtivo, indice, nomeEquipe, podeRemover, preSelecao }) {
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
      className={`slot-pick-campeao${campeaoExibido ? ' possui-campeao' : ''}${estaAtivo ? ' esta-ativo' : ''}${estaEmPreSelecao ? ' em-pre-selecao' : ''}${confirmandoPick && estaAtivo ? ' esta-confirmando' : ''}`}
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

export function PainelEquipe({ aoRemoverCampeao, confirmandoPick, equipe, podeRemover, preSelecao, selecoes, slotAtivo }) {
  const nomeEquipe = equipe === 'azul' ? 'Equipe azul' : 'Equipe vermelha'

  return (
    <aside className={`painel-equipe painel-equipe-${equipe}`} aria-label={`Campeões da ${nomeEquipe}`}>
      <div className="lista-picks-equipe">
        {selecoes.map((campeao, indice) => (
          <SlotPickCampeao
            aoRemover={() => aoRemoverCampeao(equipe, indice)}
            campeao={campeao}
            confirmandoPick={confirmandoPick}
            estaAtivo={slotAtivo?.equipe === equipe && slotAtivo.indice === indice}
            indice={indice}
            key={indice}
            nomeEquipe={nomeEquipe}
            podeRemover={podeRemover}
            preSelecao={preSelecao}
          />
        ))}
      </div>
    </aside>
  )
}