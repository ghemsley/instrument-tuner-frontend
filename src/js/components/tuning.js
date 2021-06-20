class Tuning {
  constructor(name, notes = []) {
    this.name = name
    this.notes = notes
  }

  toObject() {
    return { name: this.name, notes: this.notes }
  }

  display(layout) {
    const h3 = layout.tuningNameH3()
      ? layout.tuningNameH3()
      : document.createElement('h3')
    const h4 = layout.tuningNotesH4()
      ? layout.tuningNotesH4()
      : document.createElement('h4')
    h3.id = 'tuning-name'
    h4.id = 'tuning-notes'
    h3.textContent = this.name
    h4.textContent = this.notes.join(' ')
    if (!layout.tuningNameH3()) {
      layout.content().appendChild(h3)
    }
    if (!layout.tuningNotesH4()) {
      layout.content().appendChild(h4)
    }
    return this
  }
}

export default Tuning
