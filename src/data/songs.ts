import { OcarinaSong } from '../types';

export const OCARINA_SONGS_DATA: OcarinaSong[] = [
  // Músicas Mágicas / Especiais
  {
    id: 'zeldas-lullaby',
    name: "Zelda's Lullaby",
    namePt: "Canção de Ninar de Zelda",
    notes: ['LEFT', 'UP', 'RIGHT', 'LEFT', 'UP', 'RIGHT'],
    effect: 'Abre passagens da Família Real de Hyrule, resolve enigmas e repara placas.',
    location: 'Ensinada por Impa nos jardins do Castelo de Hyrule.',
    category: 'magic'
  },
  {
    id: 'eponas-song',
    name: "Epona's Song",
    namePt: "Canção de Epona",
    notes: ['UP', 'LEFT', 'RIGHT', 'UP', 'LEFT', 'RIGHT'],
    effect: 'Chama Epona no campo de Hyrule e enche garrafas com Leite de vaca.',
    location: 'Ensinada por Malon no Rancho Lon Lon.',
    category: 'magic'
  },
  {
    id: 'sarias-song',
    name: "Saria's Song",
    namePt: "Canção de Saria",
    notes: ['DOWN', 'RIGHT', 'LEFT', 'DOWN', 'RIGHT', 'LEFT'],
    effect: 'Permite conversar telepaticamente com Saria e anima Darunia para dançar.',
    location: 'Ensinada por Saria no Sacred Forest Meadow.',
    category: 'magic'
  },
  {
    id: 'suns-song',
    name: "Sun's Song",
    namePt: "Canção do Sol",
    notes: ['RIGHT', 'DOWN', 'UP', 'RIGHT', 'DOWN', 'UP'],
    effect: 'Alterna instantaneamente entre o dia e a noite e paralisa zumbis ReDeads e Gibdos.',
    location: 'Encontrada na Tumba da Família Real no Cemitério de Kakariko.',
    category: 'magic'
  },
  {
    id: 'song-of-time',
    name: "Song of Time",
    namePt: "Canção do Tempo",
    notes: ['RIGHT', 'A', 'DOWN', 'RIGHT', 'A', 'DOWN'],
    effect: 'Abre a Porta do Tempo no Templo do Tempo e move os grandes blocos azuis do tempo.',
    location: 'Jogada pela Princesa Zelda no fosso do castelo de Hyrule.',
    category: 'magic'
  },
  {
    id: 'song-of-storms',
    name: "Song of Storms",
    namePt: "Canção das Tempestades",
    notes: ['A', 'DOWN', 'UP', 'A', 'DOWN', 'UP'],
    effect: 'Invoca chuva torrencial, faz brotar fadas em pedras fofoqueiras e ativa o moinho.',
    location: 'Ensinada pelo Homem do Fonógrafo no Moinho de Kakariko.',
    category: 'magic'
  },

  // Músicas de Teleporte (Warp Songs)
  {
    id: 'minuet-of-forest',
    name: "Minuet of Forest",
    namePt: "Minueto da Floresta",
    notes: ['A', 'UP', 'LEFT', 'RIGHT', 'LEFT', 'RIGHT'],
    effect: 'Teleporta Link diretamente para a entrada do Templo da Floresta (Sacred Forest Meadow).',
    location: 'Ensinada por Sheik na entrada do Templo da Floresta.',
    category: 'warp'
  },
  {
    id: 'bolero-of-fire',
    name: "Bolero of Fire",
    namePt: "Bolero do Fogo",
    notes: ['DOWN', 'A', 'DOWN', 'A', 'RIGHT', 'DOWN', 'RIGHT', 'DOWN'],
    effect: 'Teleporta Link para o interior da Cratera da Montanha da Morte (Templo do Fogo).',
    location: 'Ensinada por Sheik na Cratera da Montanha da Morte.',
    category: 'warp'
  },
  {
    id: 'serenade-of-water',
    name: "Serenade of Water",
    namePt: "Serenata da Água",
    notes: ['A', 'DOWN', 'RIGHT', 'RIGHT', 'LEFT'],
    effect: 'Teleporta Link para a ilha acima do Templo da Água no Lago Hylia.',
    location: 'Ensinada por Sheik na Caverna de Gelo (Ice Cavern).',
    category: 'warp'
  },
  {
    id: 'nocturne-of-shadow',
    name: "Nocturne of Shadow",
    namePt: "Noturno da Sombra",
    notes: ['LEFT', 'RIGHT', 'RIGHT', 'A', 'LEFT', 'RIGHT', 'DOWN'],
    effect: 'Teleporta Link para a plataforma alta sobre o Cemitério (Templo da Sombra).',
    location: 'Ensinada por Sheik após o incêndio na Vila Kakariko.',
    category: 'warp'
  },
  {
    id: 'requiem-of-spirit',
    name: "Requiem of Spirit",
    namePt: "Réquiem do Espírito",
    notes: ['A', 'DOWN', 'A', 'RIGHT', 'DOWN', 'A'],
    effect: 'Teleporta Link para o Deserto Colosso na entrada do Templo do Espírito.',
    location: 'Ensinada por Sheik do lado de fora do Templo do Espírito.',
    category: 'warp'
  },
  {
    id: 'prelude-of-light',
    name: "Prelude of Light",
    namePt: "Prelúdio da Luz",
    notes: ['UP', 'RIGHT', 'UP', 'RIGHT', 'LEFT', 'UP'],
    effect: 'Teleporta Link diretamente para o pedestal da Master Sword no Templo do Tempo.',
    location: 'Ensinada por Sheik no Templo do Tempo após concluir o Templo da Floresta.',
    category: 'warp'
  }
];
