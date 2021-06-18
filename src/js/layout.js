import Navbar from './navbar'

class Layout {
  constructor(client, tuner) {
    this.grid = () => document.getElementById('grid')
    this.container = () => document.getElementById('container')
    this.navbar = () => document.getElementById('navbar')
    this.content = () => document.getElementById('content')
    // tuning display
    this.noteH1 = () => document.getElementById('note')
    this.freqH2 = () => document.getElementById('freq')
    this.tuningNameH3 = () => document.getElementById('tuning-name')
    this.tuningNotesH4 = () => document.getElementById('tuning-notes')
    this.instrumentNameH1 = () => document.getElementById('instrument-name')
    this.instrumentImg = () => document.getElementById('instrument-image')
    this.unsplashAttributionP = () =>
      document.getElementById('unsplash-attribution')
    this.guage = () => document.getElementById('guage')
    this.needle = () => document.getElementById('needle')
    this.marker = () => document.getElementById('marker')
    // tuning selection form
    this.tuningForm = () => document.getElementById('tuning-form')
    this.tuningFormSelect = () => document.getElementById('tuning-form-select')
    this.tuningFormSubmit = () => document.getElementById('tuning-form-submit')
    // new instrument form
    this.newInstrumentForm = () =>
      document.getElementById('new-instrument-form')
    this.newInstrumentFormH1 = () =>
      document.getElementById('new-instrument-form-title')
    this.newInstrumentFormNameInput = () =>
      document.getElementById('new-instrument-form-name-input')
    this.newInstrumentFormTuningNameInput = () =>
      document.getElementById('new-instrument-form-tuning-name-input')
    this.newInstrumentFormTuningNotesInput = () =>
      document.getElementById('new-instrument-form-tuning-notes-input')
    this.newInstrumentFormSubmit = () =>
      document.getElementById('new-instrument-form-submit')
    this.newInstrumentFormAddTuningButton = () =>
      document.getElementById('new-instrument-form-add-tuning-button')
    // new tuning form
    this.newTuningForm = () => document.getElementById('new-tuning-form')
    this.newTuningFormH1 = () =>
      document.getElementById('new-tuning-form-title')
    this.newTuningFormInstrumentSelect = () =>
      document.getElementById('new-tuning-form-instrument-select')
    this.newTuningFormNameInput = () =>
      document.getElementById('new-tuning-form-name-input')
    this.newTuningFormNotesInput = () =>
      document.getElementById('new-tuning-form-notes-input')
    this.newTuningFormSubmit = () =>
      document.getElementById('new-tuning-form-submit')
    this.newTuningFormAddTuningButton = () =>
      document.getElementById('new-tuning-form-add-tuning-button')
    this.deleteInstrumentForm = () =>
      document.getElementById('delete-instrument-form')
    this.deleteInstrumentFormH1 = () =>
      document.getElementById('delete-instrument-form-title')
    this.deleteInstrumentFormSelect = () =>
      document.getElementById('delete-instrument-form-select')
    this.deleteInstrumentFormSubmit = () =>
      document.getElementById('delete-instrument-form-submit')

    this.childElementFunctions = [
      this.noteH1,
      this.freqH2,
      this.tuningNameH3,
      this.tuningNotesH4,
      this.instrumentNameH1,
      this.instrumentImg,
      this.unsplashAttributionP,
      this.guage,
      this.needle,
      this.marker,
      this.tuningForm,
      this.tuningFormSelect,
      this.tuningFormSubmit,
      this.newInstrumentForm,
      this.newInstrumentFormH1,
      this.newInstrumentFormNameInput,
      this.newInstrumentFormTuningNameInput,
      this.newInstrumentFormTuningNotesInput,
      this.newInstrumentFormSubmit,
      this.newInstrumentFormAddTuningButton,
      this.newTuningForm,
      this.newTuningFormH1,
      this.newTuningFormInstrumentSelect,
      this.newTuningFormNameInput,
      this.newTuningFormNotesInput,
      this.newTuningFormSubmit,
      this.newTuningFormAddTuningButton,
      this.deleteInstrumentForm,
      this.deleteInstrumentFormH1,
      this.deleteInstrumentFormSelect,
      this.deleteInstrumentFormSubmit
    ]
    this.client = client
    this.tuner = tuner
  }

  async create(parent, interval) {
    await this.createContainer(parent)
    await this.createNavbar(this.container(), interval)
    await this.createContent(this.container())
  }

  createContainer(parent) {
    return new Promise((resolve, reject) => {
      try {
        const grid = document.createElement('div')
        const container = document.createElement('div')

        grid.id = 'grid'
        container.id = 'container'
        grid.classList.add('pure-g')
        container.classList.add('pure-u-1-1')

        grid.appendChild(container)
        parent.appendChild(grid)
        resolve(container)
      } catch (e) {
        reject(`Error creating container: ${e}`)
      }
    })
  }

  createNavbar(parent, interval) {
    return Navbar.createFromData(
      parent,
      this,
      this.client,
      this.tuner,
      interval
    )
  }

  createContent(parent) {
    return new Promise((resolve, reject) => {
      try {
        const contentGrid = document.createElement('div')
        const content = document.createElement('div')

        contentGrid.id = 'content-grid'
        content.id = 'content'
        contentGrid.classList.add('pure-g')
        content.classList.add('pure-u-1-1')

        contentGrid.appendChild(content)
        parent.appendChild(contentGrid)
        resolve(content)
      } catch (e) {
        reject(`Error creating content div: ${e}`)
      }
    })
  }

  clear() {
    for (const elementFunction of this.childElementFunctions) {
      if (elementFunction()) {
        elementFunction().remove()
      }
    }
    if (this.tuner.started) {
      this.tuner.stop()
    }
  }
}

export default Layout
