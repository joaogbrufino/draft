export function CardCampeao({ campeao, equipeBanidora, estaIndisponivel, estaSelecionado, aoSelecionar }) {
  const semCampeao = campeao.id === -1

  return (
    <button
      aria-label={equipeBanidora ? `${campeao.nome} banido pela equipe ${equipeBanidora}` : estaIndisponivel ? `${campeao.nome} já está indisponível` : semCampeao ? 'Não selecionar campeão' : `Selecionar ${campeao.nome}`}
      aria-pressed={estaSelecionado}
      className={`card-campeao${estaSelecionado ? ' esta-selecionado' : ''}${estaIndisponivel ? ' esta-indisponivel' : ''}${equipeBanidora ? ` esta-banido banido-${equipeBanidora}` : ''}`}
      disabled={estaIndisponivel}
      onClick={() => aoSelecionar(campeao.id)}
      type="button"
    >
      <img
        alt={`Ícone de ${campeao.nome}`}
        className="imagem-campeao"
        decoding="async"
        loading={semCampeao ? 'eager' : 'lazy'}
        src={campeao.icone}
      />
      <span className="nome-campeao">{campeao.nome}</span>
    </button>
  )
}
