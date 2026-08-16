function IconeMenos() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5 12h14" />
    </svg>
  )
}

function IconeMais() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function IconeAgrupar() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
      <path d="M10.5 7h3M10.5 17h3" />
    </svg>
  )
}

function IconeSeparar() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h6v6h-6z" />
      <path d="M10 6h4M10 18h4" />
    </svg>
  )
}

export function ControlesGradeCampeoes({
  aoAgrupar,
  aoAumentarTamanho,
  aoDiminuirTamanho,
  aoSeparar,
  podeAgrupar,
  podeAumentarTamanho,
  podeDiminuirTamanho,
  podeSeparar,
}) {
  const controles = [
    { aoClicar: aoDiminuirTamanho, icone: <IconeMenos />, nome: 'Diminuir tamanho dos cards', ativo: podeDiminuirTamanho },
    { aoClicar: aoAumentarTamanho, icone: <IconeMais />, nome: 'Aumentar tamanho dos cards', ativo: podeAumentarTamanho },
    { aoClicar: aoAgrupar, icone: <IconeAgrupar />, nome: 'Reduzir espaçamento entre os cards', ativo: podeAgrupar },
    { aoClicar: aoSeparar, icone: <IconeSeparar />, nome: 'Aumentar espaçamento entre os cards', ativo: podeSeparar },
  ]

  return (
    <div className="controles-grade-campeoes" aria-label="Ajustar visualização dos campeões" role="group">
      {controles.map((controle) => (
        <button
          aria-label={controle.nome}
          disabled={!controle.ativo}
          key={controle.nome}
          onClick={controle.aoClicar}
          title={controle.nome}
          type="button"
        >
          {controle.icone}
        </button>
      ))}
    </div>
  )
}
