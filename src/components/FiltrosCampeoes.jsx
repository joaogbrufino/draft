const urlBaseIconesPosicao = 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-champ-select/global/default/svg'

const filtrosPosicao = [
  { id: 'TOP', nome: 'TOP', icone: `${urlBaseIconesPosicao}/position-top.svg` },
  { id: 'JUNGLE', nome: 'JUNGLE', icone: `${urlBaseIconesPosicao}/position-jungle.svg` },
  { id: 'MIDDLE', nome: 'MID', icone: `${urlBaseIconesPosicao}/position-middle.svg` },
  { id: 'BOTTOM', nome: 'ADC', icone: `${urlBaseIconesPosicao}/position-bottom.svg` },
  { id: 'UTILITY', nome: 'SUPPORT', icone: `${urlBaseIconesPosicao}/position-utility.svg` },
]

export function FiltrosCampeoes({ busca, aoAlterarBusca, controles, posicaoSelecionada, aoSelecionarPosicao }) {
  return (
    <section className="filtros-campeoes" aria-label="Filtros de campeões">
      <div className="lista-filtros-posicao" role="group" aria-label="Filtrar por posição">
        {filtrosPosicao.map((filtro) => {
          const estaSelecionado = filtro.id === posicaoSelecionada

          return (
            <button
              aria-pressed={estaSelecionado}
              className={`botao-filtro-posicao${estaSelecionado ? ' esta-selecionado' : ''}`}
              key={filtro.id}
              onClick={() => aoSelecionarPosicao(filtro.id)}
              type="button"
            >
              {filtro.icone && <img src={filtro.icone} alt="" />}
              <span>{filtro.nome}</span>
            </button>
          )
        })}
      </div>

      <div className="acoes-catalogo">
        {controles}
        <label className="campo-busca-campeoes">
          <span className="rotulo-invisivel">Buscar campeão</span>
          <span aria-hidden="true">⌕</span>
          <input
            onChange={(evento) => aoAlterarBusca(evento.target.value)}
            placeholder="Buscar campeão"
            type="search"
            value={busca}
          />
        </label>
      </div>
    </section>
  )
}
