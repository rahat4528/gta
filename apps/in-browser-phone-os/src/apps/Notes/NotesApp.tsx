import { useState } from 'react';
import { Search, Plus, ChevronLeft, Trash2, Pin, Calendar } from 'lucide-react';
import { useOSStore } from '../../stores/useOSStore';

export function NotesApp() {
  const { notes, activeNoteId, setActiveNoteId, createNote, updateNote, deleteNote } =
    useOSStore();

  const [searchQuery, setSearchQuery] = useState('');

  const activeNote = notes.find((n) => n.id === activeNoteId);

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-neutral-950 text-white select-none overflow-hidden">
      {/* If a note is selected, show Note Editor */}
      {activeNote ? (
        <div className="flex-1 flex flex-col p-4">
          {/* Note Editor Header */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <button
              onClick={() => setActiveNoteId(null)}
              className="flex items-center space-x-1 text-ios-yellow hover:opacity-80 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-semibold">Notes</span>
            </button>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => deleteNote(activeNote.id)}
                className="p-1.5 text-neutral-400 hover:text-red-400 transition-colors"
                title="Delete Note"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Note Content Editor */}
          <div className="flex-1 flex flex-col pt-4 overflow-y-auto no-scrollbar space-y-3">
            <input
              type="text"
              value={activeNote.title}
              onChange={(e) => updateNote(activeNote.id, e.target.value, activeNote.body)}
              placeholder="Title"
              className="w-full bg-transparent text-2xl font-bold text-white focus:outline-none placeholder-neutral-600"
            />

            <span className="text-[11px] text-neutral-500 font-medium flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{activeNote.updatedAt}</span>
            </span>

            <textarea
              value={activeNote.body}
              onChange={(e) => updateNote(activeNote.id, activeNote.title, e.target.value)}
              placeholder="Type your notes here..."
              className="flex-1 w-full bg-transparent text-sm text-neutral-200 leading-relaxed focus:outline-none resize-none placeholder-neutral-600"
            />
          </div>
        </div>
      ) : (
        /* Notes List View */
        <div className="flex-1 flex flex-col p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-bold tracking-tight text-white">Notes</h2>
            <button
              onClick={createNote}
              className="p-1.5 rounded-full bg-ios-yellow text-black hover:bg-yellow-400 transition-colors shadow"
              title="New Note"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-ios-yellow"
            />
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
            {filteredNotes.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-neutral-500 space-y-2">
                <p className="text-xs">No Notes Found</p>
              </div>
            ) : (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => setActiveNoteId(note.id)}
                  className="bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800/80 rounded-2xl p-3.5 cursor-pointer transition-all shadow-sm group"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white group-hover:text-ios-yellow transition-colors truncate">
                      {note.title || 'Untitled Note'}
                    </h3>
                    {note.isPinned && <Pin className="w-3.5 h-3.5 text-ios-yellow" />}
                  </div>
                  <p className="text-xs text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
                    {note.body || 'No additional text'}
                  </p>
                  <span className="text-[10px] text-neutral-500 font-medium block mt-2">
                    {note.updatedAt}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
