import Tuning from './tuning'
import Forms from './forms'

class Instrument {
  constructor(name, imageLink, imageArtist, imageArtistLink, tunings = []) {
    this.name = name
    this.imageLink = imageLink
    this.imageArtist = imageArtist
    this.imageArtistLink = imageArtistLink
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
      imageLink: this.imageLink,
      imageArtist: this.imageArtist,
      imageArtistLink: this.imageArtistLink,
      tunings: this.tunings.map((tuning) => tuning.toObject())
    }
  }

  display = (parent, layout, tuner, interval) => {
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

    const img = layout.instrumentImg()
      ? layout.instrumentImg()
      : document.createElement('img')

    const unsplashAttributionP = layout.unsplashAttributionP()
      ? layout.unsplashAttributionP()
      : document.createElement('p')

    h1.id = 'instrument-name'
    h1.textContent = this.name

    img.id = 'instrument-image'
    img.src = this.imageLink

    unsplashAttributionP.id = 'unsplash-attribution'
    unsplashAttributionP.innerHTML = `Photo courtesy of <a href="${this.imageArtistLink}">${this.imageArtist}</a> on <a href="https://unsplash.com/?utm_source=instrument-tuner&utm_medium=referral">Unsplash</a>`

    if (!layout.instrumentNameH1()) {
      parent.appendChild(h1)
    }
    if (!layout.instrumentImg()) {
      parent.appendChild(img)
    }
    if (!layout.unsplashAttributionP()) {
      parent.appendChild(unsplashAttributionP)
    }
    Forms.showTuningForm(this, tuner, parent, layout, interval)
    return this
  }

  static createInstrumentFromJSON = (instrumentJSON, tuningsJSON) => {
    const name = instrumentJSON.attributes.name
    const imageLink = instrumentJSON.attributes.image_link
    const imageArtist = instrumentJSON.attributes.image_artist
    const imageArtistLink = instrumentJSON.attributes.image_artist_link
    const tunings = tuningsJSON.data.map(
      (tuning) => new Tuning(tuning.attributes.name, tuning.attributes.notes)
    )
    return new Instrument(
      name,
      imageLink,
      imageArtist,
      imageArtistLink,
      tunings
    )
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
