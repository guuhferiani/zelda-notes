import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { JournalNotes } from './components/JournalNotes';
import { SkulltulaTracker } from './components/SkulltulaTracker';
import { HeartTracker } from './components/HeartTracker';
import { SongBook } from './components/SongBook';
import { StoryTimeline } from './components/StoryTimeline';
import { NeonSettingsModal } from './components/NeonSettingsModal';

import { SKULLTULAS_DATA } from './data/skulltulas';
import { HEART_PIECES_DATA } from './data/heartPieces';
import { OCARINA_SONGS_DATA } from './data/songs';
import { STORY_MILESTONES_DATA } from './data/storyEvents';

import { StorageService } from './services/storage';
import { GameSyncService } from './services/gameSync';
import { Note, LiveGameState, NeonConfig } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [gameState, setGameState] = useState<LiveGameState>(GameSyncService.getState());
  const [notes, setNotes] = useState<Note[]>([]);
  const [collectedSkulltulas, setCollectedSkulltulas] = useState<number[]>([]);
  const [collectedHearts, setCollectedHearts] = useState<number[]>([]);
  const [learnedSongs, setLearnedSongs] = useState<string[]>([]);
  const [completedEvents, setCompletedEvents] = useState<string[]>([]);
  const [neonConfig, setNeonConfig] = useState<NeonConfig>(StorageService.getNeonConfig());
  const [isNeonModalOpen, setIsNeonModalOpen] = useState(false);

  // Carrega dados locais ao iniciar
  useEffect(() => {
    setNotes(StorageService.getNotes());
    setCollectedSkulltulas(StorageService.getCollectedSkulltulas());
    setCollectedHearts(StorageService.getCollectedHeartPieces());
    setLearnedSongs(StorageService.getLearnedSongs());
    setCompletedEvents(StorageService.getCompletedEvents());

    // Se conecta ao listener do jogo ao vivo
    const unsubscribe = GameSyncService.subscribe((state) => {
      setGameState(state);
    });

    return () => unsubscribe();
  }, []);

  // Handlers do Diário
  const handleSaveNote = (note: Note) => {
    const updated = StorageService.saveNote(note);
    setNotes(updated);
  };

  const handleDeleteNote = (id: string) => {
    const updated = StorageService.deleteNote(id);
    setNotes(updated);
  };

  // Handlers dos Checklists
  const handleToggleSkulltula = (id: number) => {
    const updated = StorageService.toggleSkulltula(id);
    setCollectedSkulltulas([...updated]);
  };

  const handleToggleHeart = (id: number) => {
    const updated = StorageService.toggleHeartPiece(id);
    setCollectedHearts([...updated]);
  };

  const handleToggleSong = (songId: string) => {
    const updated = StorageService.toggleSong(songId);
    setLearnedSongs([...updated]);
  };

  const handleToggleEvent = (eventKey: string) => {
    const updated = StorageService.toggleEvent(eventKey);
    setCompletedEvents([...updated]);
  };

  const handleSaveNeonConfig = (newConfig: NeonConfig) => {
    StorageService.setNeonConfig(newConfig);
    setNeonConfig(newConfig);
  };

  return (
    <div className="min-h-screen flex flex-col bg-sheikah-darkest text-gray-100 selection:bg-sheikah-kokiri selection:text-black">
      
      {/* Barra de Navegação Superior */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        gameState={gameState}
        neonConfig={neonConfig}
        onOpenNeonModal={() => setIsNeonModalOpen(true)}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            gameState={gameState}
            collectedSkulltulasCount={collectedSkulltulas.length}
            collectedHeartsCount={collectedHearts.length}
            learnedSongsCount={learnedSongs.length}
            completedEventsCount={completedEvents.length}
            notes={notes}
            onNavigate={setActiveTab}
            onOpenNeonModal={() => setIsNeonModalOpen(true)}
            isNeonEnabled={neonConfig.isEnabled}
          />
        )}

        {activeTab === 'journal' && (
          <JournalNotes
            notes={notes}
            onSaveNote={handleSaveNote}
            onDeleteNote={handleDeleteNote}
            currentArea={gameState.location.areaDisplay}
          />
        )}

        {activeTab === 'skulltulas' && (
          <SkulltulaTracker
            skulltulas={SKULLTULAS_DATA}
            collectedIds={collectedSkulltulas}
            onToggle={handleToggleSkulltula}
          />
        )}

        {activeTab === 'hearts' && (
          <HeartTracker
            heartPieces={HEART_PIECES_DATA}
            collectedIds={collectedHearts}
            onToggle={handleToggleHeart}
          />
        )}

        {activeTab === 'songs' && (
          <SongBook
            songs={OCARINA_SONGS_DATA}
            learnedSongIds={learnedSongs}
            onToggle={handleToggleSong}
          />
        )}

        {activeTab === 'timeline' && (
          <StoryTimeline
            milestones={STORY_MILESTONES_DATA}
            completedEventKeys={completedEvents}
            onToggle={handleToggleEvent}
          />
        )}
      </main>

      {/* Rodapé */}
      <footer className="border-t border-sheikah-border/50 bg-sheikah-dark/80 py-4 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>Zelda Notes — Companion App de The Legend of Zelda: Ocarina of Time (Switch 2 & PC)</p>
          <p className="text-gray-400">
            Sincronizado com <span className="text-sheikah-gold font-medium">Hookshot PC</span>
          </p>
        </div>
      </footer>

      {/* Modal de Configuração do Neon DB */}
      <NeonSettingsModal
        isOpen={isNeonModalOpen}
        onClose={() => setIsNeonModalOpen(false)}
        config={neonConfig}
        onSaveConfig={handleSaveNeonConfig}
      />

    </div>
  );
}

export default App;
