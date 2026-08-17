<p align="center">
  <img src="/public/logo.png" alt="Logo UniRV"/>
</p>

<h1 align="center">
  Simulação de Draft
</h1>


<p align="center">
  <img src="https://img.shields.io/badge/Status-Em%20desenvolvimento-C8923E?style=for-the-badge" alt="Status do projeto: em desenvolvimento" />
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Node.js-20%2B-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js 20 ou superior" />
</p>

## Resumo

Este projeto implementa uma simulação interativa do processo de seleção de campeões (*Champion Select*) de **League of Legends**. A aplicação reproduz, em ambiente web e sem integração com o cliente oficial do jogo, as principais etapas de um draft competitivo: banimentos, pré-seleção, confirmação de escolhas, alternância entre equipes e indisponibilização de campeões já utilizados.

O trabalho tem finalidade acadêmica e demonstra a aplicação de princípios de desenvolvimento front-end, modelagem de estados, consumo de APIs REST, organização baseada em componentes e interação responsiva. A proposta visual toma como referência a linguagem de interfaces competitivas do jogo, sem reproduzir seus ativos proprietários de interface.

## Objetivos

### Objetivo geral

Desenvolver uma interface web capaz de simular o draft competitivo de League of Legends, apresentando dados atualizados de campeões e regras de seleção coerentes com o fluxo de torneios.

### Objetivos específicos

- Consumir dados públicos para exibir nome, ícone, retrato, classe e posições dos campeões.
- Modelar a sequência competitiva de cinco picks e cinco bans por equipe.
- Impedir reutilização de campeões banidos ou já escolhidos.
- Oferecer filtros por posição, busca textual e ajustes graduais da grade de campeões.
- Representar pré-seleção e confirmação como estados distintos da interação.
- Disponibilizar feedback visual e sonoro sincronizado às confirmações de Pick e Ban.
- Adotar uma estrutura de componentes e hooks que facilite a evolução para novas regras de draft.

## Funcionalidades implementadas

| Área | Implementação |
| --- | --- |
| Catálogo | Carregamento dinâmico de campeões, ícones, retratos, classes e nomes em português brasileiro. |
| Pesquisa e filtros | Busca sem distinção de acentos e filtros alternáveis para Top, Jungle, Mid, ADC e Support. |
| Grade | Controles de zoom e espaçamento, com limites mínimos e máximos para preservar a legibilidade. |
| Picks | Cinco slots por equipe, pré-seleção, confirmação por **LOCK IN**, animação e nome sobreposto ao retrato. |
| Bans | Cinco slots compactos por equipe, desaturação, escurecimento, traço diagonal e indicação visual da equipe responsável. |
| Regras | Sequência oficial de draft competitivo, avanço automático e bloqueio de campeões indisponíveis. |
| Áudio | Falas de Pick e Ban em português brasileiro, reproduzidas somente após a confirmação. |
| Usabilidade | Skeleton loading, estados de erro, cursor temático, rolagem suave com Lenis e respeito a `prefers-reduced-motion`. |

## Fluxo de draft modelado

O fluxo é representado por uma sequência declarativa de etapas, contendo a ação, a equipe e o índice do slot. Essa abordagem separa a regra do jogo da renderização da interface e permite alterar ou ampliar o formato de draft sem reestruturar os componentes visuais.

| Fase | Ordem |
| --- | --- |
| Bans — fase 1 | Blue Ban 1 → Red Ban 1 → Blue Ban 2 → Red Ban 2 → Blue Ban 3 → Red Ban 3 |
| Picks — fase 1 | Blue Pick 1 → Red Pick 1 e 2 → Blue Pick 2 e 3 → Red Pick 3 |
| Bans — fase 2 | Red Ban 4 → Blue Ban 4 → Red Ban 5 → Blue Ban 5 |
| Picks — fase 2 | Red Pick 4 → Blue Pick 4 e 5 → Red Pick 5 |

Durante cada etapa, apenas o slot correspondente permanece ativo. Ao selecionar um campeão, a aplicação mostra uma pré-seleção; a ação somente é persistida após a confirmação pelo botão **LOCK IN** ou **BAN**. Depois da confirmação, o campeão é bloqueado no catálogo e a interface avança para a próxima etapa.

## Arquitetura da aplicação

O projeto utiliza uma arquitetura de apresentação baseada em React, na qual o componente principal concentra o estado orquestrador do draft e delega a visualização para componentes especializados.

```text
src/
├── components/
│   ├── CardCampeao.jsx            # Item selecionável do catálogo
│   ├── ControlesGradeCampeoes.jsx # Zoom e espaçamento da grade
│   ├── FiltrosCampeoes.jsx        # Filtros por posição e busca
│   ├── IconeCapacete.jsx          # Placeholder reutilizável dos slots
│   ├── PainelBanimentos.jsx       # Slots de banimentos por equipe
│   ├── PainelEquipe.jsx           # Picks e bans de uma equipe
│   └── SkeletonCardCampeao.jsx    # Estado visual de carregamento
├── data/
│   └── posicoesCampeoes.js        # Mapeamento de posições competitivas
├── hooks/
│   ├── useAudioCampeao.js         # Pré-carregamento e reprodução de falas
│   └── useDadosCampeoes.js        # Ciclo de carregamento dos dados remotos
├── services/
│   └── dadosCampeoes.js           # Integração e normalização das APIs
├── App.jsx                        # Estado e regras do Champion Select
├── App.css                        # Layout, tema e animações da aplicação
└── main.jsx                       # Ponto de entrada React
```

### Organização do estado

O componente `App` mantém os seguintes estados de domínio:

- `indiceEtapaAtual`: identifica o turno em execução na sequência de draft.
- `selecoesPorEquipe`: armazena os cinco picks de cada equipe.
- `banimentosPorEquipe`: armazena os cinco bans de cada equipe.
- `preSelecao`: guarda temporariamente o campeão que aguarda confirmação.
- `campeaoSelecionado`: representa o card destacado no catálogo.
- `posicaoSelecionada` e `busca`: controlam o recorte visível da listagem.
- `tamanhoCard` e `espacamentoGrade`: controlam a densidade visual da grade.

Os identificadores de picks, bans e futuras restrições de *Fearless Draft* são reunidos em uma única lista de indisponibilidade. Isso evita duplicidade de regras e deixa preparada a extensão para séries com bloqueios entre partidas.

## Fontes de dados

A aplicação consome recursos públicos mantidos pela comunidade e pela Riot Games. As requisições são realizadas no navegador e não requerem credenciais.

| Fonte | Uso no projeto |
| --- | --- |
| [Data Dragon](https://developer.riotgames.com/docs/lol) | Versão atual do jogo, nomes em `pt_BR`, classes, ícones e splash arts. |
| [CommunityDragon](https://raw.communitydragon.org/) | Ícone da opção sem campeão, ícones de posição e áudios de Pick e Ban. |
| [CommunityDragon PT-BR](https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/pt_br/v1/champions/1.json) | Endpoints localizados para reprodução das falas em português brasileiro. |

O carregamento de campeões usa a versão mais recente disponibilizada pelo Data Dragon. Assim, a listagem acompanha as atualizações publicadas na fonte, desde que a estrutura do endpoint seja mantida compatível.

## Tecnologias e bibliotecas

- [React 19](https://react.dev/): composição da interface e gerenciamento de estado local.
- [Vite 8](https://vite.dev/): ambiente de desenvolvimento e geração do build de produção.
- [Lenis](https://lenis.darkroom.engineering/): rolagem suave e inercial da grade de campeões.
- [Oxlint](https://oxc.rs/docs/guide/usage/linter.html): análise estática do código JavaScript.
- CSS nativo: responsividade, animações, estados visuais e tema escuro da interface.

## Requisitos

- [Node.js](https://nodejs.org/) 20 ou superior.
- npm 10 ou superior.
- Conexão com a internet para obter os dados e os áudios dos campeões.
- Navegador moderno com suporte a ES Modules, CSS Grid e Web Audio/HTMLAudioElement.

## Execução local

1. Clone o repositório e entre na pasta do projeto.

   ```bash
   git clone https://github.com/joaogbrufino/draft.git
   cd draft
   ```

2. Instale as dependências.

   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento.

   ```bash
   npm run dev
   ```

4. Abra no navegador o endereço exibido pelo Vite, normalmente `http://localhost:5173`.

### Scripts disponíveis

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Inicia o ambiente de desenvolvimento com atualização em tempo real. |
| `npm run lint` | Executa a análise estática por meio do Oxlint. |
| `npm run build` | Gera a versão otimizada para produção em `dist/`. |
| `npm run preview` | Serve localmente o build de produção para validação. |

## Procedimento de uso

1. Aguarde o carregamento do catálogo de campeões.
2. Use os filtros de posição, a busca textual ou os controles da grade, se necessário.
3. Observe o slot destacado: ele informa a equipe e a ação da vez.
4. Clique em um campeão disponível para realizar a pré-seleção.
5. Confirme a ação com **BAN** ou **LOCK IN**.
6. A aplicação executa a animação, reproduz a fala localizada e avança para o próximo turno.
7. Ao concluir a sequência, os picks confirmados podem ser revisados e removidos para reiniciar o draft a partir da etapa afetada.

## Critérios de qualidade adotados

### Consistência de regras

O catálogo bloqueia tanto campeões escolhidos quanto banidos. O bloqueio é derivado do estado confirmado do draft, evitando que pré-seleções sejam confundidas com ações definitivas.

### Experiência de uso

- O slot ativo possui cor e gradiente associados à equipe azul ou vermelha.
- A confirmação é explícita: clicar no card não encerra o turno.
- O botão de ação permanece na mesma posição, reduzindo mudanças de layout.
- O feedback visual dos bans é diferente dos picks para facilitar a identificação de estados.
- A animação é desabilitada para pessoas que indicam preferência por movimento reduzido no sistema operacional.

### Desempenho e robustez

- As requisições de dados utilizam `AbortController`, cancelando o carregamento quando o componente é desmontado.
- Os áudios são pré-carregados após a pré-seleção e reutilizados por URL.
- A reprodução interrompe a fala anterior antes de iniciar uma nova, prevenindo sobreposição.
- A ausência ou falha de um arquivo de áudio não interrompe o avanço do draft.

## Limitações atuais

- Não há integração com o cliente oficial de League of Legends, autenticação, servidor ou partidas em rede.
- O mapeamento de posições é uma base estática de domínio e deve ser revisado quando houver mudanças relevantes no meta ou no elenco de campeões.
- O estado do draft não é persistido após atualização da página.
- O formato implementado corresponde a uma única partida; *Fearless Draft* está previsto no modelo de indisponibilidade, mas ainda não possui interface nem persistência de séries.
- Os recursos externos dependem da disponibilidade e da compatibilidade dos serviços Data Dragon e CommunityDragon.

## Possíveis extensões acadêmicas

- Persistir drafts em uma API própria e permitir compartilhamento por link.
- Criar testes unitários para a sequência de turnos e os estados de indisponibilidade.
- Acrescentar cronômetro por turno, histórico de ações e recuperação de sessão.
- Implementar séries melhor de três ou melhor de cinco com suporte completo a *Fearless Draft*.
- Adicionar estatísticas de composição, sinergia, funções e recomendações de banimento.
- Investigar acessibilidade por meio de testes com leitores de tela e navegação integral por teclado.
- Avaliar telemetria de uso e métricas de eficiência de interação em estudos de experiência do usuário.

## Considerações éticas e de propriedade intelectual

League of Legends, seus campeões e recursos associados pertencem à Riot Games. Este projeto é uma simulação educacional independente, sem vínculo oficial com a Riot Games, e utiliza dados públicos disponibilizados pelas fontes citadas. A interface foi construída de forma autoral, inspirada em padrões visuais de *Champion Select*, sem incorporar arquivos proprietários de interface do cliente oficial.

## Validação

Antes da entrega, execute:

```bash
npm run lint
npm run build
```

Esses comandos verificam, respectivamente, a conformidade estática do código e a geração do bundle de produção.

---

Projeto desenvolvido para fins acadêmicos e de estudo de interfaces interativas, estados de aplicação e integração com dados públicos de jogos digitais.
