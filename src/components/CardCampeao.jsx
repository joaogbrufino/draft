export function CardCampeao({ campeao, estaSelecionado, aoSelecionar }) {
  const semCampeao = campeao.id === -1

  return (
    <button
      aria-label={semCampeao ? 'Não selecionar campeão' : `Selecionar ${campeao.nome}`}
      aria-pressed={estaSelecionado}
      className={`card-campeao${estaSelecionado ? ' esta-selecionado' : ''}`}
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
