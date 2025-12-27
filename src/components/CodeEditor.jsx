'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { database } from '../lib/firebase';
import { ref, update, onValue, off } from 'firebase/database';

import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';

import { Copy, Check, Loader2, Code2, Wifi, WifiOff, Sparkles } from 'lucide-react';

export default function CodeEditor({ noteId }) {
  const editorContainerRef = useRef(null);
  const viewRef = useRef(null);
  const [isRemoteUpdate, setIsRemoteUpdate] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lineCount, setLineCount] = useState(1);
  const [charCount, setCharCount] = useState(0);

  const handleCopy = useCallback(async () => {
    try {
      const code = viewRef.current?.state.doc.toString() || '';
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  }, []);

  const updateStats = useCallback((doc) => {
    const content = doc.toString();
    setLineCount(doc.lines);
    setCharCount(content.length);
  }, []);

  useEffect(() => {
    if (!editorContainerRef.current || !noteId) return;

    const noteRef = ref(database, `notes/${noteId}`);

    const state = EditorState.create({
      doc: '',
      extensions: [
        lineNumbers(),
        history(),
        javascript(),
        oneDark,
        keymap.of([...defaultKeymap, ...historyKeymap]),
        EditorView.updateListener.of((updateEvent) => {
          if (updateEvent.docChanged) {
            updateStats(updateEvent.state.doc);
            if (!isRemoteUpdate) {
              setIsSaving(true);
              const currentCode = updateEvent.state.doc.toString();
              update(noteRef, { content: currentCode }).finally(() =>
                setTimeout(() => setIsSaving(false), 300)
              );
            }
          }
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorContainerRef.current,
    });

    viewRef.current = view;

    const unsubscribe = onValue(
      noteRef,
      (snapshot) => {
        setIsConnected(true);
        const data = snapshot.val();
        const content = data?.content || '';
        if (view.state.doc.toString() !== content) {
          setIsRemoteUpdate(true);
          view.dispatch({
            changes: { from: 0, to: view.state.doc.length, insert: content },
          });
          updateStats(view.state.doc);
          setIsRemoteUpdate(false);
        }
      },
      (error) => {
        setIsConnected(false);
        console.error('Firebase connection error:', error);
      }
    );

    return () => {
      view?.destroy();
      off(noteRef);
    };
  }, [noteId, isRemoteUpdate, updateStats]);

  return (
    <div className="min-h-screen bg-[#1e1e1e] p-4 text-gray-200">
      <div className="max-w-6xl mx-auto space-y-2">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 bg-[#252526] rounded-t-lg border-b border-gray-700">
          <div className="flex items-center gap-3">
            <Code2 className="w-6 h-6 text-blue-400" />
            <div>
              <h1 className="text-lg font-semibold">Code Editor</h1>
              <p className="text-xs text-gray-400">Realtime collaborative editing</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              {isConnected ? (
                <>
                  <Wifi className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-red-400" />
                  <span className="text-red-400">Disconnected</span>
                </>
              )}
            </div>
            {isSaving && (
              <div className="flex items-center gap-1 text-blue-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </div>
            )}
          </div>
        </div>

        {/* Editor */}
        <div
          ref={editorContainerRef}
          className="rounded-b-lg border border-gray-700 overflow-y-auto h-[500px]"
        />

        {/* Footer */}
        <div className="flex justify-between items-center bg-[#252526] px-4 py-2 rounded-lg border border-gray-700">
          <div className="flex gap-4 text-xs text-gray-400">
            <span>Lines: <span className="text-gray-200">{lineCount}</span></span>
            <span>Chars: <span className="text-gray-200">{charCount}</span></span>
            <div className="flex items-center gap-1 text-[10px] text-gray-500">
              <Sparkles className="w-3 h-3 text-yellow-400" />
              Developed by <span className="text-gray-300 font-semibold ml-1">Shams Ali</span>
            </div>
          </div>
          <button
            onClick={handleCopy}
            disabled={copied}
            className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-colors ${
              copied
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Code
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
