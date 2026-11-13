<div align="center">

# 🗡️ Zelda Notes: Companion App de Ocarina of Time (Switch 2 & PC)

**O seu diário de bordo inteligente e rastreador 100% de The Legend of Zelda: Ocarina of Time, sincronizado em tempo real com o jogo e com suporte a nuvem no Neon DB.**

---

</div>

## 📖 Visão Geral

O **Zelda Notes** é um aplicativo companion moderno inspirado na elegância dos aplicativos da Nintendo (Nintendo Switch Online App / Sheikah Slate). Ele se conecta diretamente ao save e ao motor do jogo para transformar a sua experiência de exploração em Hyrule, registrando marcos, checklists e notas de viagem em tempo real.

Compatível nativamente com o port de PC (**Hookshot**) e emuladores Switch 1/2 (**Lichii / Eglantine / Eden**).

---

## ✨ Recursos Principais

### 1. 🛡️ Painel do Herói (Live Game Sync)
- **Status do Jogador:** Exibição da vida em tempo real (corações cheios e vazios), contagem de rúpias e idade do Link (Criança / Adulto).
- **Região Atual:** Detecção automática de onde o Link está no mapa de Hyrule (ex: *Floresta Kokiri, Templo do Tempo, Kakariko, Montanha da Morte*).
- **Slot Ativo:** Monitoramento do save ativo em tempo real.

### 2. 📜 Diário de Bordo do Viajante (Journal Notes)
- Registro de anotações personalizadas do jogador com título, local e conteúdo.
- **Categorias temáticas:** Missão (*Quest*), Segredo (*Secret*), A Fazer (*Todo*), Masmorra (*Dungeon*) e História (*Lore*).
- **Notas Fixadas:** Destaque lembretes importantes no topo do diário.
- **Sincronização Dupla:** Salva instantaneamente no navegador (offline) e na nuvem no Neon DB.

### 3. 🕷️ Rastreador 100% de Skulltulas de Ouro (100 Aranhas)
- Checklist completo das **100 Skulltulas de Ouro** catalogadas individualmente.
- Filtro por **Região** (Floresta Kokiri, Árvore Deku, Vale Gerudo, Lago Hylia, Templos, etc.).
- Filtro por **Ciclo Dia/Noite** (Sol / Lua) e por **Idade do Link** (Criança / Adulto).
- Instruções detalhadas de onde cada aranha está e qual item é necessário para alcançá-la.

### 4. 💖 Rastreador das 36 Peças de Coração (Heart Pieces)
- Todas as **36 Peças de Coração** do jogo mapeadas com guia de obtenção.
- Contador automático de **Contêineres de Coração Forjados** (a cada 4 peças = +1 coração permanente).
- Indicador visual dinâmico de quantas peças faltam para o próximo coração.

### 5. 🎶 Cancioneiro da Ocarina Interativo (12 Músicas)
- Todas as 12 canções sagradas: canções mágicas (*Zelda's Lullaby, Epona's Song, Sun's Song, Song of Time, Song of Storms*) e canções de teleporte (*Minuet of Forest, Bolero of Fire, Serenade of Water, Nocturne of Shadow, Requiem of Spirit, Prelude of Light*).
- **Botões Originais:** Pauta visual com os botões clássicos (A, C-Cima, C-Baixo, C-Esquerda, C-Direita).
- **Áudio Sintetizado:** Clique em "Ouvir" para escutar as notas da ocarina sintetizadas diretamente pelo navegador com Web Audio API!

### 6. ⏳ Linha do Tempo da História (16 Marcos)
- Visualização cronológica dos principais eventos da lenda de Hyrule.
- Desde a libertação da Grande Árvore Deku até a Batalha Final no Castelo de Ganon.
- Registro retroativo baseado nas flags permanentes do seu arquivo de save (`progress.sav`).

### 7. ☁️ Sincronização em Nuvem com Neon PostgreSQL
- Suporte opcional a banco de dados serverless no **Neon (PostgreSQL)**.
- Mantenha suas anotações e checklists na nuvem para consultar e editar pelo celular ou qualquer outro dispositivo!
- Script DDL incluso em `db/schema.sql`.

---

## 🚀 Como Executar Localmente

### Pré-requisitos:
- **Node.js** (versão 18 ou superior instalada).

### 1. Instalar as dependências:
```bash
npm install
```

### 2. Iniciar a Bridge de sincronização com o jogo (Backend):
```bash
npm run bridge
```
*A bridge monitorará a sua pasta de saves em `C:\Users\Gustavo\Games\Hookshot\user\save` e servirá a API local na porta 3001.*

### 3. Iniciar o Frontend Web App:
Em outro terminal:
```bash
npm run dev
```
O aplicativo abrirá automaticamente no seu navegador em: **`http://localhost:3000`**!

---

## 🗄️ Como Configurar o Neon DB (Nuvem Opcional)

1. Crie uma conta gratuita em [neon.tech](https://neon.tech).
2. Crie um novo projeto (ex: `zelda-notes`).
3. Abra a aba **SQL Editor** no painel do Neon e cole o conteúdo do arquivo [`db/schema.sql`](db/schema.sql).
4. Copie a sua **Connection String** (começando com `postgresql://...`).
5. No **Zelda Notes**, clique no botão **Neon DB** na barra superior e cole a sua URL de conexão. Clique em **Testar Conexão** e pronto!

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS.
- **Ícones & Estilo:** Lucide React, Cinzel & Inter Typography, Glassmorphism Sheikah Theme.
- **Áudio:** Web Audio API (Ocarina Synthesizer).
- **Backend / Bridge:** Node.js Nativo (HTTP & File System Watcher).
- **Banco de Dados (Nuvem):** Neon Serverless PostgreSQL (`@neondatabase/serverless`).

---

<div align="center">

Desenvolvido para acompanhar a jornada do Herói do Tempo em **The Legend of Zelda: Ocarina of Time**.

</div>
