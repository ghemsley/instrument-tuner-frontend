import Pitchfinder from 'pitchfinder'

class Tuner {
  constructor() {
    this._pitchArray = []
    this._displayInterval = null
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

  static display(note, freq) {
    const h1 = () => document.getElementById('note')
    const h2 = () => document.getElementById('freq')
    h1().textContent = note.toUpperCase()
    h2().textContent = freq
  }

  displayAtInterval(interval) {
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
          Tuner.display(this.currentNote, avg)
        }
        this._pitchArray = []
        sum = 0
      }
    }, interval)
  }
}

export default Tuner
