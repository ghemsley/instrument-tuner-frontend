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
