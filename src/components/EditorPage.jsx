'use client';

import { useState, useEffect, useRef, Fragment } from 'react';
import { database } from '../lib/firebase';
import { ref, onValue, update } from 'firebase/database';
import Editor from '@monaco-editor/react';
import { Dialog, Transition } from '@headlessui/react';

export default function CodeEditor({ noteId }) {
  const [code, setCode] = useState('');
  const [locked, setLocked] = useState(false);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(true);

  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const saveTimer = useRef(null);

  /* ---------- Load note ---------- */
  useEffect(() => {
    if (!noteId) return;
    const noteRef = ref(database, `notes/${noteId}`);

    const unsubscribe = onValue(noteRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setCode('');
        setLocked(false);
        setPin('');
        setLoading(false);
        return;
      }

      const isLocked = !!data.locked;
      const pinCode = data.pinCode || '';

      setCode(data.content || '');
      setLocked(isLocked);
      setPin(pinCode);
      setLoading(false);

      // If locked with PIN, ask once via modal
      if (isLocked && pinCode) {
        setPinModalOpen(true);
        setPinInput('');
        setPinError('');
      }
    });

    return () => {
      unsubscribe();
      setLoading(true);
      setCode('');
      setLocked(false);
      setPin('');
      setPinModalOpen(false);
      setPinError('');
    };
  }, [noteId]);

  /* ---------- Autosave ---------- */
  const handleChange = (value) => {
    const val = value ?? '';
    setCode(val);
    if (locked) return;

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      update(ref(database, `notes/${noteId}`), {
        content: val,
        lastModified: Date.now(),
      }).catch((e) => console.error('Save failed:', e));
    }, 500);
  };

  /* ---------- PIN modal actions ---------- */
  const confirmPin = async () => {
    if (pinInput.trim() !== pin) {
      setPinError('Incorrect PIN.');
      return;
    }
    // Correct PIN: fully unlock in DB
    try {
      await update(ref(database, `notes/${noteId}`), {
        locked: false,
        pinCode: '',
        lastModified: Date.now(),
      });
      setLocked(false);
      setPin('');
      setPinModalOpen(false);
    } catch (e) {
      console.error(e);
      setPinError('Error unlocking. Try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative h-full bg-[#1e1e1e]">
      <Editor
        height="100%"
        defaultLanguage="javascript"
        theme="vs-dark"
        value={code}
        onChange={handleChange}
        options={{
          readOnly: locked,
          minimap: { enabled: false },
          fontSize: 14,
          smoothScrolling: true,
          scrollBeyondLastLine: false,
        }}
      />

      {/* Locked overlay (no PIN or waiting) */}
      {locked && !pin && (
        <div className="pointer-events-none absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-white text-sm font-semibold">
            🔒 Locked — read only
          </div>
        </div>
      )}

      {/* Shams Ali signature */}
      <div className="absolute bottom-2 right-4 text-xs text-blue-400 font-semibold tracking-wide">
        <span className="px-2 py-1 rounded-full bg-blue-950/60 border border-blue-500/40 shadow-lg shadow-blue-500/20">
          Developed by <span className="text-blue-300">Shams Ali</span>
        </span>
      </div>

      {/* PIN Modal for unlocking */}
      <Transition appear show={pinModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => {}}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-150"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-150"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xs rounded-xl bg-[#111827] border border-blue-500/40 p-5 shadow-2xl">
                <Dialog.Title className="text-sm font-semibold text-blue-100 mb-1">
                  Unlock this code
                </Dialog.Title>
                <p className="text-[11px] text-gray-400 mb-3">
                  Enter the 4-digit PIN to edit. You can still see the last saved code.
                </p>
                <input
                  type="password"
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError('');
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-gray-600 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  autoFocus
                />
                {pinError && (
                  <p className="text-[10px] text-red-400 mt-1">
                    {pinError}
                  </p>
                )}
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      // allow leaving locked/read-only
                      setPinModalOpen(false);
                    }}
                    className="px-3 py-1.5 text-[11px] rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600"
                  >
                    Read-only
                  </button>
                  <button
                    onClick={confirmPin}
                    className="px-3 py-1.5 text-[11px] rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Unlock
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
