import Tuning from './tuning'

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
}

export default Instrument
