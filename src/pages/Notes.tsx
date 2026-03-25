import React, { useState, useEffect } from "react";
import { Plus, Search, Tag, FileText, Sparkles, Trash2, Save } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, orderBy } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  lastModified: string;
  uid: string;
}

export function Notes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "notes"),
      where("uid", "==", user.uid),
      orderBy("lastModified", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const noteList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Note[];
      setNotes(noteList);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "notes");
    });

    return unsubscribe;
  }, [user]);

  const createNote = async () => {
    if (!user) return;
    const noteData = {
      title: "Untitled Note",
      content: "",
      tags: [],
      uid: user.uid,
      lastModified: new Date().toISOString(),
    };

    try {
      const docRef = await addDoc(collection(db, "notes"), noteData);
      setSelectedNote({ id: docRef.id, ...noteData });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "notes");
    }
  };

  const saveNote = async () => {
    if (!selectedNote) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "notes", selectedNote.id), {
        title: selectedNote.title,
        content: selectedNote.content,
        tags: selectedNote.tags,
        lastModified: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `notes/${selectedNote.id}`);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await deleteDoc(doc(db, "notes", id));
      if (selectedNote?.id === id) setSelectedNote(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `notes/${id}`);
    }
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8 h-[calc(100vh-8rem)]">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Notes Management</h2>
          <p className="text-secondary mt-1">Organize and summarize your study materials.</p>
        </div>
        <button onClick={createNote} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          New Note
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-full">
        <div className="lg:col-span-1 space-y-4 overflow-y-auto pr-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={18} />
            <input
              type="text"
              placeholder="Search notes..."
              className="input-field pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="space-y-3">
            {filteredNotes.map((note) => (
              <motion.div
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className={cn(
                  "p-4 rounded-2xl cursor-pointer transition-all border",
                  selectedNote?.id === note.id 
                    ? "bg-white border-accent shadow-sm" 
                    : "bg-white/50 border-transparent hover:bg-white hover:border-gray-200"
                )}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-primary truncate flex-1">{note.title}</h4>
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="text-xs text-secondary mt-1">{new Date(note.lastModified).toLocaleDateString()}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {note.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-secondary rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 h-full">
          {selectedNote ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card h-full flex flex-col p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <input
                  type="text"
                  className="text-3xl font-bold bg-transparent border-none focus:outline-none flex-1"
                  value={selectedNote.title}
                  onChange={(e) => setSelectedNote({ ...selectedNote, title: e.target.value })}
                />
                <div className="flex items-center gap-3">
                  <button 
                    onClick={saveNote}
                    disabled={isSaving}
                    className="p-2 text-secondary hover:text-green-500 hover:bg-green-50 rounded-xl transition-all disabled:opacity-50"
                  >
                    <Save size={20} />
                  </button>
                  <button className="p-2 text-secondary hover:text-accent hover:bg-accent/10 rounded-xl transition-all">
                    <Sparkles size={20} />
                  </button>
                </div>
              </div>
              
              <textarea
                className="flex-1 bg-transparent border-none focus:outline-none resize-none text-lg leading-relaxed text-secondary"
                placeholder="Start typing your notes here..."
                value={selectedNote.content}
                onChange={(e) => setSelectedNote({ ...selectedNote, content: e.target.value })}
              />
              
              <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-secondary" />
                  <div className="flex gap-2">
                    {selectedNote.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 bg-gray-100 rounded-lg font-medium">
                        {tag}
                      </span>
                    ))}
                    <button className="text-xs text-accent hover:underline">+ Add Tag</button>
                  </div>
                </div>
                <p className="text-xs text-secondary italic">Last modified: {new Date(selectedNote.lastModified).toLocaleString()}</p>
              </div>
            </motion.div>
          ) : (
            <div className="card h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText size={32} className="text-secondary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Select a note to view</h3>
                <p className="text-secondary">Or create a new one to get started.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
