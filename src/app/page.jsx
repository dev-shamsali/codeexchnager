'use client';

import { useState, useCallback } from 'react';
import NoteList from '@/components/NoteList';
import CodeEditor from '@/components/CodeEditor';
import { Menu } from 'lucide-react';

export default function EditorPage() {
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // When a note is selected, keep same behavior and also close the drawer on small screens
  const handleSelect = useCallback((id) => {
    setSelectedNoteId(id);
    setIsSidebarOpen(false); // closes only matters on mobile; ignored on md+
  }, []);

  return (
    <div className="relative flex min-h-dvh md:h-screen overflow-hidden bg-[#1e1e1e]">

      {/* ===== Overlay (mobile only) ===== */}
      <div
        onClick={() => setIsSidebarOpen(false)}
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity md:hidden
          ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      {/* ===== Sidebar / Drawer ===== */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-80 sm:w-88 md:w-96
          transform bg-[#252526] border-r border-gray-700 overflow-y-auto
          transition-transform duration-300 ease-in-out
          md:static md:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <NoteList onSelect={handleSelect} />
      </aside>

      {/* ===== Main Editor Area ===== */}
      <main className="flex-1 bg-[#1e1e1e] overflow-hidden">
        {/* Top bar for mobile with hamburger */}
        <div className="md:hidden sticky top-0 z-20 flex items-center gap-2 p-3 border-b border-gray-800 bg-[#1e1e1e]">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-md bg-[#252526] border border-gray-700"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5 text-gray-200" />
          </button>
          <span className="text-sm text-gray-300">Codes</span>
        </div>

        <div className="p-4 h-full">
          {selectedNoteId ? (
            <CodeEditor noteId={selectedNoteId} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <h2 className="text-lg font-semibold">No Note Selected</h2>
                <p className="text-sm mt-1">
                  Select or create a note from the sidebar to start editing.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
