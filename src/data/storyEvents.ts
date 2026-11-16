import { StoryMilestone } from '../types';

export const STORY_MILESTONES_DATA: StoryMilestone[] = [
  // Era da Criança (Child Era)
  {
    key: 'deku_tree_cleared',
    title: 'A Grande Árvore Deku',
    description: 'Navi despertou Link na Floresta Kokiri a pedido da Grande Árvore Deku. Após equipar a Espada Kokiri e o Escudo Deku, Link adentrou a árvore sagrada, derrotou a Rainha Parasita Gohma e recebeu a Esmeralda Kokiri — a Pedra Espiritual da Floresta.',
    objective: 'Vá para o interior da Grande Árvore Deku.',
    objectiveHighlight: 'Grande Árvore Deku',
    category: 'child',
    order: 1
  },
  {
    key: 'met_princess_zelda',
    title: 'A Princesa de Hyrule',
    description: 'Seguindo os conselhos da Árvore Deku, Link partiu da floresta com a Ocarina das Fadas dada por Saria e infiltrou-se pelos jardins do Castelo de Hyrule. Lá, encontrou a Princesa Zelda, que revelou suas visões sobre Ganondorf e lhe entregou a Carta de Zelda.',
    objective: 'Encontre a Princesa Zelda no Castelo de Hyrule.',
    objectiveHighlight: 'Castelo de Hyrule',
    category: 'child',
    order: 2
  },
  {
    key: 'dodongos_cavern_cleared',
    title: 'A Pedra Espiritual do Fogo',
    description: 'Zelda entregou a Link uma carta que concedia passagem livre pelo reino, e ele partiu em busca das outras Pedras Espirituais, a começar pela do fogo. "Sua primeira parada é a Vila Kakariko, depois a Montanha da Morte.", disse Impa.',
    objective: 'Vá para a Montanha da Morte.',
    objectiveHighlight: 'Montanha da Morte',
    category: 'child',
    order: 3
  },
  {
    key: 'jabu_jabu_cleared',
    title: 'A Pedra Espiritual da Água',
    description: 'Com o Rubi Goron em mãos, Link seguiu pelo Rio Zora até o Domínio Zora. Para obter a Safira Zora, resgatou a Princesa Ruto da barriga do Lorde Jabu-Jabu e derrotou a criatura elétrica Barinade.',
    objective: 'Explore o Domínio Zora e a Barriga de Jabu-Jabu.',
    objectiveHighlight: 'Domínio Zora',
    category: 'child',
    order: 4
  },
  {
    key: 'door_of_time_opened',
    title: 'Abertura da Porta do Tempo',
    description: 'Reunidas as três Pedras Espirituais, Link retornou ao Mercado sob tempestade e recebeu a Ocarina do Tempo das mãos de Zelda enquanto fugia de Ganondorf. Diante do altar sagrado, tocou a Canção do Tempo.',
    objective: 'Toque a Canção do Tempo no Templo do Tempo.',
    objectiveHighlight: 'Templo do Tempo',
    category: 'child',
    order: 5
  },
  {
    key: 'master_sword_drawn',
    title: 'O Despertar da Master Sword',
    description: 'Ao empunhar a lendária Master Sword do Pedestal do Tempo, o espírito de Link foi selado por sete anos até que estivesse pronto para enfrentar o mal. Ao despertar como adulto, Rauru revelou que seis Sábios precisavam ser despertados.',
    objective: 'Empunhe a Master Sword no Pedestal do Tempo.',
    objectiveHighlight: 'Master Sword',
    category: 'child',
    order: 6
  },

  // Era Adulta (Adult Era)
  {
    key: 'forest_temple_cleared',
    title: 'Templo da Floresta: Despertar de Saria',
    description: 'Após conquistar o Hookshot no Cemitério de Kakariko, Link adentrou a Campina Sagrada da Floresta, aprendeu o Minueto da Floresta com Sheik, derrotou Ganon Fantasma e despertou Saria como a Sábia da Floresta.',
    objective: 'Liberte o Templo da Floresta na Campina Sagrada.',
    objectiveHighlight: 'Templo da Floresta',
    category: 'adult',
    order: 7
  },
  {
    key: 'fire_temple_cleared',
    title: 'Templo do Fogo: Resgate dos Gorons',
    description: 'Escalando a cratera vulcânica da Montanha da Morte após aprender o Bolero do Fogo, Link libertou os Gorons aprisionados, enfrentou o dragão subterrâneo Volvagia e recebeu de Darunia o Medalhão do Fogo.',
    objective: 'Derrote Volvagia no Templo do Fogo.',
    objectiveHighlight: 'Templo do Fogo',
    category: 'adult',
    order: 8
  },
  {
    key: 'ice_cavern_iron_boots',
    title: 'A Caverna de Gelo & Botas de Ferro',
    description: 'Para alcançar o santuário submerso no Lago Hylia, Link explorou as passagens congeladas atrás do Lorde Jabu-Jabu, conquistando as Botas de Ferro e aprendendo a Serenata da Água com Sheik.',
    objective: 'Recupere as Botas de Ferro na Caverna de Gelo.',
    objectiveHighlight: 'Caverna de Gelo',
    category: 'adult',
    order: 9
  },
  {
    key: 'water_temple_cleared',
    title: 'Templo da Água: Despertar de Ruto',
    description: 'Controlando os níveis da água nos andares do templo no fundo do Lago Hylia, Link enfrentou seu próprio reflexo, o Link Sombrio, e derrotou Morpha para despertar a Princesa Ruto como Sábia da Água.',
    objective: 'Explore o fundo do Lago Hylia no Templo da Água.',
    objectiveHighlight: 'Templo da Água',
    category: 'adult',
    order: 10
  },
  {
    key: 'bottom_of_well_lens',
    title: 'O Fundo do Poço de Kakariko',
    description: 'Voltando brevemente à infância e tocando a Canção das Tempestades no moinho, Link drenou o poço da Vila Kakariko e recuperou a Lente da Verdade para enxergar além das ilusões.',
    objective: 'Recupere a Lente da Verdade no Poço de Kakariko.',
    objectiveHighlight: 'Poço de Kakariko',
    category: 'adult',
    order: 11
  },
  {
    key: 'shadow_temple_cleared',
    title: 'Templo da Sombra: O Olho da Verdade',
    description: 'Guiado pelo Noturno da Sombra até a colina do cemitério, Link navegou pelo barco das almas e derrotou Bongo Bongo nas profundezas da escuridão, despertando Impa como a Sábia da Sombra.',
    objective: 'Conclua o Templo da Sombra acima do Cemitério.',
    objectiveHighlight: 'Templo da Sombra',
    category: 'adult',
    order: 12
  },
  {
    key: 'gerudo_fortress_rescued',
    title: 'O Resgate dos Carpinteiros',
    description: 'Saltando pelo desfiladeiro do Vale Gerudo com Epona, Link infiltrou-se na Fortaleza das Gerudo, libertou os quatro carpinteiros capturados e recebeu o Cartão de Membro Gerudo para atravessar o deserto.',
    objective: 'Liberte os carpinteiros na Fortaleza Gerudo.',
    objectiveHighlight: 'Fortaleza Gerudo',
    category: 'adult',
    order: 13
  },
  {
    key: 'spirit_temple_cleared',
    title: 'Templo do Espírito: Despertar de Nabooru',
    description: 'Atravessando o Deserto Assombrado até o Colosso do Deserto, Link alternou entre criança e adulto para vencer o Templo do Espírito, derrotou as irmãs Twinrova e despertou Nabooru como Sábia do Espírito.',
    objective: 'Conquiste o Medalhão do Espírito no Colosso do Deserto.',
    objectiveHighlight: 'Templo do Espírito',
    category: 'adult',
    order: 14
  },
  {
    key: 'light_arrows_obtained',
    title: 'As Flechas de Luz de Zelda',
    description: 'Com os seis Medalhões reunidos, Link retornou ao Templo do Tempo. Sheik revelou sua verdadeira identidade como a Princesa Zelda e confiou a Link as sagradas Flechas de Luz antes de ser capturada por Ganondorf.',
    objective: 'Retorne ao Templo do Tempo com os 6 Medalhões.',
    objectiveHighlight: 'Templo do Tempo',
    category: 'adult',
    order: 15
  },
  {
    key: 'ganon_castle_final_battle',
    title: 'A Batalha Final no Castelo de Ganon',
    description: 'Os seis Sábios ergueram uma ponte de luz sobre o abismo. Link invadiu o Castelo de Ganon, rompeu as seis barreiras, derrotou Ganondorf e venceu Ganon com a Master Sword para restaurar a paz em Hyrule.',
    objective: 'Enfrente Ganondorf na torre do Castelo de Ganon.',
    objectiveHighlight: 'Castelo de Ganon',
    category: 'adult',
    order: 16
  }
];
