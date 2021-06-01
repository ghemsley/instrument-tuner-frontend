import Pitchfinder from 'pitchfinder'

const container = () => document.getElementById('container')
const guage = () => document.getElementById('guage')
const needle = () => document.getElementById('needle')
const marker = () => document.getElementById('marker')

class Tuner {
  constructor() {
    this._pitchArray = []
    this._displayInterval = null
    this._guageInterval = null
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
    h2().textContent = freq.toFixed(2) + ' Hz'
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

  startTuner() {
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

  matchNotes(notesArray) {
    for (const note of notesArray) {
      if (note.toLowerCase() === this.currentNote) {
        return true
      }
    }
    return false
  }

  createGuage() {
    const _guage = guage() ? guage() : document.createElement('div')
    const _needle = needle() ? needle() : document.createElement('div')
    const _marker = marker() ? marker() : document.createElement('div')

    _guage.id = 'guage'
    _guage.style.height = '50px'
    _guage.style.width = '50%'
    _guage.style.position = 'fixed'
    _guage.style.bottom = '25%'
    _guage.style.left = '25%'
    _guage.style.backgroundColor = 'rgb(0, 100, 200)'

    _needle.id = 'needle'
    _needle.style.height = '50px'
    _needle.style.width = '20px'
    _needle.style.position = 'fixed'
    _needle.style.bottom = '25%'
    _needle.style.left = '25%'
    _needle.style.backgroundColor = 'rgb(0, 200, 100)'

    _marker.id = 'marker'
    _marker.style.height = '50px'
    _marker.style.width = '10px'
    _marker.style.position = 'fixed'
    _marker.style.bottom = '25%'
    _marker.style.left = '50%'
    _marker.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
    _guage.append(_needle, _marker)
    container().appendChild(_guage)
  }

  drawGuage() {
    if (!(guage() instanceof HTMLDivElement)) {
      this.createGuage()
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
      range = range < 0 ? 0 : range
      let position = mid - min
      position = position < 0 ? 0 : position
      let percentage = range <= 0 ? 1 : position / range
      let final = percentage * (unit * 2) + unit
      final = final > unit * 3 ? unit * 3 : final
      needle().style.left = `${final}px`
    }, 25)
  }
}

export default Tuner
