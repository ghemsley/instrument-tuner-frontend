class Client {
  static baseURL = 'http://localhost:3000/'

  static sendData(route, object) {
    return fetch(Client.baseURL + route, {
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

  static fetchData = (route) => {
    return fetch(Client.baseURL + route, {
      headers: { Accept: 'application/json' }
    })
      .then((response) => response.json())
      .catch((error) => console.error(error))
  }

  static getInstrument(id) {
    return Client.fetchData(`instruments/${id}`)
  }
  static getInstruments(filter) {
    return Client.fetchData(`instruments${filter ? filter : ''}`)
  }

  static sendInstrument = (instrument) => {
    return Client.sendData('instruments', instrument.toObject())
  }

  static getTuning(id) {
    return Client.fetchData(`tunings/${id}`)
  }
  static getTunings(filter) {
    return Client.fetchData(`tunings${filter ? filter : ''}`)
  }

  static sendTunings(tunings, instrumentID) {
    let tuningsJSON = tunings.map((tuning) => tuning.toObject())
    let finalObject = { instrumentID: instrumentID, tunings: tuningsJSON }
    return Client.sendData('tunings', finalObject)
  }
}

export default Client
