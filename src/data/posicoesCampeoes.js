const nomesPorPosicao = {
  TOP: [
    'Aatrox', 'Akali', 'Ambessa', 'Aurora', 'Camille', "Cho'Gath", 'Darius', 'Dr. Mundo', 'Fiora', 'Gangplank', 'Garen', 'Gnar', 'Gragas', 'Gwen', 'Heimerdinger', 'Illaoi', 'Irelia', 'Jax', 'Jayce', "K'Sante", 'Kayle', 'Kennen', 'Kled', 'Malphite', 'Mordekaiser', 'Nasus', 'Olaf', 'Ornn', 'Pantheon', 'Poppy', 'Quinn', 'Renekton', 'Rengar', 'Riven', 'Rumble', 'Sett', 'Shen', 'Singed', 'Sion', 'Tahm Kench', 'Teemo', 'Trundle', 'Tryndamere', 'Udyr', 'Urgot', 'Vayne', 'Vladimir', 'Volibear', 'Warwick', 'Wukong', 'Yasuo', 'Yone', 'Yorick', 'Zac', 'Zaahen',
  ],
  JUNGLE: [
    'Amumu', "Bel'Veth", 'Brand', 'Briar', 'Diana', 'Ekko', 'Elise', 'Evelynn', 'Fiddlesticks', 'Gragas', 'Graves', 'Gwen', 'Hecarim', 'Ivern', 'Jarvan IV', 'Jax', 'Karthus', "Kha'Zix", 'Kindred', 'Lee Sin', 'Lillia', 'Maokai', 'Master Yi', 'Mordekaiser', 'Morgana', 'Naafiri', 'Nidalee', 'Nocturne', 'Nunu & Willump', 'Poppy', 'Qiyana', 'Rammus', "Rek'Sai", 'Rengar', 'Sejuani', 'Shaco', 'Shyvana', 'Skarner', 'Taliyah', 'Talon', 'Trundle', 'Udyr', 'Vi', 'Viego', 'Volibear', 'Warwick', 'Wukong', 'Xin Zhao', 'Zac', 'Zaahen', 'Zyra',
  ],
  MIDDLE: [
    'Ahri', 'Akali', 'Akshan', 'Anivia', 'Annie', 'Aurelion Sol', 'Aurora', 'Azir', 'Cassiopeia', 'Corki', 'Diana', 'Ekko', 'Fizz', 'Galio', 'Hwei', 'Kassadin', 'Katarina', 'LeBlanc', 'Lissandra', 'Lux', 'Malzahar', 'Mel', 'Naafiri', 'Neeko', 'Orianna', 'Qiyana', 'Ryze', 'Smolder', 'Swain', 'Sylas', 'Syndra', 'Taliyah', 'Talon', 'Tristana', 'Twisted Fate', 'Veigar', "Vel'Koz", 'Vex', 'Viktor', 'Vladimir', 'Xerath', 'Yasuo', 'Yone', 'Zed', 'Ziggs', 'Zoe',
  ],
  BOTTOM: [
    'Aphelios', 'Ashe', 'Caitlyn', 'Corki', 'Draven', 'Ezreal', 'Hwei', 'Jhin', 'Jinx', "Kai'Sa", 'Kalista', 'Karthus', "Kog'Maw", 'Lucian', 'Miss Fortune', 'Nilah', 'Samira', 'Senna', 'Seraphine', 'Sivir', 'Smolder', 'Swain', 'Tristana', 'Twitch', 'Varus', 'Vayne', 'Veigar', 'Xayah', 'Yasuo', 'Yunara', 'Zeri', 'Ziggs',
  ],
  UTILITY: [
    'Alistar', 'Amumu', 'Annie', 'Ashe', 'Bard', 'Blitzcrank', 'Brand', 'Braum', 'Camille', 'Galio', 'Heimerdinger', 'Janna', 'Karma', 'Leona', 'Lulu', 'Lux', 'Maokai', 'Mel', 'Milio', 'Morgana', 'Nami', 'Nautilus', 'Neeko', 'Pantheon', 'Poppy', 'Pyke', 'Rakan', 'Rell', 'Renata Glasc', 'Senna', 'Seraphine', 'Shaco', 'Shen', 'Sona', 'Soraka', 'Swain', 'Tahm Kench', 'Taric', 'Thresh', "Vel'Koz", 'Xerath', 'Yuumi', 'Zilean', 'Zac', 'Zyra',
  ],
}

function normalizarNomeCampeao(nome) {
  return nome
    .toLocaleLowerCase('pt-BR')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\be\b/gu, '')
    .replace(/[^\p{L}\p{N}]/gu, '')
}

const posicoesPorNome = Object.entries(nomesPorPosicao).reduce((acumulador, [posicao, nomes]) => {
  nomes.forEach((nome) => {
    const nomeNormalizado = normalizarNomeCampeao(nome)
    acumulador[nomeNormalizado] ??= []
    acumulador[nomeNormalizado].push(posicao)
  })

  return acumulador
}, {})

export function obterPosicoesCampeao(nome) {
  return posicoesPorNome[normalizarNomeCampeao(nome)] ?? []
}
