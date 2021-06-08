import Client from './client'
import Tuner from './tuner'
import Layout from './layout'
import '../sass/app.scss'

document.addEventListener('DOMContentLoaded', (event) => {
  const client = new Client('http://localhost:3000/')
  const tuner = new Tuner()
  const layout = new Layout(client, tuner)
  layout.create(document.body)
})
