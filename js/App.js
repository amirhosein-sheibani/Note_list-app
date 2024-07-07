import NotesAPI from "./NotesAPI.js";
import NoteView from "./NoteView.js";

export default class App {
  constructor(root) {
    this.notes = [];
    this.activeNote = null;
    this.view = new NoteView(root, this._handlers());
    this._refreshNotes();
  }

  _refreshNotes() {
    const notes = NotesAPI.getAllNotes();
    this._setNotes(notes);

    if (this.notes.length > 0) {
      this._setActivNote(notes[0]);
    }
  }

  _setNotes(notes) {
    this.notes = notes;
    this.view.updateNoteList(notes);
    this.view.updatePreviewVisiblty(this.notes.length > 0);
  }

  _setActivNote(note) {
    this.activeNote = note = note;
    this.view.updateActiveNote(note );
  }

  _handlers() {
    return {
      onAddNote: () => {
        const newNote = {
          title: "new Note",
          body: "new note that is builded",
        };

        NotesAPI.saveNote(newNote);
        this._refreshNotes();
      },
      onNoteEdite: (newTitle, newBody) => {
        NotesAPI.saveNote({
          id: this.activeNote.id,
          title: newTitle,
          body: newBody,
        });
        this._refreshNotes();
      },
      onNoteSelected: (id) => {
        const selectedNote = this.notes.find((note) => note.id === Number(id));
        this._setActivNote(selectedNote);
      },
      onDeleteNote: (id) => {
        NotesAPI.deleteNote(id);
        this._refreshNotes();
      },
    };
  }
}
