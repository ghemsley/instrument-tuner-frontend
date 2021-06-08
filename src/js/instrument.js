import Tuning from './tuning'
import Forms from './forms'

class Instrument {
  constructor(name, tunings = []) {
    this.name = name
    this.tunings = tunings
  }

  createTuning(name, notes = []) {
    const tuning = new Tuning(name, notes)
    this.tunings.push(tuning)
  }

  getTuning(name) {
    for (const tuning of this.tunings) {
      if (tuning.name.toLowerCase() === name.toLowerCase()) {
        return tuning
      }
    }
  }

  toObject() {
    return {
      name: this.name,
      tunings: this.tunings.map((tuning) => tuning.toObject())
    }
  }

  display = (parent, layout, tuner) => {
    for (const child of parent.childNodes) {
      child.remove()
    }
    for (const func of layout.childElementFunctions) {
      if (func()) {
        func().remove()
      }
    }
    const h1 = layout.instrumentNameH1()
      ? layout.instrumentNameH1()
      : document.createElement('h1')
    h1.id = 'instrument-name'
    h1.textContent = this.name
    if (!layout.instrumentNameH1()) {
      parent.append(h1)
    }
    Forms.showTuningForm(this, tuner, parent, layout)
    return this
  }

  static createInstrumentFromJSON = (instrumentJSON, tuningsJSON) => {
    const name = instrumentJSON.attributes.name
    const tunings = tuningsJSON.data.map(
      (tuning) => new Tuning(tuning.attributes.name, tuning.attributes.notes)
    )
    return new Instrument(name, tunings)
  }

  static async createInstrumentsFromJSON(instrumentsJSON, client) {
    const instruments = []
    for (const instrumentJSON of instrumentsJSON.data) {
      const tuningsJSON = await client.getTunings(
        `?filter[instrument_id_eq]=${instrumentJSON.id}`
      )
      instruments.push(
        Instrument.createInstrumentFromJSON(instrumentJSON, tuningsJSON)
      )
    }
    return instruments
  }
}

export default Instrument
