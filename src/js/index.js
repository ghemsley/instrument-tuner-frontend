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

const showTuningForm = () => {
  const tuningForm = document.createElement('form')
  const tuningFormSelect = document.createElement('select')
  const tuningFormSubmit = document.createElement('input')

  tuningForm.id = 'tuning-form'
  tuningFormSelect.id = 'tuning-form-select'
  tuningFormSubmit.id = 'tuning-form-submit'
  tuningFormSubmit.type = 'submit'
  // tuningFormSelect.addEventListener('change', updateTuning)
  // tuningForm.addEventListener('submit', updateTuning)
  tuningForm.appendChild(tuningFormSelect)
  tuningForm.appendChild(tuningFormSubmit)
  document.body.appendChild(tuningForm)
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
