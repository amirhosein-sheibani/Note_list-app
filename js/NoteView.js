export default class NoteView {
  constructor(root, handlers) {
    this.root = root;
    //destructor handler's methods and to initialize its
    const { onAddNote, onNoteEdite, onNoteSelected, onDeleteNote } = handlers;
    this.onAddNote = onAddNote;
    this.onNoteEdite = onNoteEdite;
    this.onNoteSelected = onNoteSelected;
    this.onDeleteNote = onDeleteNote;

    this.root.innerHTML = `<div class="notes__sidebar">
        <div class="notes__logo">NOTE APP</div>
        <div class="notes__list"></div>
        <button class="notes__add">ADD NOTE</button>
    </div>
    <div class="notes__preview">
        <input type="text" class="notes__title" placeholder="note title ..." />
        <textarea name="" class="notes__body">Take some note ...</textarea>
    </div>
    `;

    //select elements
    const addBtn = this.root.querySelector(".notes__add");
    const inputTitle = this.root.querySelector(".notes__title");
    const inputBody = this.root.querySelector(".notes__body");

    addBtn.addEventListener("click", () => {
      this.onAddNote();
    });
    [inputTitle, inputBody].forEach((inputField) => {
      inputField.addEventListener("blur", () => {
        const newTitle = inputTitle.value.trim();
        const newBody = inputBody.value.trim();
        this.onNoteEdite(newTitle, newBody);
      });
    });

    this.updatePreviewVisiblty(false);
  }

  _createListItemHtml(note) {
    const { id, title, body, updated } = note;
    const MAX_LENGTH_BODY = 50;
    const options = {
      dateStyle: "full",
    };
    return `<div class="notes__list-item" data-note-id="${id}">
            <div class="notes__item-header">
            <div class="notes__small-title">${title}</div>
            <span class="notes__list-trash" data-note-id="${id}"><i class="fa-solid fa-trash"></i></span>
            </div>
            <div class="notes__small-body">
            ${body.substring(0, MAX_LENGTH_BODY)}
            ${body.length > MAX_LENGTH_BODY ? "..." : ""}</div>
            <div class="notes__small-updated">
            ${new Date(updated).toLocaleDateString("en", options)}
            </div>
          </div>`;
  }

  updateNoteList(notes) {
    const notesContainer = this.root.querySelector(".notes__list");
    let notesList = "";
    for (const note of notes) {
      const html = this._createListItemHtml(note);
      notesList += html;
    }
    notesContainer.innerHTML = notesList;
    notesContainer.querySelectorAll(".notes__list-item").forEach((noteItem) => {
      noteItem.addEventListener("click", () => {
        this.onNoteSelected(noteItem.dataset.noteId);
      });
    });
    notesContainer
      .querySelectorAll(".notes__list-trash")
      .forEach((noteItem) => {
        noteItem.addEventListener("click", (e) => {
          e.stopPropagation();
          this.onDeleteNote(noteItem.dataset.noteId);
        });
      });
  }

  updateActiveNote(note) {
    this.root.querySelector(".notes__title").value = note.title;
    this.root.querySelector(".notes__body").value = note.body;

    this.root.querySelectorAll(".notes__list-item").forEach((item) => {
      item.classList.remove("notes__list-item--selected");
    });

    this.root
      .querySelector(`.notes__list-item[data-note-id="${note.id}"]`)
      .classList.add("notes__list-item--selected");
  }

  updatePreviewVisiblty(visible) {
    const preview = (this.root.querySelector(
      ".notes__preview"
    ).style.visibility = visible ? "visible" : "hidden");
    console.log(preview);
  }
}
