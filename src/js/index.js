import Tuner from './tuner'

const BASE_URL = 'http://localhost:3000/'

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
  getInstrument(1)
    .then((instrument) => displayInstrument(instrument))
    .then((instrument) => {
      showTuningForm()
      populateTuningForm(instrument)
    })
})

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

const showTuningForm = () => {
  const tuningForm = document.createElement('form')
  const tuningFormSelect = document.createElement('select')
  const tuningFormSubmit = document.createElement('input')

  tuningForm.id = 'tuning-form'
  tuningFormSelect.id = 'tuning-form-select'
  tuningFormSubmit.id = 'tuning-form-submit'
  tuningFormSubmit.type = 'submit'
  tuningFormSelect.addEventListener('change', updateTuning)
  tuningForm.addEventListener('submit', updateTuning)
  tuningForm.appendChild(tuningFormSelect)
  tuningForm.appendChild(tuningFormSubmit)
  document.body.appendChild(tuningForm)
}

const populateTuningForm = (instrument) => {
  const tunings = instrument.included
  for (const tuning of tunings) {
    const option = document.createElement('option')
    const string = `${tuning.attributes.name}: ${tuning.attributes.notes.join(
      ', '
    )}`
    option.value = string
    option.text = string
    tuningFormSelect().appendChild(option)
  }
}

const displayTuning = (tuning, name = '') => {
  const h3 = tuningNameH3() || document.createElement('h3')
  const h4 = tuningNotesH4() || document.createElement('h4')
  h3.id = 'tuning-name'
  h4.id = 'tuning-notes'
  let notes = []
  if (typeof tuning !== 'undefined') {
    if (typeof tuning.data !== 'undefined') {
      notes = tuning.data.attributes.notes
      h3.textContent = tuning.data.attributes.name
    } else if (typeof tuning.attributes !== 'undefined') {
      notes = tuning.attributes.notes
      h3.textContent = tuning.attributes.name
    } else {
      notes = tuning.split(', ')
      h3.textContent = name
    }
  }
  h4.textContent = notes.join(' ')
  if (!tuningNameH3()) {
    document.body.appendChild(h3)
  }
  if (!tuningNotesH4()) {
    document.body.appendChild(h4)
  }
  return notes
}

const displayTunings = (tunings) => {
  if (typeof tunings !== 'undefined') {
    for (const tuning of tunings) {
      displayTuning(tuning)
    }
    return tunings
  }
  return []
}

const displayInstrument = (instrument) => {
  if (typeof instrument !== 'undefined') {
    const h1 = document.createElement('h1')
    const tunings = instrument.included
    h1.id = 'instrument-name'
    h1.textContent = instrument.data.attributes.name
    document.body.append(h1)
    //displayTunings(tunings)
  }
  return instrument
}

const displayInstruments = (instruments) => {
  for (const instrument of instruments) {
    displayInstrument(instrument)
  }
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
      document.body.append(h1, h2)
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
  const tuningName = tuningPair[0]
  const tuning = tuningPair[1]
  displayTuning(tuning, tuningName)
  tuningNameH3().textContent = tuningName
  tuningNotesH4().textContent = tuning
  createTuner()
    .then((stoppedTuner) => startAndDisplayTuner(stoppedTuner, 100))
    .then((startedTuner) =>
      highlightMatchingNotes(startedTuner, tuning.split(', '), 100)
    )
    .then((tuner) => tuner.drawGuage())
}
