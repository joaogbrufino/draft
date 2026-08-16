export function CardCampeao({ campeao, estaIndisponivel, estaSelecionado, aoSelecionar }) {
  const semCampeao = campeao.id === -1

  return (
    <button
      aria-label={estaIndisponivel ? `${campeao.nome} já está selecionado` : semCampeao ? 'Não selecionar campeão' : `Selecionar ${campeao.nome}`}
      aria-pressed={estaSelecionado}
      className={`card-campeao${estaSelecionado ? ' esta-selecionado' : ''}${estaIndisponivel ? ' esta-indisponivel' : ''}`}
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
