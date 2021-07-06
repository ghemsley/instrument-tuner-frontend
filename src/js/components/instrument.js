import Tuning from './tuning'
import Forms from './forms'

class Instrument {
  constructor(name, imageLink, imageArtist, imageArtistLink, id = null) {
    this.name = name
    this.imageLink = imageLink
    this.imageArtist = imageArtist
    this.imageArtistLink = imageArtistLink
    this.id = id
    Instrument.all.push(this)
  }

  static all = []

  toObject() {
    return {
      name: this.name,
      imageLink: this.imageLink,
      imageArtist: this.imageArtist,
      imageArtistLink: this.imageArtistLink,
      id: this.id,
      tunings: Tuning.all.map((tuning) => {
        if (tuning.instrument === this) {
          return tuning.toObject()
        }
      })
    }
  }

  display = (parent, layout, tuner, interval) => {
    for (const child of parent.childNodes) {
      child.remove()
    }
    layout.clearContent()
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
    unsplashAttributionP.innerHTML = `Photo by <a href="${this.imageArtistLink}">${this.imageArtist}</a> on <a href="https://unsplash.com/?utm_source=instrument-tuner&utm_medium=referral">Unsplash</a>`

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

  static findOrCreateInstrumentFromJSON = (instrumentJSON) => {
    for (const instrument of Instrument.all) {
      if (instrument.id == instrumentJSON.id) {
        return instrument
      }
    }
    const name = instrumentJSON.attributes.name
    const imageLink = instrumentJSON.attributes.image_link
    const imageArtist = instrumentJSON.attributes.image_artist
    const imageArtistLink = instrumentJSON.attributes.image_artist_link
    const id = instrumentJSON.id
    return new Instrument(
      name,
      imageLink,
      imageArtist,
      imageArtistLink,
      id
    )
  }

  static async findOrCreateInstrumentsFromJSON(instrumentsJSON) {
    return instrumentsJSON.data.map((instrumentJSON) =>
      Instrument.findOrCreateInstrumentFromJSON(instrumentJSON)
    )
  }
}

export default Instrument
