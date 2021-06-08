class Client {
  constructor(baseURL) {
    this.baseURL = baseURL || 'http://localhost:3000/'
  }

  sendData(route, object) {
    return fetch(this.baseURL + route, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(object)
    })
      .then((response) => response.json())
      .catch((error) => console.error(error))
  }

  fetchData = (route) => {
    return fetch(this.baseURL + route, {
      headers: { Accept: 'application/json' }
    })
      .then((response) => response.json())
      .catch((error) => console.error(error))
  }

  getInstrument(id) {
    return this.fetchData(`instruments/${id}`)
  }
  getInstruments(filter) {
    return this.fetchData(`instruments${filter ? filter : ''}`)
  }

  sendInstrument = (instrument) => {
    return this.sendData('instruments', instrument.toObject())
  }

  getTuning(id) {
    return this.fetchData(`tunings/${id}`)
  }
  getTunings(filter) {
    return this.fetchData(`tunings${filter ? filter : ''}`)
  }

  sendTunings(tunings, instrumentID) {
    let tuningsJSON = tunings.map((tuning) => tuning.toObject())
    let finalObject = { instrumentID: instrumentID, tunings: tuningsJSON }
    return this.sendData('tunings', finalObject)
  }
}

export default Client