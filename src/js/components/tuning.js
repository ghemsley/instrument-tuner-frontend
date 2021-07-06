class Tuning {
  constructor(name, notes = [], id = null, instrument = null) {
    this.name = name
    this.notes = notes
    this.id = id
    this.instrument = instrument
    this.instrumentID =
      this.instrument && this.instrument.id ? this.instrument.id : null
    Tuning.all.push(this)
  }

  static all = []

  toObject() {
    return {
      name: this.name,
      notes: this.notes,
      id: this.id,
      instrumentID: this.instrumentID
    }
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

  static findOrCreateTuningsFromJson(tuningsJSON, instrument) {
    return tuningsJSON.data.map(
      (tuning) =>
        new Tuning(
          tuning.attributes.name,
          tuning.attributes.notes,
          tuning.id,
          instrument
        )
    )
  }
}

export default Tuning
