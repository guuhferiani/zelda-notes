import { HeartPieceItem } from '../types';

export const HEART_PIECES_DATA: HeartPieceItem[] = [
  // Kokiri Forest & Lost Woods (2)
  { id: 1, region: 'Lost Woods', location: 'Jogo dos Skull Kids', requirement: 'Ocarina', linkAge: 'child', description: 'Toque a canção que eles tocarem na Ocarina para ganhar a peça.' },
  { id: 2, region: 'Lost Woods', location: 'Skull Kid solitário', requirement: 'Sarias Song', linkAge: 'child', description: 'Toque a Sarias Song para o Skull Kid que fica no toco de árvore.' },

  // Hyrule Field (5)
  { id: 3, region: 'Hyrule Field', location: 'Gruta perto do Lago Hylia', requirement: 'Bombas', linkAge: 'both', description: 'Exploda a cerca perto do cercado e vença a Deku Scrub.' },
  { id: 4, region: 'Hyrule Field', location: 'Gruta no norte (perto do castelo)', requirement: 'Dins Fire ou Iron Boots', linkAge: 'both', description: 'Destrua a pedra e use Dins Fire para queimar as teias.' },
  { id: 5, region: 'Hyrule Field', location: 'No fundo do poço da gruta com água', requirement: 'Iron Boots e Hookshot', linkAge: 'adult', description: 'Mergulhe com botas de ferro no lago subterrâneo.' },
  { id: 6, region: 'Hyrule Field', location: 'Perto do Rancho Lon Lon', requirement: 'Árvore (Rolar)', linkAge: 'both', description: 'Gruta escondida sob árvore.' },
  { id: 7, region: 'Hyrule Field', location: 'Perto do Vale Gerudo', requirement: 'Bombas', linkAge: 'both', description: 'Gruta secreta de pedras com Tektite.' },

  // Market (3)
  { id: 8, region: 'Market', location: 'Jogo do Baú do Tesouro (Treasure Box Game)', requirement: 'Lens of Truth (ou sorte)', linkAge: 'child', description: 'Use a Lens of Truth para enxergar dentro de cada baú até a última sala.' },
  { id: 9, region: 'Market', location: 'Jogo do Bombchu Bowling', requirement: 'Terminar Dodongos Cavern', linkAge: 'child', description: 'Acerte os alvos na parede móvel quando o prêmio for uma Peça de Coração.' },
  { id: 10, region: 'Market', location: 'Achar o Cachorro de Richard', requirement: 'Noite', linkAge: 'child', description: 'Encontre o cachorrinho branco perto da barraca e leve até a dona no beco.' },

  // Lon Lon Ranch (1)
  { id: 11, region: 'Lon Lon Ranch', location: 'Torre do Silo do Rancho', requirement: 'Nenhum', linkAge: 'child', description: 'Mova as caixas no fundo do silo para revelar o buraco com a peça.' },

  // Kakariko Village & Graveyard (8)
  { id: 12, region: 'Kakariko Village', location: 'Telhado da casa de Impa', requirement: 'Hookshot ou Cucco', linkAge: 'both', description: 'Pule do telhado para a cerca da casa com a mulher dos Cuccos.' },
  { id: 13, region: 'Kakariko Village', location: 'Dentro da Casa das 50 Skulltulas', requirement: '50 Tokens de Skulltula', linkAge: 'both', description: 'Fale com o homem liberto da maldição após coletar 50 tokens.' },
  { id: 14, region: 'Kakariko Village', location: 'Jogo do Tiro ao Alvo (Shooting Gallery)', requirement: 'Adulto + Bow', linkAge: 'adult', description: 'Acerte todas as 10 rupias na galeria de tiro da vila.' },
  { id: 15, region: 'Kakariko Village', location: 'Moinho de Vento (Windmill)', requirement: 'Boomerang ou Hookshot', linkAge: 'both', description: 'Pule das pás giratórias do moinho para alcançar o nicho alto.' },
  { id: 16, region: 'Graveyard', location: 'Tumba dos Compositores reais', requirement: 'Sun Song', linkAge: 'child', description: 'Derrote os ReDeads na tumba com Dins Fire ou toques da Sun Song.' },
  { id: 17, region: 'Graveyard', location: 'Tumba com caixão', requirement: 'Puxar túmulo', linkAge: 'child', description: 'Puxe o túmulo correto com flores e derrote o ReDead.' },
  { id: 18, region: 'Graveyard', location: 'Corrida com Dampe (primeira vez)', requirement: 'Adulto', linkAge: 'adult', description: 'Siga a chama de Dampe até o final da corrida subterrânea.' },
  { id: 19, region: 'Graveyard', location: 'Corrida com Dampe em menos de 1 minuto', requirement: 'Hookshot', linkAge: 'adult', description: 'Termine a corrida de Dampe em menos de 1 minuto e 00 segundos.' },

  // Death Mountain & Goron City (5)
  { id: 20, region: 'Death Mountain Trail', location: 'Abaixo da Grande Fada no topo', requirement: 'Cair na beirada', linkAge: 'both', description: 'Desça com cuidado pela beirada do penhasco na entrada da caverna.' },
  { id: 21, region: 'Death Mountain Crater', location: 'Paredão interno da cratera', requirement: 'Escalar parede', linkAge: 'both', description: 'Desça pelas vinhas no nicho da parede perto da entrada.' },
  { id: 22, region: 'Death Mountain Crater', location: 'Topo do pico de lava', requirement: 'Feijão Mágico (Magic Bean)', linkAge: 'adult', description: 'Ande na plataforma do feijão mágico crescido como adulto.' },
  { id: 23, region: 'Goron City', location: 'Vaso Gigante Giratório', requirement: 'Bomba / Bombchu', linkAge: 'child', description: 'Jogue uma bomba dentro do vaso giratório quando o rosto sorridente estiver alinhado.' },
  { id: 24, region: 'Goron City', location: 'Plataforma alta externa', requirement: 'Magic Bean', linkAge: 'adult', description: 'Voe no feijão mágico até a plataforma suspensa.' },

  // Zora's River & Domain & Fountain (5)
  { id: 25, region: 'Zoras River', location: 'Platô elevado no meio do rio', requirement: 'Cucco', linkAge: 'child', description: 'Carregue um Cucco pulando pelas plataformas até o pilar de pedra.' },
  { id: 26, region: 'Zoras River', location: 'Entrada das cachoeiras do Domínio Zora', requirement: 'Cucco', linkAge: 'child', description: 'Use o Cucco para planar na plataforma antes da grande cachoeira.' },
  { id: 27, region: 'Zoras River', location: 'Sapos Cantores (Song of Storms)', requirement: 'Song of Storms', linkAge: 'child', description: 'Toque a Song of Storms para os 5 sapinhos no tronco.' },
  { id: 28, region: 'Zoras River', location: 'Jogo dos Sapos Cantores (todas as canções)', requirement: 'Todas as canções normais', linkAge: 'child', description: 'Acerte as notas rápidas que os sapos mandam comer insetos.' },
  { id: 29, region: 'Zoras Domain', location: 'Acender todas as tochas da sala do trono', requirement: 'Deku Stick', linkAge: 'child', description: 'Corra rápido acendendo todas as tochas da parede até a cachoeira com o graveto.' },

  // Zora's Fountain & Ice Cavern (2)
  { id: 30, region: 'Zoras Fountain', location: 'Iceberg flutuante', requirement: 'Adulto', linkAge: 'adult', description: 'Pule entre os blocos de gelo flutuantes até a peça.' },
  { id: 31, region: 'Zoras Fountain', location: 'Fundo do lago congelado', requirement: 'Iron Boots e Zora Tunic', linkAge: 'adult', description: 'Mergulhe até o fundo de pedra com as botas de ferro.' },

  // Lake Hylia (3)
  { id: 32, region: 'Lake Hylia', location: 'Lagoa de Pesca (Fishing Pond)', requirement: 'Peixe de 10+ lbs', linkAge: 'child', description: 'Pesque um peixe de pelo menos 10 libras no lago de pesca como criança.' },
  { id: 33, region: 'Lake Hylia', location: 'Laboratório do Cientista', requirement: 'Golden Scale', linkAge: 'both', description: 'Mergulhe até o fundo da piscina do laboratório e toque o chão (8 metros).' },
  { id: 34, region: 'Lake Hylia', location: 'Telhado do Laboratório do Lago', requirement: 'Magic Bean ou Scarecrows Song', linkAge: 'adult', description: 'Suba no telhado pela planta de feijão mágico ou use o Longshot no espantalho.' },

  // Gerudo Valley & Desert (2)
  { id: 35, region: 'Gerudo Valley', location: 'Atrás da cachoeira no fundo do abismo', requirement: 'Cucco ou cair na água', linkAge: 'both', description: 'Desça até o rio lá embaixo e nade atrás da cachoeira até a escada secreta.' },
  { id: 36, region: 'Desert Colossus', location: 'Topo do Arco de Pedra do Colosso', requirement: 'Magic Bean', linkAge: 'adult', description: 'Voe na planta de feijão mágico até o arco de pedra sobre a entrada do templo.' }
];

