import Pitchfinder from 'pitchfinder'

class Tuner {
  constructor() {
    this.noteH1 = () => document.getElementById('note')
    this.freqH2 = () => document.getElementById('freq')
    this.guage = () => document.getElementById('guage')
    this.needle = () => document.getElementById('needle')
    this.marker = () => document.getElementById('marker')
    this._pitchArray = []
    this._displayInterval = null
    this._guageInterval = null
    this._matchNotesInterval = null
    this.currentPitch = Tuner.c0
    this.currentNote = 'c0'
    this.started = false
  }

  static a4 = 440
  static c0 = Tuner.a4 * 2 ** -4.75
  static notes = [
    'c',
    'c#',
    'd',
    'd#',
    'e',
    'f',
    'f#',
    'g',
    'g#',
    'a',
    'a#',
    'b'
  ]

  static noteScaleArray = Tuner.notesWithOctave(Tuner.notes)
  static pitchMap = Tuner.mapPitches(Tuner.noteScaleArray)

  static convertPitch(pitch) {
    const h = Math.round(12 * Math.log2(pitch / Tuner.c0))
    const octave = Math.floor(h / 12)
    const index = h % 12
    return Tuner.notes[index] + octave.toString()
  }

  static convertNote(note) {
    return this.pitchMap[note]
  }

  static notesWithOctave(notes) {
    const array = []
    for (let i = 0; i <= 8; i++) {
      for (const note of notes) {
        array.push(note + i.toString())
      }
    }
    return array
  }

  static mapPitches(noteScaleArray) {
    const map = {}
    for (const note of noteScaleArray) {
      for (let pitch = 16.35; pitch <= 7902.13; pitch += 0.01) {
        if (Tuner.convertPitch(pitch) === note) {
          map[note] = pitch
          break
        }
      }
    }
    return map
  }

  display(note, freq, parent) {
    const h1 = this.noteH1() || document.createElement('h1')
    const h2 = this.freqH2() || document.createElement('h2')
    h1.id = 'note'
    h2.id = 'freq'
    h1.textContent = note.toUpperCase()
    h2.textContent = freq.toFixed(2) + ' Hz'
    if (parent.contains(h1)) {
      this.noteH1().replaceWith(h1)
    } else {
      parent.append(h1)
    }
    if (parent.contains(h2)) {
      this.freqH2().replaceWith(h2)
    } else {
      parent.append(h2)
    }
  }

  displayAtInterval(parent, interval) {
    let sum = 0
    try {
      clearInterval(this._displayInterval)
    } catch (e) {
      console.error(e)
    }
    this._displayInterval = setInterval(() => {
      if (this._pitchArray.length > 0) {
        for (const pitch of this._pitchArray) {
          sum += pitch
        }
        if (!(isNaN(sum) || typeof sum === 'undefined') && sum >= Tuner.c0) {
          const avg = sum / this._pitchArray.length
          this.currentNote = Tuner.convertPitch(avg)
          this.display(this.currentNote, avg, parent)
        }
        this._pitchArray = []
        sum = 0
      }
    }, interval)
  }

  start() {
    return new Promise((resolve, reject) => {
      try {
        if (this.started === false) {
          navigator.mediaDevices
            .getUserMedia({ audio: true, video: false })
            .then((stream) => {
              const audioContext = new AudioContext()
              const source = audioContext.createMediaStreamSource(stream)
              const processor = audioContext.createScriptProcessor(2048, 1, 1)
              processor.onaudioprocess = (event) => {
                const micData = event.inputBuffer.getChannelData(0)
                const detectPitch = Pitchfinder.ACF2PLUS({
                  sampleRate: audioContext.sampleRate
                })
                this.currentPitch = detectPitch(micData)
                if (
                  this.currentPitch < 16000 &&
                  this.currentPitch >= Tuner.c0 &&
                  !(
                    isNaN(this.currentPitch) ||
                    typeof this.currentPitch === 'undefined'
                  )
                ) {
                  this._pitchArray.push(this.currentPitch)
                }
              }
              source.connect(processor)
              processor.connect(audioContext.destination)
            })
            .then(() => {
              this.started = true
            })
        }
        resolve(this)
      } catch (e) {
        this.started = false
        reject(`Error during tuner setup: ${e}`)
      }
    })
  }

  stop() {
    if (this._displayInterval) {
      clearInterval(this._displayInterval)
    }
    if (this._guageInterval) {
      clearInterval(this._guageInterval)
    }
    const elementFunctions = [
      this.noteH1,
      this.freqH2,
      this.guage,
      this.needle,
      this.marker
    ]
    for (const elementFunction of elementFunctions) {
      if (elementFunction()) {
        elementFunction().remove()
      }
    }
  }

  matchNotes(notesArray) {
    for (const note of notesArray) {
      if (note.toLowerCase() === this.currentNote) {
        return true
      }
    }
    return false
  }

  createGuage(layout) {
    const guage = document.createElement('div')
    const needle = document.createElement('div')
    const marker = document.createElement('div')

    guage.id = 'guage'
    needle.id = 'needle'
    marker.id = 'marker'

    guage.append(needle, marker)
    layout.content().appendChild(guage)
    return this
  }

  drawGuage(layout, interval) {
    if (!this.guage()) {
      this.createGuage(layout)
    }
    if (this._guageInterval) {
      clearInterval(this._guageInterval)
    }
    this._guageInterval = setInterval(() => {
      const unit = window.innerWidth / 4
      let min = Tuner.convertNote(this.currentNote)
      let mid = this.currentPitch
      let max =
        Tuner.pitchMap[
          Tuner.noteScaleArray[
            Tuner.noteScaleArray.indexOf(this.currentNote) + 1
          ]
        ]
      mid = mid < min || !mid ? min : mid
      mid = mid > max ? max : mid
      let range = max - min
      range = range <= 0 ? 0.0001 : range
      let position = mid - min
      position = position < 0 ? 0 : position
      let percentage = range <= 0.0001 ? 1 : position / range
      let final = percentage * (unit * 2) + unit
      final = final > unit * 3 ? unit * 3 : final
      if (this.needle()) {
        this.needle().style.left = `${final}px`
      }
    }, interval)
    return this
  }

  highlightMatchingNotes(notes, interval) {
    if (this._matchNotesInterval) {
      clearInterval(this._matchNotesInterval)
    }
    this._matchNotesInterval = setInterval(() => {
      if (this.matchNotes(notes) && this.noteH1()) {
        this.noteH1().style.color = 'lightseagreen'
      } else if (this.noteH1()) {
        this.noteH1().style.color = 'black'
      }
    }, interval)
    return this
  }
}

export default Tuner
