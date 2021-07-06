import Navbar from './navbar'

class Layout {
  constructor(client, tuner) {
    this.grid = () => document.getElementById('grid')
    this.container = () => document.getElementById('container')
    this.navbar = () => document.getElementById('navbar')
    this.contentGrid = () => document.getElementById('content-grid')
    this.content = () => document.getElementById('content')
    // howto stuff
    this.howToDiv = () => document.getElementById('how-to-container')
    this.howToUl = () => document.getElementById('how-to-list')
    this.selectOrCreateImg = () =>
      document.getElementById('select-or-create-image')
    this.newInstrumentImg = () =>
      document.getElementById('new-instrument-image')
    this.tuneImg = () => document.getElementById('tune-image')
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
    // delete instrument form
    this.deleteInstrumentForm = () =>
      document.getElementById('delete-instrument-form')
    this.deleteInstrumentFormH1 = () =>
      document.getElementById('delete-instrument-form-title')
    this.deleteInstrumentFormSelect = () =>
      document.getElementById('delete-instrument-form-select')
    this.deleteInstrumentFormSubmit = () =>
      document.getElementById('delete-instrument-form-submit')
    this.welcomeTextH2 = () => document.getElementById('welcome-text-h2')
    this.welcomeTextP = () => document.getElementById('welcome-text-p')

    this.childElementFunctions = [
      this.howToDiv,
      this.howToUl,
      this.selectOrCreateImg,
      this.newInstrumentImg,
      this.tuneImg,
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
      this.deleteInstrumentFormSubmit,
      this.welcomeTextH2,
      this.welcomeTextP
    ]
    this.client = client
    this.tuner = tuner
  }

  create(parent, interval) {
    this.createContainer(parent)
    const content = this.createContent(this.container())
    this.createNavbar(this.container(), interval).then((navbar) => {
      const h2 = document.createElement('h2')
      const p = document.createElement('p')
      h2.id = 'welcome-text-h2'
      p.id = 'welcome-text-p'
      h2.textContent = `Welcome to ${navbar.title}!`
      p.textContent = `This app lets you tune an instrument in a customizable way.\n
      To get started, choose from an available instrument or create your own.\n
      Try the Instructions page to see a basic visual guide on how to proceed.\n\n
      Once you start the tuner, remember that you should be in tune if the desired note\n
      is highlighted in green and the little green marker is in the middle of the tuner bar.\n\n
      Have fun!`
      content.append(h2, p)
    })
  }

  createContainer(parent) {
    const grid = document.createElement('div')
    const container = document.createElement('div')

    grid.id = 'grid'
    container.id = 'container'
    grid.classList.add('pure-g')
    container.classList.add('pure-u-1-1')

    grid.appendChild(container)
    parent.appendChild(grid)
    return container
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
    const contentGrid = document.createElement('div')
    const content = document.createElement('div')

    contentGrid.id = 'content-grid'
    content.id = 'content'
    contentGrid.classList.add('pure-g')
    content.classList.add('pure-u-1-1')

    contentGrid.appendChild(content)
    parent.appendChild(contentGrid)
    return content
  }

  createHowToStuff(parent) {
    this.clearContent()
    const howToDiv = document.createElement('div')
    const howToUl = document.createElement('ul')
    const selectOrCreateLi = document.createElement('li')
    const selectOrCreateImg = document.createElement('img')
    const howToInnerDiv = document.createElement('div')
    const newInstrumentImg = document.createElement('img')
    const tuneImg = document.createElement('img')

    howToDiv.id = 'how-to-container'
    howToUl.id = 'how-to-list'
    selectOrCreateLi.id = 'select-or-create-item'
    selectOrCreateImg.id = 'select-or-create-image'
    howToInnerDiv.id = 'how-to-list-div'
    newInstrumentImg.id = 'new-instrument-image'
    tuneImg.id = 'tune-image'

    howToDiv.classList.add('pure-g')
    howToUl.classList.add('pure-u-1')

    selectOrCreateImg.src = './assets/select-or-create.png'
    newInstrumentImg.src = './assets/new-instrument-form.png'
    tuneImg.src = './assets/tune.png'

    selectOrCreateLi.appendChild(selectOrCreateImg)

    howToUl.appendChild(selectOrCreateLi)

    for (const image of [newInstrumentImg, tuneImg]) {
      const li = document.createElement('li')
      li.appendChild(image)
      howToInnerDiv.appendChild(li)
    }

    howToUl.appendChild(howToInnerDiv)

    howToDiv.appendChild(howToUl)
    parent.appendChild(howToDiv)
    return howToDiv
  }

  clearContent() {
    for (const elementFunction of this.childElementFunctions) {
      const element = elementFunction()
      if (element) {
        element.remove()
      }
    }
    if (this.tuner.started) {
      this.tuner.stop()
    }
  }
}

export default Layout
