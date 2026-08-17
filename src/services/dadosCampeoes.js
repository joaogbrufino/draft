import { obterPosicoesCampeao } from '../data/posicoesCampeoes'

const urlVersoes = 'https://ddragon.leagueoflegends.com/api/versions.json'
const urlAudiosCampeoes = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/pt_br/v1'
const idioma = 'pt_BR'

async function buscarJson(url, sinal) {
  const resposta = await fetch(url, { signal: sinal })

  if (!resposta.ok) {
    throw new Error(`Falha ao buscar dados: ${resposta.status}`)
  }

  return resposta.json()
}

export async function buscarCampeoes(sinal) {
  const versoes = await buscarJson(urlVersoes, sinal)
  const versaoAtual = versoes[0]
  const urlCampeoes = `https://ddragon.leagueoflegends.com/cdn/${versaoAtual}/data/${idioma}/champion.json`
  const conteudoCampeoes = await buscarJson(urlCampeoes, sinal)

  return Object.values(conteudoCampeoes.data)
    .map((campeao) => ({
      id: campeao.id,
      idNumerico: Number(campeao.key),
      nome: campeao.name,
      titulo: campeao.title,
      classes: campeao.tags,
      icone: `https://ddragon.leagueoflegends.com/cdn/${versaoAtual}/img/champion/${campeao.image.full}`,
      posicoes: obterPosicoesCampeao(campeao.name),
      retrato: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${campeao.id}_0.jpg`,
      audioPick: `${urlAudiosCampeoes}/champion-choose-vo/${campeao.key}.ogg`,
      audioBan: `${urlAudiosCampeoes}/champion-ban-vo/${campeao.key}.ogg`,
    }))
    .sort((primeiroCampeao, segundoCampeao) => primeiroCampeao.nome.localeCompare(segundoCampeao.nome, 'pt-BR'))
}
