import Navbar from './navbar'
import Tuning from './tuning'
import Instrument from './instrument'
import Tuner from './tuner'
import '../sass/app.scss'

const BASE_URL = 'http://localhost:3000/'

const grid = () => document.getElementById('grid')
const container = () => document.getElementById('container')
const navbar = () => document.getElementById('navbar')
const content = () => document.getElementById('content')
const noteH1 = () => document.getElementById('note')
const freqH2 = () => document.getElementById('freq')
const tuningNameH3 = () => document.getElementById('tuning-name')
const tuningNotesH4 = () => document.getElementById('tuning-notes')
const instrumentNameH1 = () => document.getElementById('instrument-name')
const tuningForm = () => document.getElementById('tuning-form')
const tuningFormSelect = () => document.getElementById('tuning-form-select')
const tuningFormSubmit = () => document.getElementById('tuning-form-submit')
const newInstrumentForm = () => document.getElementById('new-instrument-form')
const newInstrumentFormH1 = () =>
  document.getElementById('new-instrument-form-title')
const newInstrumentFormNameInput = () =>
  document.getElementById('new-instrument-form-name-input')
const newInstrumentFormTuningNameInput = () =>
  document.getElementById('new-instrument-form-tuning-name-input')
const newInstrumentFormTuningNotesInput = () =>
  document.getElementById('new-instrument-form-tuning-notes-input')
const newInstrumentFormSubmit = () =>
  document.getElementById('new-instrument-form-submit')
const newInstrumentFormAddTuningButton = () =>
  document.getElementById('new-instrument-form-add-tuning-button')

const childElementFunctions = [
  noteH1,
  freqH2,
  tuningNameH3,
  tuningNotesH4,
  instrumentNameH1,
  tuningForm,
  tuningFormSelect,
  tuningFormSubmit,
  newInstrumentForm,
  newInstrumentFormH1,
  newInstrumentFormNameInput,
  newInstrumentFormTuningNameInput,
  newInstrumentFormTuningNotesInput,
  newInstrumentFormSubmit,
  newInstrumentFormAddTuningButton
]
let matchNotesInterval
let tuner

document.addEventListener('DOMContentLoaded', (event) => {
  createLayout()
})

const createLayout = async () => {
  await createContainer(document.body)
  await createNavbar(container())
  await createContent(container())
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
      reject(`Error creating container: ${e}`)
    }
  })
}

const createNavbar = (parent) => {
  return getInstruments().then((instrumentJSON) => {
    createInstruments(instrumentJSON).then((instruments) => {
      const sections = []
      for (const instrument of instruments) {
        sections.push({
          name: instrument.name,
          onClick: displayInstrument.bind(
            displayInstrument,
            instrument,
            content()
          )
        })
      }
      sections.push({
        name: 'New instrument',
        onClick: createNewInstrumentForm.bind(
          createNewInstrumentForm,
          content()
        )
      })
      const navbar = new Navbar('Instrument tuner', sections)
      navbar.appendToParent(parent)
      return navbar
    })
  })
}

const createContent = (parent) => {
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

const sendData = (route, object) => {
  return fetch(BASE_URL + route, {
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(object)
  })
    .then((response) => response.json())
    .catch((error) => console.error(error))
}

const sendInstrument = (instrument) => {
  return sendData('instruments', instrument.toObject())
}

const sendNewInstrumentFormData = (event) => {
  event.preventDefault()
  let name
  let tuningNames = []
  let tuningNotes = []
  let tunings = []
  for (const child of event.target.children) {
    if (child.id === 'new-instrument-form-name-input') {
      name = child.value
    } else if (child.placeholder === 'Tuning name') {
      tuningNames.push(child.value)
    } else {
      tuningNotes.push(child.value)
    }
  }
  for (let i = 0; i < tuningNames.length; i++) {
    tunings.push(new Tuning(tuningNames[i], tuningNotes[i].split(', ')))
  }
  try {
    let instrument = new Instrument(name, tunings)
    sendInstrument(instrument).then((json) => console.log(json))
  } catch (e) {
    console.error(`Error creating or sending instrument: ${e}`)
  }
}

const addTuningToInstrumentForm = (event) => {
  event.preventDefault()
  const form = newInstrumentForm()
  const tuningNameInput = document.createElement('input')
  const tuningNotesInput = document.createElement('input')
  const submit = document.createElement('input')
  tuningNameInput.placeholder = 'Tuning name'
  tuningNotesInput.placeholder = 'Tuning notes (comma separated)'
  submit.id = 'new-instrument-form-submit'
  submit.type = 'submit'
  newInstrumentFormSubmit().remove()
  form.append(tuningNameInput, tuningNotesInput, submit)
}

const createNewInstrumentForm = (parent) => {
  for (const child of parent.childNodes) {
    child.remove()
  }
  for (const func of childElementFunctions) {
    if (func()) {
      func().remove()
    }
  }
  if (!newInstrumentForm()) {
    const newInstrumentForm = document.createElement('form')
    const newInstrumentFormH1 = document.createElement('h1')
    const newInstrumentFormNameInput = document.createElement('input')
    const newInstrumentFormTuningNameInput = document.createElement('input')
    const newInstrumentFormTuningNotesInput = document.createElement('input')
    const newInstrumentFormSubmit = document.createElement('input')
    const newInstrumentFormAddTuningButton = document.createElement('button')

    newInstrumentForm.id = 'new-instrument-form'
    newInstrumentFormH1.id = 'new-instrument-form-title'
    newInstrumentFormNameInput.id = 'new-instrument-form-name-input'
    newInstrumentFormTuningNameInput.id =
      'new-instrument-form-tuning-name-input'
    newInstrumentFormTuningNotesInput.id =
      'new-instrument-form-tuning-notes-input'
    newInstrumentFormSubmit.id = 'new-instrument-form-submit'
    newInstrumentFormAddTuningButton.id =
      'new-instrument-form-add-tuning-button'

    newInstrumentForm.classList.add('pure-form', 'pure-form-stacked')
    newInstrumentFormH1.textContent = 'New instrument'
    newInstrumentFormNameInput.placeholder = 'Instrument name'
    newInstrumentFormTuningNameInput.placeholder = 'Tuning name'
    newInstrumentFormTuningNotesInput.placeholder =
      'Tuning notes (comma separated)'
    newInstrumentFormSubmit.type = 'submit'
    newInstrumentFormAddTuningButton.textContent = 'Add another tuning'
    newInstrumentFormAddTuningButton.addEventListener(
      'click',
      addTuningToInstrumentForm
    )
    newInstrumentForm.addEventListener('submit', sendNewInstrumentFormData)
    newInstrumentForm.append(
      newInstrumentFormH1,
      newInstrumentFormNameInput,
      newInstrumentFormTuningNameInput,
      newInstrumentFormTuningNotesInput,
      newInstrumentFormSubmit
    )
    parent.append(newInstrumentForm, newInstrumentFormAddTuningButton)
    return newInstrumentForm
  }
  return newInstrumentForm()
}

const fetchData = (route) => {
  return fetch(BASE_URL + route, {
    headers: { Accept: 'application/json' }
  })
    .then((response) => response.json())
    .catch((error) => console.error(error))
}

const getTuning = (id) => fetchData(`tunings/${id}`)
const getTunings = (filter) => fetchData(`tunings${filter ? filter : ''}`)
const getInstrument = (id) => fetchData(`instruments/${id}`)
const getInstruments = (filter) =>
  fetchData(`instruments${filter ? filter : ''}`)

const createInstrument = (instrumentJSON, tuningsJSON) => {
  const name = instrumentJSON.attributes.name
  const tunings = tuningsJSON.data.map(
    (tuning) => new Tuning(tuning.attributes.name, tuning.attributes.notes)
  )
  return new Instrument(name, tunings)
}

const createInstruments = async (instrumentsJSON) => {
  const instruments = []
  for (const instrumentJSON of instrumentsJSON.data) {
    const tuningsJSON = await getTunings(
      `?filter[instrument_id_eq]=${instrumentJSON.id}`
    )
    instruments.push(createInstrument(instrumentJSON, tuningsJSON))
  }
  return instruments
}

const showTuningForm = (instrument, parent) => {
  if (!tuningForm()) {
    const tuningForm = document.createElement('form')
    const tuningFormSelect = document.createElement('select')
    const tuningFormSubmit = document.createElement('input')

    tuningForm.id = 'tuning-form'
    tuningFormSelect.id = 'tuning-form-select'
    tuningFormSubmit.id = 'tuning-form-submit'
    tuningFormSubmit.type = 'submit'

    tuningForm.classList.add('pure-form', 'pure-form-stacked')

    tuningFormSelect.addEventListener('change', updateTuning)
    tuningForm.addEventListener('submit', updateTuning)

    tuningForm.appendChild(tuningFormSelect)
    tuningForm.appendChild(tuningFormSubmit)
    parent.appendChild(tuningForm)
  }
  return populateTuningForm(instrument)
}

const populateTuningForm = (instrument) => {
  const _tuningFormSelect = document.createElement('select')
  _tuningFormSelect.id = 'tuning-form-select'
  _tuningFormSelect.addEventListener('change', updateTuning)
  for (const tuning of instrument.tunings) {
    const option = document.createElement('option')
    const string = `${tuning.name}: ${tuning.notes.join(', ')}`
    option.value = string
    option.text = string
    _tuningFormSelect.appendChild(option)
  }
  tuningFormSelect().replaceWith(_tuningFormSelect)
  return instrument
}

const displayTuning = (tuning) => {
  const h3 = tuningNameH3() ? tuningNameH3() : document.createElement('h3')
  const h4 = tuningNotesH4() ? tuningNotesH4() : document.createElement('h4')
  h3.id = 'tuning-name'
  h4.id = 'tuning-notes'
  h3.textContent = tuning.name
  h4.textContent = tuning.notes.join(' ')
  if (!tuningNameH3()) {
    content().appendChild(h3)
  }
  if (!tuningNotesH4()) {
    content().appendChild(h4)
  }
  return tuning
}

const displayTunings = (tunings) => {
  for (const tuning of tunings) {
    displayTuning(tuning)
  }
  return tunings
}

const displayInstrument = (instrument, parent) => {
  for (const child of parent.childNodes) {
    child.remove()
  }
  for (const func of childElementFunctions) {
    if (func()) {
      func().remove()
    }
  }
  const h1 = instrumentNameH1()
    ? instrumentNameH1()
    : document.createElement('h1')
  h1.id = 'instrument-name'
  h1.textContent = instrument.name
  if (!instrumentNameH1()) {
    parent.append(h1)
  }
  showTuningForm(instrument, parent)
  return instrument
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
      const h1 = noteH1() ? noteH1() : document.createElement('h1')
      const h2 = freqH2() ? freqH2() : document.createElement('h2')
      h1.id = 'note'
      h2.id = 'freq'
      if (!content().contains(h1)) {
        content().append(h1, h2)
      }
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
    if (startedTuner.matchNotes(notes) && noteH1()) {
      noteH1().style.color = 'green'
    } else if (noteH1()) {
      noteH1().style.color = 'black'
    }
  }, interval)
  return tuner
}

const updateTuning = (event) => {
  event.preventDefault()
  let tuningPair
  if (event.target.value) {
    tuningPair = event.target.value.split(': ')
  } else if (event.target.children[0].value) {
    tuningPair = event.target.children[0].value.split(': ')
  }
  const tuning = new Tuning(tuningPair[0], tuningPair[1].split(', '))
  displayTuning(tuning)
  createTuner()
    .then((stoppedTuner) => startAndDisplayTuner(stoppedTuner, 100))
    .then((startedTuner) =>
      highlightMatchingNotes(startedTuner, tuning.notes, 100)
    )
    .then((tuner) => tuner.drawGuage())
}
