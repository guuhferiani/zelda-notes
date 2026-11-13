import { SkulltulaItem } from '../types';

export const SKULLTULAS_DATA: SkulltulaItem[] = [
  // Kokiri Forest (3)
  { id: 1, region: 'Kokiri Forest', location: 'Atrás da Casa dos Know-It-All Brothers', requirement: 'Espada / Estilingue', timeOfDay: 'night', linkAge: 'child' },
  { id: 2, region: 'Kokiri Forest', location: 'Buraco de terra macia ao lado da Loja Kokiri (use insetos em um pote)', requirement: 'Bugs num Pote', timeOfDay: 'both', linkAge: 'child' },
  { id: 3, region: 'Kokiri Forest', location: 'Telhado da Casa dos Gêmeos (atrás da casa)', requirement: 'Hookshot', timeOfDay: 'night', linkAge: 'adult' },

  // Inside the Deku Tree (4)
  { id: 4, region: 'Inside the Deku Tree', location: '3º Andar: Na grade na sala com o baú da bússola', requirement: 'Estilingue / Bumerangue', timeOfDay: 'both', linkAge: 'child' },
  { id: 5, region: 'Inside the Deku Tree', location: 'Subsolo (B1): Na vinha para subir', requirement: 'Estilingue', timeOfDay: 'both', linkAge: 'child' },
  { id: 6, region: 'Inside the Deku Tree', location: 'Subsolo (B1): Na cerca perto da água', requirement: 'Estilingue', timeOfDay: 'both', linkAge: 'child' },
  { id: 7, region: 'Inside the Deku Tree', location: 'Subsolo (B1): Atrás de uma parede quebrável com bomba', requirement: 'Bombas e Bumerangue', timeOfDay: 'both', linkAge: 'child' },

  // Lost Woods & Sacred Forest Meadow (4)
  { id: 8, region: 'Lost Woods', location: 'Buraco de terra macia perto da entrada de Goron City', requirement: 'Bugs num Pote', timeOfDay: 'both', linkAge: 'child' },
  { id: 9, region: 'Lost Woods', location: 'Buraco de terra macia perto da ponte da floresta', requirement: 'Bugs num Pote', timeOfDay: 'both', linkAge: 'child' },
  { id: 10, region: 'Lost Woods', location: 'Em cima do cogumelo gigante no topo (use Bean)', requirement: 'Magic Bean / Hookshot', timeOfDay: 'night', linkAge: 'adult' },
  { id: 11, region: 'Sacred Forest Meadow', location: 'Na parede leste do labirinto', requirement: 'Hookshot', timeOfDay: 'night', linkAge: 'adult' },

  // Hyrule Field (2)
  { id: 12, region: 'Hyrule Field', location: 'Árvore perto da entrada de Kakariko Village (Role na árvore)', requirement: 'Rolar na árvore', timeOfDay: 'both', linkAge: 'both' },
  { id: 13, region: 'Hyrule Field', location: 'Dentro de uma gruta secreta perto do vale Gerudo (bombeie o círculo de pedras)', requirement: 'Dins Fire ou Iron Boots + Hookshot', timeOfDay: 'both', linkAge: 'both' },

  // Market & Hyrule Castle (4)
  { id: 14, region: 'Market', location: 'Dentro de um vaso na Casa dos Guardas (perto da ponte levadiça)', requirement: 'Quebrar vaso rolando', timeOfDay: 'both', linkAge: 'child' },
  { id: 15, region: 'Hyrule Castle', location: 'Árvore logo na entrada do castelo (Role na árvore)', requirement: 'Rolar na árvore', timeOfDay: 'both', linkAge: 'child' },
  { id: 16, region: 'Hyrule Castle', location: 'Gruta secreta atrás das vinhas (Toque a Canção das Tempestades perto da árvore)', requirement: 'Song of Storms + Bombas', timeOfDay: 'both', linkAge: 'child' },
  { id: 17, region: 'Outside Ganon Castle', location: 'Atrás da pilastra em ruínas', requirement: 'Hookshot', timeOfDay: 'night', linkAge: 'adult' },

  // Lon Lon Ranch (4)
  { id: 18, region: 'Lon Lon Ranch', location: 'Árvore perto da entrada do rancho (Role na árvore)', requirement: 'Rolar na árvore', timeOfDay: 'both', linkAge: 'child' },
  { id: 19, region: 'Lon Lon Ranch', location: 'Na janela do segundo andar da casa de Talon', requirement: 'Bumerangue', timeOfDay: 'night', linkAge: 'child' },
  { id: 20, region: 'Lon Lon Ranch', location: 'Na parede sul cercada perto do silo', requirement: 'Bumerangue', timeOfDay: 'night', linkAge: 'child' },
  { id: 21, region: 'Lon Lon Ranch', location: 'Atrás da cerca de madeira externa', requirement: 'Bumerangue', timeOfDay: 'night', linkAge: 'child' },

  // Kakariko Village & Graveyard (8)
  { id: 22, region: 'Kakariko Village', location: 'Na árvore no centro da vila (Role na árvore)', requirement: 'Rolar na árvore', timeOfDay: 'night', linkAge: 'child' },
  { id: 23, region: 'Kakariko Village', location: 'Na parede da Casa das Skulltulas', requirement: 'Estilingue', timeOfDay: 'night', linkAge: 'child' },
  { id: 24, region: 'Kakariko Village', location: 'Na parede da casa em construção', requirement: 'Estilingue', timeOfDay: 'night', linkAge: 'child' },
  { id: 25, region: 'Kakariko Village', location: 'Na torre de vigia alta', requirement: 'Estilingue', timeOfDay: 'night', linkAge: 'child' },
  { id: 26, region: 'Kakariko Village', location: 'Na parede da casa de Impa', requirement: 'Estilingue', timeOfDay: 'night', linkAge: 'child' },
  { id: 27, region: 'Kakariko Village', location: 'No telhado da casa de Impa', requirement: 'Hookshot', timeOfDay: 'night', linkAge: 'adult' },
  { id: 28, region: 'Graveyard', location: 'Na parede sul alta do cemitério', requirement: 'Bumerangue / Hookshot', timeOfDay: 'night', linkAge: 'both' },
  { id: 29, region: 'Graveyard', location: 'Buraco de terra macia na tumba', requirement: 'Bugs num Pote', timeOfDay: 'both', linkAge: 'child' },

  // Death Mountain Trail & Goron City (8)
  { id: 30, region: 'Death Mountain Trail', location: 'Buraco de terra macia na entrada de Dodongos Cavern', requirement: 'Bugs num Pote', timeOfDay: 'both', linkAge: 'child' },
  { id: 31, region: 'Death Mountain Trail', location: 'Atrás de uma rocha destrutível no caminho', requirement: 'Bombas', timeOfDay: 'night', linkAge: 'child' },
  { id: 32, region: 'Death Mountain Trail', location: 'No paredão onde caiam pedras flamejantes', requirement: 'Megaton Hammer', timeOfDay: 'night', linkAge: 'adult' },
  { id: 33, region: 'Death Mountain Trail', location: 'Atrás de uma rocha destruível perto do topo', requirement: 'Megaton Hammer', timeOfDay: 'night', linkAge: 'adult' },
  { id: 34, region: 'Goron City', location: 'Atrás da plataforma suspensa com cordas no topo', requirement: 'Hookshot', timeOfDay: 'both', linkAge: 'adult' },
  { id: 35, region: 'Goron City', location: 'Dentro de um vaso de pedra no centro', requirement: 'Bomba', timeOfDay: 'both', linkAge: 'child' },
  { id: 36, region: 'Death Mountain Crater', location: 'Dentro de uma caixa na entrada da cratera', requirement: 'Rolar na caixa', timeOfDay: 'both', linkAge: 'both' },
  { id: 37, region: 'Death Mountain Crater', location: 'Buraco de terra macia no centro da cratera', requirement: 'Bugs num Pote + Bolero of Fire', timeOfDay: 'both', linkAge: 'child' },

  // Dodongo's Cavern (5)
  { id: 38, region: 'Dodongos Cavern', location: '1º Andar: Entrada com portas trancadas com bombas', requirement: 'Bombas', timeOfDay: 'both', linkAge: 'both' },
  { id: 39, region: 'Dodongos Cavern', location: '1º Andar: Atrás de parede quebrável perto da sala das estátuas', requirement: 'Bombas', timeOfDay: 'both', linkAge: 'both' },
  { id: 40, region: 'Dodongos Cavern', location: '2º Andar: Na vinha perto da grande escada abaixada', requirement: 'Estilingue / Bumerangue', timeOfDay: 'both', linkAge: 'both' },
  { id: 41, region: 'Dodongos Cavern', location: '2º Andar: Atrás do pilar na sala com Armos', requirement: 'Bumerangue / Hookshot', timeOfDay: 'both', linkAge: 'both' },
  { id: 42, region: 'Dodongos Cavern', location: '1º Andar: Sala antes do chefe King Dodongo', requirement: 'Bumerangue / Hookshot', timeOfDay: 'both', linkAge: 'both' },

  // Zora's River & Zora's Domain & Fountain (8)
  { id: 43, region: 'Zoras River', location: 'Na árvore da entrada do rio (Role na árvore)', requirement: 'Rolar na árvore', timeOfDay: 'both', linkAge: 'child' },
  { id: 44, region: 'Zoras River', location: 'Perto da ponte no meio do caminho', requirement: 'Hookshot', timeOfDay: 'night', linkAge: 'adult' },
  { id: 45, region: 'Zoras River', location: 'Na parede alta do platô onde Link compra feijões', requirement: 'Hookshot', timeOfDay: 'night', linkAge: 'adult' },
  { id: 46, region: 'Zoras River', location: 'Na cerca perto da entrada do Domínio Zora', requirement: 'Bumerangue / Hookshot', timeOfDay: 'night', linkAge: 'child' },
  { id: 47, region: 'Zoras Domain', location: 'Na parede congelada perto do Rei Zora', requirement: 'Hookshot', timeOfDay: 'night', linkAge: 'adult' },
  { id: 48, region: 'Zoras Fountain', location: 'Na árvore perto do Lord Jabu-Jabu', requirement: 'Rolar na árvore', timeOfDay: 'both', linkAge: 'child' },
  { id: 49, region: 'Zoras Fountain', location: 'Na parede perto do tronco flutuante', requirement: 'Bumerangue', timeOfDay: 'night', linkAge: 'child' },
  { id: 50, region: 'Zoras Fountain', location: 'Gruta secreta sob o grande bloco de prata', requirement: 'Silver Gauntlets', timeOfDay: 'night', linkAge: 'adult' },

  // Inside Jabu-Jabu's Belly (4)
  { id: 51, region: 'Inside Jabu-Jabu', location: 'Subsolo (B1): Na vinha que leva para o elevador', requirement: 'Bumerangue', timeOfDay: 'both', linkAge: 'child' },
  { id: 52, region: 'Inside Jabu-Jabu', location: 'Subsolo (B1): Parede perto dos tentáculos', requirement: 'Bumerangue', timeOfDay: 'both', linkAge: 'child' },
  { id: 53, region: 'Inside Jabu-Jabu', location: 'Subsolo (B1): Mesma sala, parede oposta', requirement: 'Bumerangue', timeOfDay: 'both', linkAge: 'child' },
  { id: 54, region: 'Inside Jabu-Jabu', location: '1º Andar: Sala antes do chefe Barinade', requirement: 'Bumerangue', timeOfDay: 'both', linkAge: 'child' },

  // Lake Hylia (5)
  { id: 55, region: 'Lake Hylia', location: 'Ilha com as duas árvores (Role na árvore)', requirement: 'Bumerangue / Hookshot', timeOfDay: 'night', linkAge: 'both' },
  { id: 56, region: 'Lake Hylia', location: 'Buraco de terra macia perto do Laboratório do Lago', requirement: 'Bugs num Pote', timeOfDay: 'both', linkAge: 'child' },
  { id: 57, region: 'Lake Hylia', location: 'Atrás do Laboratório na parede', requirement: 'Bumerangue', timeOfDay: 'night', linkAge: 'child' },
  { id: 58, region: 'Lake Hylia', location: 'Fundo do tanque do Laboratório (dentro da caixa)', requirement: 'Iron Boots + Hookshot', timeOfDay: 'both', linkAge: 'adult' },
  { id: 59, region: 'Lake Hylia', location: 'No tronco alto da árvore na ilha do lago', requirement: 'Longshot', timeOfDay: 'night', linkAge: 'adult' },

  // Forest Temple (5)
  { id: 60, region: 'Forest Temple', location: 'Entrada: Na vinha da primeira sala externa', requirement: 'Hookshot', timeOfDay: 'both', linkAge: 'adult' },
  { id: 61, region: 'Forest Temple', location: 'Sala central: Parede ao lado da porta do baú', requirement: 'Hookshot', timeOfDay: 'both', linkAge: 'adult' },
  { id: 62, region: 'Forest Temple', location: 'Jardim nordeste: Parede da ilha com água', requirement: 'Hookshot', timeOfDay: 'both', linkAge: 'adult' },
  { id: 63, region: 'Forest Temple', location: 'Jardim noroeste: Parede alta com vinhas', requirement: 'Hookshot', timeOfDay: 'both', linkAge: 'adult' },
  { id: 64, region: 'Forest Temple', location: 'Sala com paredes rotativas no subsolo', requirement: 'Hookshot', timeOfDay: 'both', linkAge: 'adult' },

  // Fire Temple (5)
  { id: 65, region: 'Fire Temple', location: 'Sala com ponte de lava e blocos de pedra', requirement: 'Song of Time + Hookshot', timeOfDay: 'both', linkAge: 'adult' },
  { id: 66, region: 'Fire Temple', location: 'Labirinto com pedras rolantes: Parede falsa', requirement: 'Bomba + Hookshot', timeOfDay: 'both', linkAge: 'adult' },
  { id: 67, region: 'Fire Temple', location: 'Labirinto de pedras rolantes: Parede alta', requirement: 'Hookshot', timeOfDay: 'both', linkAge: 'adult' },
  { id: 68, region: 'Fire Temple', location: 'Sala alta com anéis de fogo e vinhas', requirement: 'Scarecrows Song + Hookshot', timeOfDay: 'both', linkAge: 'adult' },
  { id: 69, region: 'Fire Temple', location: 'Sala antes da sala do chefe Volvagia', requirement: 'Megaton Hammer', timeOfDay: 'both', linkAge: 'adult' },

  // Ice Cavern (3)
  { id: 70, region: 'Ice Cavern', location: 'Sala com lâminas giratórias de gelo', requirement: 'Hookshot', timeOfDay: 'both', linkAge: 'adult' },
  { id: 71, region: 'Ice Cavern', location: 'Sala com o bloco de gelo empurrável', requirement: 'Hookshot', timeOfDay: 'both', linkAge: 'adult' },
  { id: 72, region: 'Ice Cavern', location: 'Sala com o coração de gelo vermelho', requirement: 'Blue Fire + Hookshot', timeOfDay: 'both', linkAge: 'adult' },

  // Water Temple (5)
  { id: 73, region: 'Water Temple', location: 'Atrás da torre central no nível intermediário', requirement: 'Longshot', timeOfDay: 'both', linkAge: 'adult' },
  { id: 74, region: 'Water Temple', location: 'No poço com redemoinhos de água', requirement: 'Longshot', timeOfDay: 'both', linkAge: 'adult' },
  { id: 75, region: 'Water Temple', location: 'Cachoeira na sala com plataformas caindo', requirement: 'Longshot', timeOfDay: 'both', linkAge: 'adult' },
  { id: 76, region: 'Water Temple', location: 'Parede alta na sala da estátua móvel', requirement: 'Longshot', timeOfDay: 'both', linkAge: 'adult' },
  { id: 77, region: 'Water Temple', location: 'No rio com Tektites antes do chefe Morpha', requirement: 'Longshot', timeOfDay: 'both', linkAge: 'adult' },

  // Bottom of the Well (3)
  { id: 78, region: 'Bottom of the Well', location: 'Sala com Like Like e piso falso', requirement: 'Lens of Truth', timeOfDay: 'both', linkAge: 'child' },
  { id: 79, region: 'Bottom of the Well', location: 'Sala trancada no centro do poço', requirement: 'Chave Pequena', timeOfDay: 'both', linkAge: 'child' },
  { id: 80, region: 'Bottom of the Well', location: 'Sala com caixões e Gibdos', requirement: 'Dins Fire / Sun Song', timeOfDay: 'both', linkAge: 'child' },

  // Shadow Temple (5)
  { id: 81, region: 'Shadow Temple', location: 'Sala com lâminas de guilhotina gigantes', requirement: 'Hover Boots / Longshot', timeOfDay: 'both', linkAge: 'adult' },
  { id: 82, region: 'Shadow Temple', location: 'Sala com a grande estátua de caveira giratória', requirement: 'Longshot', timeOfDay: 'both', linkAge: 'adult' },
  { id: 83, region: 'Shadow Temple', location: 'Atrás da parede de madeira com espinhos', requirement: 'Dins Fire', timeOfDay: 'both', linkAge: 'adult' },
  { id: 84, region: 'Shadow Temple', location: 'Sala com pilares invisíveis perto do barco fantasma', requirement: 'Scarecrows Song + Longshot', timeOfDay: 'both', linkAge: 'adult' },
  { id: 85, region: 'Shadow Temple', location: 'Atrás das três caveiras giratórias gigantes', requirement: 'Longshot', timeOfDay: 'both', linkAge: 'adult' },

  // Gerudo Valley & Fortress (6)
  { id: 86, region: 'Gerudo Valley', location: 'Na prancha de madeira ao lado da ponte quebrada', requirement: 'Bumerangue / Hookshot', timeOfDay: 'night', linkAge: 'both' },
  { id: 87, region: 'Gerudo Valley', location: 'Buraco de terra macia no fundo da cachoeira', requirement: 'Bugs num Pote', timeOfDay: 'both', linkAge: 'child' },
  { id: 88, region: 'Gerudo Valley', location: 'Atrás da barraca dos carpinteiros', requirement: 'Hookshot', timeOfDay: 'night', linkAge: 'adult' },
  { id: 89, region: 'Gerudo Valley', location: 'No arco de pedra sobre o vale', requirement: 'Hookshot', timeOfDay: 'night', linkAge: 'adult' },
  { id: 90, region: 'Gerudo Fortress', location: 'No alvo de tiro com arco a cavalo', requirement: 'Hookshot', timeOfDay: 'night', linkAge: 'adult' },
  { id: 91, region: 'Gerudo Fortress', location: 'Na parede alta do terraço da fortaleza', requirement: 'Hookshot', timeOfDay: 'night', linkAge: 'adult' },

  // Haunted Wasteland & Spirit Temple (9)
  { id: 92, region: 'Haunted Wasteland', location: 'Dentro da estrutura de pedra no caminho das bandeiras', requirement: 'Hookshot', timeOfDay: 'both', linkAge: 'adult' },
  { id: 93, region: 'Desert Colossus', location: 'Buraco de terra macia na frente do Templo do Espírito', requirement: 'Bugs num Pote + Requiem of Spirit', timeOfDay: 'both', linkAge: 'child' },
  { id: 94, region: 'Desert Colossus', location: 'Na palmeira perto do oásis', requirement: 'Hookshot', timeOfDay: 'night', linkAge: 'adult' },
  { id: 95, region: 'Desert Colossus', location: 'Na colina alta alcançada com o Feijão Mágico', requirement: 'Magic Bean', timeOfDay: 'night', linkAge: 'adult' },
  { id: 96, region: 'Spirit Temple', location: 'Na cerca da sala com Keese de fogo (lado infantil)', requirement: 'Bumerangue', timeOfDay: 'both', linkAge: 'child' },
  { id: 97, region: 'Spirit Temple', location: 'Na parede antes da sala dos espelhos (lado infantil)', requirement: 'Bumerangue', timeOfDay: 'both', linkAge: 'child' },
  { id: 98, region: 'Spirit Temple', location: 'Parede ao lado das escadas rolantes (lado infantil)', requirement: 'Bumerangue', timeOfDay: 'both', linkAge: 'child' },
  { id: 99, region: 'Spirit Temple', location: 'Na grande sala da estátua colosso de pedra (lado adulto)', requirement: 'Song of Time + Longshot', timeOfDay: 'both', linkAge: 'adult' },
  { id: 100, region: 'Spirit Temple', location: 'Sala dos espelhos móveis de luz (lado adulto)', requirement: 'Longshot', timeOfDay: 'both', linkAge: 'adult' }
];

