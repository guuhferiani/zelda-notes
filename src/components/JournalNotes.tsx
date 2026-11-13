import React, { useState } from 'react';
import { 
  Scroll, 
  Plus, 
  Trash2, 
  Pin, 
  Search, 
  Tag, 
  MapPin, 
  Calendar,
  Save,
  Check
} from 'lucide-react';
import { Note } from '../types';

interface JournalNotesProps {
  notes: Note[];
  onSaveNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
  currentArea: string;
}

export const JournalNotes: React.FC<JournalNotesProps> = ({
  notes,
  onSaveNote,
  onDeleteNote,
  currentArea
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [currentNote, setCurrentNote] = useState<Partial<Note>>({
    title: '',
    content: '',
    area: currentArea || 'Hyrule Field',
    category: 'quest',
    isPinned: false
  });

  const categories = [
    { id: 'all', label: 'Todas' },
    { id: 'quest', label: 'Missão', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    { id: 'secret', label: 'Segredo', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    { id: 'todo', label: 'A Fazer', color: 'bg-sky-500/20 text-sky-300 border-sky-500/30' },
    { id: 'dungeon', label: 'Masmorra', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    { id: 'lore', label: 'História / Lore', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' }
  ];

  const handleStartNew = () => {
    setCurrentNote({
      id: crypto.randomUUID(),
      title: '',
      content: '',
      area: currentArea || 'Hyrule',
      category: 'quest',
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setIsEditing(true);
  };

  const handleEdit = (note: Note) => {
    setCurrentNote(note);
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentNote.title?.trim() || !currentNote.content?.trim()) return;

    const noteToSave: Note = {
      id: currentNote.id || crypto.randomUUID(),
      title: currentNote.title.trim(),
      content: currentNote.content.trim(),
      area: currentNote.area || 'Hyrule',
      category: (currentNote.category as any) || 'quest',
      isPinned: !!currentNote.isPinned,
      createdAt: currentNote.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSaveNote(noteToSave);
    setIsEditing(false);
  };

  const filteredNotes = notes.filter((n) => {
    const matchesSearch = 
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.area.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || n.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    // Pinned notes first, then newest
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-sheikah-card border border-sheikah-border p-5 rounded-xl">
        <div>
          <h2 className="text-xl font-bold text-white font-hylian flex items-center gap-2">
            <Scroll className="w-5 h-5 text-sheikah-gold" />
            <span>Diário de Bordo do Herói</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Anote pistas, baús inacessíveis, lembretes de feijões e descobertas em Hyrule.
          </p>
        </div>

        <button
          onClick={handleStartNew}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sheikah-kokiri hover:bg-emerald-400 text-sheikah-darkest font-semibold text-sm transition-all shadow-glow-green self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Anotação</span>
        </button>
      </div>

      {/* Formulário de Criação / Edição (Modal ou Accordion) */}
      {isEditing && (
        <form onSubmit={handleSave} className="bg-sheikah-card border border-sheikah-kokiri/50 rounded-xl p-5 shadow-glow-green/20 space-y-4">
          <div className="flex items-center justify-between border-b border-sheikah-border pb-3">
            <h3 className="font-bold text-base text-sheikah-gold">
              {currentNote.id ? 'Editar Registro' : 'Novo Registro de Viagem'}
            </h3>
            <button 
              type="button" 
              onClick={() => setIsEditing(false)} 
              className="text-xs text-gray-400 hover:text-white"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-300 mb-1">Título do Registro</label>
              <input
                type="text"
                placeholder="Ex: Baú atrás do fogo no Templo do Tempo"
                value={currentNote.title || ''}
                onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-lg bg-sheikah-darkest border border-sheikah-border text-white text-sm focus:outline-none focus:border-sheikah-kokiri"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Região / Local</label>
              <input
                type="text"
                placeholder="Ex: Death Mountain"
                value={currentNote.area || ''}
                onChange={(e) => setCurrentNote({ ...currentNote, area: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-sheikah-darkest border border-sheikah-border text-white text-sm focus:outline-none focus:border-sheikah-kokiri"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Categoria</label>
              <select
                value={currentNote.category || 'quest'}
                onChange={(e) => setCurrentNote({ ...currentNote, category: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg bg-sheikah-darkest border border-sheikah-border text-white text-sm focus:outline-none focus:border-sheikah-kokiri"
              >
                <option value="quest">Missão Principal / Secundária</option>
                <option value="secret">Segredo / Gruta Escondida</option>
                <option value="todo">A Fazer Mais Tarde</option>
                <option value="dungeon">Masmorra / Templo</option>
                <option value="lore">História / NPC Importante</option>
              </select>
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300 font-medium">
                <input
                  type="checkbox"
                  checked={!!currentNote.isPinned}
                  onChange={(e) => setCurrentNote({ ...currentNote, isPinned: e.target.checked })}
                  className="rounded border-sheikah-border text-sheikah-gold focus:ring-0 w-4 h-4"
                />
                <Pin className="w-3.5 h-3.5 text-sheikah-gold" />
                <span>Fixar no topo do diário</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Conteúdo das Anotações</label>
            <textarea
              rows={4}
              placeholder="Descreva o que você descobriu, itens necessários ou o que falta fazer..."
              value={currentNote.content || ''}
              onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
              required
              className="w-full px-3 py-2 rounded-lg bg-sheikah-darkest border border-sheikah-border text-white text-sm focus:outline-none focus:border-sheikah-kokiri"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sheikah-kokiri text-sheikah-darkest font-semibold text-xs hover:bg-emerald-400 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salvar Registro</span>
            </button>
          </div>
        </form>
      )}

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por título, local ou palavra-chave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-sheikah-card border border-sheikah-border text-white text-xs focus:outline-none focus:border-sheikah-kokiri"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                selectedCategory === c.id
                  ? 'bg-sheikah-gold text-sheikah-darkest font-bold'
                  : 'bg-sheikah-card text-gray-400 hover:text-white border border-sheikah-border/60'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Anotações */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-12 bg-sheikah-card border border-sheikah-border/60 rounded-xl text-gray-400">
          <Scroll className="w-10 h-10 mx-auto text-zinc-600 mb-2" />
          <p className="text-sm font-medium">Nenhum registro encontrado para este filtro.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className={`relative bg-sheikah-card border rounded-xl p-4 transition-all hover:border-sheikah-border/80 flex flex-col justify-between ${
                note.isPinned ? 'border-sheikah-gold/50 shadow-glow-gold/20' : 'border-sheikah-border'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {note.isPinned && (
                      <Pin className="w-3.5 h-3.5 text-sheikah-gold fill-sheikah-gold flex-shrink-0" />
                    )}
                    <h3 className="font-bold text-white text-base hover:text-sheikah-gold transition-colors">
                      {note.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(note)}
                      className="p-1 text-gray-400 hover:text-sheikah-gold transition-colors"
                      title="Editar"
                    >
                      <Tag className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-1.5 text-xs">
                  <span className="flex items-center gap-1 text-gray-400 bg-sheikah-darkest px-2 py-0.5 rounded border border-sheikah-border/40">
                    <MapPin className="w-3 h-3 text-sheikah-gold" />
                    {note.area}
                  </span>
                  <span className="text-[11px] uppercase font-semibold text-sheikah-kokiri bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                    {note.category}
                  </span>
                </div>

                <p className="text-xs text-gray-300 mt-3 whitespace-pre-wrap leading-relaxed">
                  {note.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-sheikah-border/40 flex items-center justify-between text-[10px] text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(note.updatedAt).toLocaleDateString('pt-BR')} às {new Date(note.updatedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
