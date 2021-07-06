import Instrument from './instrument'
import Navbar from './navbar'
import Tuning from './tuning'

class Forms {
  static createNewInstrumentForm(parent, layout, client, tuner) {
    for (const child of parent.childNodes) {
      child.remove()
    }
    layout.clearContent()
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
      Forms.handleNewInstrumentFormSubmit.bind(Forms, client, layout, tuner)
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
    for (const child of parent.childNodes) {
      child.remove()
    }
    layout.clearContent()
    const options = []
    for (const instrument of Instrument.all) {
      const option = document.createElement('option')
      option.value = instrument.id
      option.text = instrument.name
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
      Forms.handleDeleteInstrumentFormSubmit.bind(Forms, client, layout)
    )
    deleteInstrumentForm.append(
      deleteInstrumentFormH1,
      deleteInstrumentFormSelect,
      deleteInstrumentFormSubmit
    )
    parent.appendChild(deleteInstrumentForm)
    return deleteInstrumentForm
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
      Forms.handleTuningChange.bind(
        Forms,
        tuner,
        layout,
        parent,
        interval,
        instrument
      )
    )
    tuningForm.addEventListener(
      'submit',
      Forms.handleTuningChange.bind(
        Forms,
        tuner,
        layout,
        parent,
        interval,
        instrument
      )
    )

    for (const tuning of Tuning.all) {
      if (tuning.instrument === instrument) {
        const option = document.createElement('option')
        const string = `${tuning.name}: ${tuning.notes.join(', ')}`
        option.value = string
        option.text = string
        tuningFormSelect.appendChild(option)
      }
    }

    tuningForm.append(tuningFormSelect, tuningFormSubmit)

    if (!layout.tuningForm()) {
      parent.appendChild(tuningForm)
    } else {
      layout.tuningForm().replaceWith(tuningForm)
    }
  }

  static createNewTuningForm = (parent, layout, client) => {
    for (const child of parent.childNodes) {
      child.remove()
    }
    layout.clearContent()
    const options = []
    for (const instrument of Instrument.all) {
      if (instrument.id) {
        const option = document.createElement('option')
        option.value = instrument.id
        option.text = instrument.name
        options.push(option)
      }
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
      Forms.handleNewTuningFormSubmit.bind(Forms, client, layout)
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

  static handleNewInstrumentFormSubmit(client, layout, tuner) {
    event.preventDefault()
    let name
    const tuningNames = []
    const tuningNotes = []
    for (const child of event.target.children) {
      if (child.id === 'new-instrument-form-name-input') {
        name = child.value
      } else if (child.placeholder === 'Tuning name') {
        tuningNames.push(child.value)
      } else if (child.placeholder === 'Tuning notes (comma separated)') {
        tuningNotes.push(child.value)
      }
    }
    try {
      const instrument = new Instrument(name, null, null, null)
      const tunings = []
      for (let i = 0; i < tuningNames.length; i++) {
        tunings.push(
          new Tuning(
            tuningNames[i],
            tuningNotes[i].split(', '),
            null,
            instrument
          )
        )
      }
      client.sendInstrument(instrument).then((json) => {
        console.log(json)
        layout.clearContent()
        if (json.data) {
          instrument.id = json.data.id
          instrument.imageLink = json.data.attributes.image_link
          instrument.imageArtist = json.data.attributes.image_artist
          instrument.imageArtistLink = json.data.attributes.image_artist_link
          tunings.forEach((tuning) => {
            tuning.instrument = instrument
            tuning.instrumentID = instrument.id
            const tuningJSON = json.included.find(
              (includedTuning) => includedTuning.attributes.name === tuning.name
            )
            tuning.id = tuningJSON.id
          })
          Navbar.addInstrumentSection(instrument, layout, tuner, 16)
        } else {
          console.log(Instrument.all.pop())
          tunings.forEach((tuning) =>
            Tuning.all.splice(Tuning.all.indexOf(tuning), 1)
          )
        }
      })
    } catch (e) {
      console.error(`Error creating or sending instrument: ${e}`)
    }
  }

  static handleNewTuningFormSubmit(client, layout) {
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
    const instrument = Instrument.all.find(
      (instrumentObject) => instrumentObject.id === instrumentID
    )
    for (let i = 0; i < tuningNames.length; i++) {
      tunings.push(
        new Tuning(tuningNames[i], tuningNotes[i].split(', '), null, instrument)
      )
    }
    try {
      client.sendTunings(tunings, instrumentID).then((json) => {
        console.log(json)
        layout.clearContent()
        try {
          json.data.forEach((tuningJSON) => {
            const tuning = Tuning.all.find(
              (tuningObject) =>
                tuningObject.name === tuningJSON.attributes.name &&
                tuningObject.instrument === instrument
            )
            tuning.id = tuningJSON.id
          })
        } catch (e) {
          tunings.forEach((tuning) =>
            Tuning.all.splice(Tuning.all.indexOf(tuning), 1)
          )
        }
      })
    } catch (e) {
      console.error(`Error creating or sending tunings: ${e}`)
    }
  }

  static handleTuningChange(tuner, layout, parent, interval, instrument) {
    event.preventDefault()
    let tuningPair
    if (event.target.value) {
      tuningPair = event.target.value.split(': ')
    } else if (event.target.children[0].value) {
      tuningPair = event.target.children[0].value.split(': ')
    }
    const tuning = Tuning.all.find(
      (tuningObject) =>
        tuningObject.name === tuningPair[0] &&
        tuningObject.instrument === instrument
    )
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

  static handleDeleteInstrumentFormSubmit(client, layout) {
    event.preventDefault()
    let instrumentID = 0
    for (const child of event.target.children) {
      if (child.id === 'delete-instrument-form-select') {
        instrumentID = child.value
      }
    }
    try {
      client.deleteInstrument(instrumentID).then((json) => {
        console.log(json)
        layout.clearContent()
        const idString = json.data.attributes.name
          .toLowerCase()
          .split(' ')
          .join('-')
        const instrumentItem = document.getElementById(
          `navbar-${idString}-item`
        )
        instrumentItem.remove()
        Instrument.all.forEach((instrumentObject) => {
          if ((instrumentObject.id === json.data.id)) {
            const instrumentIndex = Instrument.all.indexOf(instrumentObject)
            Instrument.all.splice(instrumentIndex, 1)
            Tuning.all.forEach((tuning) => {
              if (
                tuning.instrumentID === instrumentObject.id ||
                tuning.instrument === instrumentObject
              ) {
                const tuningIndex = Tuning.all.indexOf(tuning)
                Tuning.all.splice(tuningIndex, 1)
              }
            })
          }
        })
      })
    } catch (e) {
      console.error(`Error deleting instrument: ${e}`)
    }
  }
}

export default Forms
