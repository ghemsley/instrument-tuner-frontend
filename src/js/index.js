import Navbar from './navbar'
import Tuning from './tuning'
import Instrument from './instrument'
import Tuner from './tuner'
import '../sass/app.scss'

const BASE_URL = 'http://localhost:3000/'

const grid = () => document.getElementById('grid')
const container = () => document.getElementById('container')
const noteH1 = () => document.getElementById('note')
const freqH2 = () => document.getElementById('freq')
const tuningNameH3 = () => document.getElementById('tuning-name')
const tuningNotesH4 = () => document.getElementById('tuning-notes')
const instrumentNameH1 = () => document.getElementById('instrument-name')
const tuningForm = () => document.getElementById('tuning-form')
const tuningFormSelect = () => document.getElementById('tuning-form-select')
const tuningFormSubmit = () => document.getElementById('tuning-form-submit')

let matchNotesInterval
let tuner

document.addEventListener('DOMContentLoaded', (event) => {
  createContainer(document.body).then((container) => createNavbar(container))
})

const showGuitar = () => {
  if (!instrumentNameH1()) {
    return getInstrument(1)
      .then((instrumentJSON) => createInstrument(instrumentJSON))
      .then((instrument) => displayInstrument(instrument))
      .then((instrument) => {
        showTuningForm(instrument)
      })
  }
}

const createContainer = (parent) => {
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
      reject(`Error when creating grid: ${e}`)
    }
  })
}

const createNavbar = (parent) => {
  return new Promise((resolve, reject) => {
    try {
      const sections = [
        { name: 'Guitar', onClick: showGuitar },
        { name: 'Github', link: 'https://www.github.com/ghemsley' },
        { name: 'Blog', link: 'https://www.grahamhemsley.com' }
      ]
      const navbar = new Navbar('Instrument tuner', sections)
      navbar.appendToParent(parent)
      resolve(navbar)
    } catch (e) {
      reject(`Error when creating navbar: ${e}`)
    }
  })
}

const fetchData = (route) => {
  return fetch(BASE_URL + route, {
    headers: { Accept: 'application/json' }
  })
    .then((response) => response.json())
    .then((json) => json)
    .catch((error) => console.error(error))
}

const getTuning = (id) => fetchData(`tunings/${id}`)
const getTunings = () => fetchData('tunings')
const getInstrument = (id) => fetchData(`instruments/${id}`)
const getInstruments = () => fetchData('instruments')

const createInstrument = (instrumentJSON) => {
  const name = instrumentJSON.data.attributes.name
  const tunings = instrumentJSON.included.map(
    (tuning) => new Tuning(tuning.attributes.name, tuning.attributes.notes)
  )
  return new Instrument(name, tunings)
}

const createInstruments = (instrumentsJSON) =>
  instrumentsJSON.map((instrument) => createInstrument(instrument))

const showTuningForm = (instrument) => {
  const tuningForm = document.createElement('form')
  const tuningFormSelect = document.createElement('select')
  const tuningFormSubmit = document.createElement('input')

  tuningForm.id = 'tuning-form'
  tuningFormSelect.id = 'tuning-form-select'
  tuningFormSubmit.id = 'tuning-form-submit'
  tuningFormSubmit.type = 'submit'

  tuningForm.classList.add('pure-form')

  tuningFormSelect.addEventListener('change', updateTuning)
  tuningForm.addEventListener('submit', updateTuning)

  tuningForm.appendChild(tuningFormSelect)
  tuningForm.appendChild(tuningFormSubmit)

  container().appendChild(tuningForm)
  return populateTuningForm(instrument)
}

const populateTuningForm = (instrument) => {
  for (const tuning of instrument.tunings) {
    const option = document.createElement('option')
    const string = `${tuning.name}: ${tuning.notes.join(', ')}`
    option.value = string
    option.text = string
    tuningFormSelect().appendChild(option)
  }
  return instrument
}

const displayTuning = (tuning) => {
  const h3 = tuningNameH3() || document.createElement('h3')
  const h4 = tuningNotesH4() || document.createElement('h4')
  h3.id = 'tuning-name'
  h4.id = 'tuning-notes'
  h3.textContent = tuning.name
  h4.textContent = tuning.notes.join(' ')
  if (!tuningNameH3()) {
    container().appendChild(h3)
  }
  if (!tuningNotesH4()) {
    container().appendChild(h4)
  }
  return tuning
}

const displayTunings = (tunings) => {
  for (const tuning of tunings) {
    displayTuning(tuning)
  }
  return tunings
}

const displayInstrument = (instrument) => {
  return new Promise((resolve, reject) => {
    try {
      const h1 = document.createElement('h1')
      h1.id = 'instrument-name'
      h1.textContent = instrument.name
      container().append(h1)
      displayTunings(instrument.tunings)
      resolve(instrument)
    } catch (e) {
      reject(`Error displaying instrument: ${e}`)
    }
  })
}

const displayInstruments = (instruments) => {
  for (const instrument of instruments) {
    displayInstrument(instrument)
  }
  return instruments
}

const createTuner = () => {
  return new Promise((resolve, reject) => {
    try {
      tuner = tuner instanceof Tuner ? tuner : new Tuner()
      resolve(tuner)
    } catch (e) {
      reject(`Error while creating tuner: ${e}`)
    }
  })
}

const startAndDisplayTuner = (stoppedTuner, interval) => {
  return stoppedTuner
    .startTuner()
    .then((startedTuner) => {
      const h1 = document.createElement('h1')
      const h2 = document.createElement('h2')
      h1.id = 'note'
      h2.id = 'freq'
      container().append(h1, h2)
      startedTuner.displayAtInterval(interval)
      return startedTuner
    })
    .catch((error) => {
      console.error(error)
    })
}

const highlightMatchingNotes = (startedTuner, notes, interval) => {
  try {
    clearInterval(matchNotesInterval)
  } catch (e) {
    console.error(e)
  }
  matchNotesInterval = setInterval(() => {
    if (startedTuner.matchNotes(notes)) {
      noteH1().style.color = 'green'
    } else {
      noteH1().style.color = 'black'
    }
  }, interval)
  return tuner
}

const updateTuning = (event) => {
  event.preventDefault()
  const tuningPair =
    typeof event.target.value === 'undefined'
      ? event.target.children[0].value.split(': ')
      : event.target.value.split(': ')
  const tuning = new Tuning(tuningPair[0], tuningPair[1].split(', '))
  displayTuning(tuning)
  createTuner()
    .then((stoppedTuner) => startAndDisplayTuner(stoppedTuner, 100))
    .then((startedTuner) =>
      highlightMatchingNotes(startedTuner, tuning.notes, 100)
    )
    .then((tuner) => tuner.drawGuage())
}
