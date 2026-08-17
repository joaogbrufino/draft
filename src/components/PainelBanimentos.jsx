import { IconeCapacete } from './IconeCapacete'

function SlotBanimento({ campeao, confirmandoAcao, estaAtivo, indice, nomeEquipe, preSelecao }) {
  const campeaoExibido = estaAtivo && preSelecao ? preSelecao : campeao
  const estaEmPreSelecao = estaAtivo && Boolean(preSelecao)
  const rotulo = estaEmPreSelecao
    ? `Pré-seleção de banimento de ${campeaoExibido.nome}. Confirme para finalizar.`
    : campeao
    ? `${campeao.nome} banido pela ${nomeEquipe}.`
    : estaAtivo
      ? `Vez atual: banimento ${indice + 1} da ${nomeEquipe}. Selecione um campeão no catálogo.`
      : `Slot de banimento ${indice + 1} da ${nomeEquipe}. Aguardando a vez.`

  return (
    <article
      aria-label={rotulo}
      className={`slot-banimento${campeao ? ' possui-campeao' : ''}${estaAtivo ? ' esta-ativo' : ''}${estaEmPreSelecao ? ' em-pre-selecao' : ''}${confirmandoAcao && estaAtivo ? ' esta-confirmando' : ''}`}
    >
      {campeaoExibido ? (
        <img alt={`Ícone de ${campeaoExibido.nome}`} className="imagem-banimento-campeao" src={campeaoExibido.icone} />
      ) : (
        <IconeCapacete className="icone-placeholder-banimento" />
      )}
      {campeaoExibido && <span className="nome-banimento-campeao">{campeaoExibido.nome}</span>}
    </article>
  )
}

export function PainelBanimentos({ banimentos, confirmandoAcao, equipe, etapaAtual, preSelecao }) {
  const nomeEquipe = equipe === 'azul' ? 'Equipe azul' : 'Equipe vermelha'

  return (
    <section className="painel-banimentos" aria-label={`Banimentos da ${nomeEquipe}`}>
      <div className="lista-banimentos-equipe">
        {banimentos.map((campeao, indice) => (
          <SlotBanimento
            campeao={campeao}
            confirmandoAcao={confirmandoAcao}
            estaAtivo={etapaAtual?.acao === 'ban' && etapaAtual.equipe === equipe && etapaAtual.indice === indice}
            indice={indice}
            key={indice}
            nomeEquipe={nomeEquipe}
            preSelecao={preSelecao}
          />
        ))}
      </div>
    </section>
  )
}
