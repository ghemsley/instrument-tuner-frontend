import Instrument from './instrument'
import Tuning from './tuning'

class Forms {
  static createNewInstrumentForm(parent, layout, client) {
    for (const child of parent.childNodes) {
      child.remove()
    }
    layout.clear()
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
      Forms.handleAddTuningButtonClick.bind(Forms, newInstrumentForm, layout)
    )
    newInstrumentForm.addEventListener(
      'submit',
      Forms.handleNewInstrumentFormSubmit.bind(Forms, client)
    )
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

  static deleteInstrumentForm(parent, layout, client) {
    client.getInstruments().then((instrumentsJSON) => {
      for (const child of parent.childNodes) {
        child.remove()
      }
      layout.clear()
      const options = []
      for (const instrument of instrumentsJSON.data) {
        const option = document.createElement('option')
        option.value = instrument.id
        option.text = instrument.attributes.name
        options.push(option)
      }
      const deleteInstrumentForm = document.createElement('form')
      const deleteInstrumentFormH1 = document.createElement('h1')
      const deleteInstrumentFormSelect = document.createElement('select')
      const deleteInstrumentFormSubmit = document.createElement('input')

      deleteInstrumentForm.id = 'delete-instrument-form'
      deleteInstrumentFormH1.id = 'delete-instrument-form-title'
      deleteInstrumentFormSelect.id = 'delete-instrument-form-select'
      deleteInstrumentFormSubmit.id = 'delete-instrument-form-submit'

      deleteInstrumentForm.classList.add('pure-form', 'pure-form-stacked')
      deleteInstrumentFormH1.textContent = 'Remove an instrument'
      deleteInstrumentFormSubmit.type = 'submit'

      for (const option of options) {
        deleteInstrumentFormSelect.appendChild(option)
      }

      deleteInstrumentForm.addEventListener(
        'submit',
        Forms.handleDeleteInstrumentFormSubmit.bind(Forms, client)
      )
      deleteInstrumentForm.append(
        deleteInstrumentFormH1,
        deleteInstrumentFormSelect,
        deleteInstrumentFormSubmit
      )
      parent.appendChild(deleteInstrumentForm)
      return deleteInstrumentForm
    })
  }

  static showTuningForm(instrument, tuner, parent, layout, interval) {
    const tuningForm = document.createElement('form')
    const tuningFormSelect = document.createElement('select')
    const tuningFormSubmit = document.createElement('input')

    tuningForm.id = 'tuning-form'
    tuningFormSelect.id = 'tuning-form-select'
    tuningFormSubmit.id = 'tuning-form-submit'
    tuningFormSubmit.type = 'submit'
    tuningFormSubmit.value = 'Start tuner'

    tuningForm.classList.add('pure-form', 'pure-form-stacked')

    tuningFormSelect.addEventListener(
      'change',
      Forms.handleTuningChange.bind(Forms, tuner, layout, parent, interval)
    )
    tuningForm.addEventListener(
      'submit',
      Forms.handleTuningChange.bind(Forms, tuner, layout, parent, interval)
    )

    for (const tuning of instrument.tunings) {
      const option = document.createElement('option')
      const string = `${tuning.name}: ${tuning.notes.join(', ')}`
      option.value = string
      option.text = string
      tuningFormSelect.appendChild(option)
    }

    tuningForm.append(tuningFormSelect, tuningFormSubmit)

    if (!layout.tuningForm()) {
      parent.appendChild(tuningForm)
    } else {
      layout.tuningForm().replaceWith(tuningForm)
    }
  }

  static createNewTuningForm = (parent, layout, client) => {
    client.getInstruments().then((instrumentsJSON) => {
      for (const child of parent.childNodes) {
        child.remove()
      }
      layout.clear()
      const options = []
      for (const instrument of instrumentsJSON.data) {
        const option = document.createElement('option')
        option.value = instrument.id
        option.text = instrument.attributes.name
        options.push(option)
      }
      const newTuningForm = document.createElement('form')
      const newTuningFormH1 = document.createElement('h1')
      const newTuningFormInstrumentSelect = document.createElement('select')
      const newTuningFormNameInput = document.createElement('input')
      const newTuningFormNotesInput = document.createElement('input')
      const newTuningFormSubmit = document.createElement('input')
      const newTuningFormAddTuningButton = document.createElement('button')

      newTuningForm.id = 'new-tuning-form'
      newTuningFormH1.id = 'new-tuning-form-title'
      newTuningFormInstrumentSelect.id = 'new-tuning-form-instrument-select'
      newTuningFormNameInput.id = 'new-tuning-form-name-input'
      newTuningFormNotesInput.id = 'new-tuning-form-notes-input'
      newTuningFormSubmit.id = 'new-tuning-form-submit'
      newTuningFormAddTuningButton.id = 'new-tuning-form-add-tuning-button'

      newTuningForm.classList.add('pure-form', 'pure-form-stacked')
      newTuningFormH1.textContent = 'Add tuning to instrument'
      newTuningFormNameInput.placeholder = 'Tuning name'
      newTuningFormNotesInput.placeholder = 'Tuning notes (comma separated)'
      newTuningFormSubmit.type = 'submit'
      newTuningFormAddTuningButton.textContent = 'Add another tuning'

      for (const option of options) {
        newTuningFormInstrumentSelect.appendChild(option)
      }

      newTuningFormAddTuningButton.addEventListener(
        'click',
        Forms.handleAddTuningButtonClick.bind(Forms, newTuningForm, layout)
      )
      newTuningForm.addEventListener(
        'submit',
        Forms.handleNewTuningFormSubmit.bind(Forms, client)
      )
      newTuningForm.append(
        newTuningFormH1,
        newTuningFormInstrumentSelect,
        newTuningFormNameInput,
        newTuningFormNotesInput,
        newTuningFormSubmit
      )
      parent.append(newTuningForm, newTuningFormAddTuningButton)
      return newTuningForm
    })
  }

  static handleAddTuningButtonClick(form, layout) {
    const tuningNameInput = document.createElement('input')
    const tuningNotesInput = document.createElement('input')
    const submit = document.createElement('input')
    tuningNameInput.placeholder = 'Tuning name'
    tuningNotesInput.placeholder = 'Tuning notes (comma separated)'
    submit.type = 'submit'
    if (form.id === 'new-instrument-form') {
      submit.id = 'new-instrument-form-submit'
      layout.newInstrumentFormSubmit().remove()
    } else if (form.id === 'new-tuning-form') {
      submit.id = 'new-tuning-form-submit'
      layout.newTuningFormSubmit().remove()
    }
    form.append(tuningNameInput, tuningNotesInput, submit)
  }

  static handleAddTuningSubmit(layout) {
    event.preventDefault()
    const form = layout.newTuningForm()
    const tuningNameInput = document.createElement('input')
    const tuningNotesInput = document.createElement('input')
    const submit = document.createElement('input')
    tuningNameInput.placeholder = 'Tuning name'
    tuningNotesInput.placeholder = 'Tuning notes (comma separated)'
    submit.id = 'new-tuning-form-submit'
    submit.type = 'submit'
    layout.newTuningFormSubmit().remove()
    form.append(tuningNameInput, tuningNotesInput, submit)
  }

  static handleNewInstrumentFormSubmit(client) {
    event.preventDefault()
    let name
    const tuningNames = []
    const tuningNotes = []
    const tunings = []
    for (const child of event.target.children) {
      if (child.id === 'new-instrument-form-name-input') {
        name = child.value
      } else if (child.placeholder === 'Tuning name') {
        tuningNames.push(child.value)
      } else if (child.placeholder === 'Tuning notes (comma separated)') {
        tuningNotes.push(child.value)
      }
    }
    for (let i = 0; i < tuningNames.length; i++) {
      tunings.push(new Tuning(tuningNames[i], tuningNotes[i].split(', ')))
    }
    try {
      const instrument = new Instrument(name, null, null, null, tunings)
      client.sendInstrument(instrument).then((json) => {
        if (json.status && json.status == 'error') {
          console.log(json)
        } else {
          location.reload()
        }
      })
    } catch (e) {
      console.error(`Error creating or sending instrument: ${e}`)
    }
  }

  static handleNewTuningFormSubmit(client) {
    event.preventDefault()
    let instrumentID = 0
    const tuningNames = []
    const tuningNotes = []
    const tunings = []
    for (const child of event.target.children) {
      if (child.id === 'new-tuning-form-instrument-select') {
        instrumentID = child.value
      } else if (child.placeholder === 'Tuning name') {
        tuningNames.push(child.value)
      } else if (child.placeholder === 'Tuning notes (comma separated)') {
        tuningNotes.push(child.value)
      }
    }
    for (let i = 0; i < tuningNames.length; i++) {
      tunings.push(new Tuning(tuningNames[i], tuningNotes[i].split(', ')))
    }
    try {
      client.sendTunings(tunings, instrumentID).then((json) => {
        if (json.status && json.status == 'error') {
          console.log(json)
        } else {
          location.reload()
        }
      })
    } catch (e) {
      console.error(`Error creating or sending tunings: ${e}`)
    }
  }

  static handleTuningChange(tuner, layout, parent, interval) {
    event.preventDefault()
    let tuningPair
    if (event.target.value) {
      tuningPair = event.target.value.split(': ')
    } else if (event.target.children[0].value) {
      tuningPair = event.target.children[0].value.split(': ')
    }
    const tuning = new Tuning(tuningPair[0], tuningPair[1].split(', '))
    tuning.display(layout)
    if (tuner.started === false) {
      tuner.start()
      tuner.displayAtInterval(parent, interval)
      tuner.highlightMatchingNotes(tuning.notes, interval)
      tuner.drawGuage(layout, interval)
    } else {
      tuner.stop()
      tuner.start()
      tuner.displayAtInterval(parent, interval)
      tuner.highlightMatchingNotes(tuning.notes, interval)
      tuner.drawGuage(layout, interval)
    }
  }

  static handleDeleteInstrumentFormSubmit(client) {
    event.preventDefault()
    let instrumentID = 0
    for (const child of event.target.children) {
      if (child.id === 'delete-instrument-form-select') {
        instrumentID = child.value
      }
    }
    try {
      client.deleteInstrument(instrumentID).then((json) => {
        if (json.status && json.status == 'error') {
          console.log(json)
        } else {
          location.reload()
        }
      })
    } catch (e) {
      console.error(`Error deleting instrument: ${e}`)
    }
  }
}

export default Forms
