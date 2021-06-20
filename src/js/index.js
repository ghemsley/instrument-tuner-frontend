import Client from './services/client'
import Tuner from './components/tuner'
import Layout from './components/layout'
import '../sass/app.scss'

document.addEventListener('DOMContentLoaded', (event) => {
  const client = new Client('http://localhost:3000/')
  const tuner = new Tuner()
  const layout = new Layout(client, tuner)
  layout.create(document.body, 16)
})
