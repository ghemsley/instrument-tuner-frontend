class Tuning {
  constructor(name, notes = []) {
    this.name = name
    this.notes = notes
  }

  toObject() {
    let object = { name: this.name, notes: this.notes }
    return object
  }
}

export default Tuning
