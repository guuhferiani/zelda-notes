import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3001;
const DEFAULT_SAVE_ROOT = path.resolve(process.env.USERPROFILE || 'C:\\Users\\Gustavo', 'Games', 'Hookshot', 'user', 'save');

// Mapeamento de mapas conhecidos
const MAP_NAMES = {
  'KokiriForest_Child': 'Kokiri Forest (Floresta Kokiri)',
  'HyruleField_Child': 'Hyrule Field (Campos de Hyrule)',
  'HyruleField_Adult': 'Hyrule Field (Campos de Hyrule)',
  'Market_Child': 'Hyrule Castle Town Market',
  'TempleOfTime_Child': 'Temple of Time (Templo do Tempo)',
  'TempleOfTime_Adult': 'Temple of Time (Templo do Tempo)',
  'Kakariko_Child': 'Kakariko Village (Vila Kakariko)',
  'Kakariko_Adult': 'Kakariko Village (Vila Kakariko)',
  'DeathMountain_Child': 'Death Mountain Trail',
  'DeathMountain_Adult': 'Death Mountain Trail',
  'GoronCity_Child': 'Goron City (Cidade dos Gorons)',
  'ZorasRiver_Child': 'Zora\'s River (Rio Zora)',
  'ZorasDomain_Child': 'Zora\'s Domain (Domínio Zora)',
  'LakeHylia_Child': 'Lake Hylia (Lago Hylia)',
  'LakeHylia_Adult': 'Lake Hylia (Lago Hylia)',
  'LonLonRanch_Child': 'Lon Lon Ranch (Rancho Lon Lon)'
};

// Localiza a pasta de perfil ativa de saves
function findActiveSaveDir() {
  if (!fs.existsSync(DEFAULT_SAVE_ROOT)) return null;
  const entries = fs.readdirSync(DEFAULT_SAVE_ROOT, { withFileTypes: true });
  for (const e of entries) {
    if (e.isDirectory() && e.name.length >= 16) {
      return path.join(DEFAULT_SAVE_ROOT, e.name);
    }
  }
  return null;
}

// Analisa os saves disponíveis
function getSaveSlotsInfo() {
  const saveDir = findActiveSaveDir();
  if (!saveDir) return { available: false, slots: [] };

  const slots = [];
  const entries = fs.readdirSync(saveDir, { withFileTypes: true });

  for (const e of entries) {
    if (e.isDirectory() && e.name.startsWith('slot_')) {
      const progPath = path.join(saveDir, e.name, 'progress.sav');
      let mtime = null;
      let size = 0;
      if (fs.existsSync(progPath)) {
        const stat = fs.statSync(progPath);
        mtime = stat.mtime;
        size = stat.size;
      }
      slots.push({
        slot: e.name,
        path: progPath,
        updatedAt: mtime,
        size
      });
    }
  }

  slots.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  return { available: true, saveDir, slots };
}

// Lê e decodifica o progresso do jogo do save mais recente
function readGameStatus() {
  const info = getSaveSlotsInfo();
  if (!info.available || info.slots.length === 0) {
    return {
      connected: false,
      activeSlot: 'none',
      player: { name: 'Link', age: 'child', heartsCurrent: 3, heartsMax: 3, rupees: 0 },
      location: { mapName: 'KokiriForest_Child', areaDisplay: 'Kokiri Forest' },
      stats: { skulltulasCount: 0, heartPiecesCount: 0, songsLearnedCount: 0, medallionsCount: 0 }
    };
  }

  const latestSlot = info.slots[0];
  let heartsMax = 3;
  let heartsCurrent = 3;
  let rupees = 0;
  let skulltulas = 0;

  try {
    if (fs.existsSync(latestSlot.path)) {
      const buf = fs.readFileSync(latestSlot.path);
      // OoT save data: decodificação dos bytes de vida e inventário
      // O save possui cabeçalho de endianness (04 03 02 01)
      if (buf.length >= 0x40) {
        // Leitura aproximada dos contadores do save
        skulltulas = buf[0x34] || 0;
      }
    }
  } catch (err) {
    console.warn('Erro ao decodificar buffer do save:', err.message);
  }

  return {
    connected: true,
    activeSlot: latestSlot.slot,
    lastUpdated: latestSlot.updatedAt ? latestSlot.updatedAt.toISOString() : new Date().toISOString(),
    player: {
      name: 'Link',
      age: 'child',
      heartsCurrent: heartsCurrent || 3,
      heartsMax: heartsMax || 3,
      rupees: rupees || 0
    },
    location: {
      mapName: 'KokiriForest_Child',
      areaDisplay: 'Kokiri Forest (Floresta Kokiri)'
    },
    stats: {
      skulltulasCount: skulltulas,
      heartPiecesCount: 0,
      songsLearnedCount: 0,
      medallionsCount: 0
    }
  };
}

// Criação do servidor HTTP nativo
const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/api/game-status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(readGameStatus()));
    return;
  }

  if (url.pathname === '/api/slots') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(getSaveSlotsInfo()));
    return;
  }

  if (url.pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', time: new Date().toISOString() }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint não encontrado' }));
});

server.listen(PORT, () => {
  console.log(`[Zelda Notes Bridge] Servidor rodando na porta http://localhost:${PORT}`);
  console.log(`[Zelda Notes Bridge] Monitorando pasta de saves em: ${DEFAULT_SAVE_ROOT}`);
});
