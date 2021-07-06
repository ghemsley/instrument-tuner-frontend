import Forms from './forms'
import Instrument from './instrument'
import Tuning from './tuning'

class Navbar {
  constructor(title, sections = []) {
    this.title = title
    this.sections = sections
  }

  appendToParent(parent, layout) {
    const navbarDiv = document.createElement('div')
    const navbarUl = document.createElement('ul')
    const titleH1 = document.createElement('h1')
    navbarDiv.id = 'navbar'
    navbarUl.id = 'navbar-list'
    titleH1.id = 'navbar-title'
    navbarDiv.classList.add(
      'pure-menu',
      'pure-menu-horizontal',
      'pure-menu-scrollable'
    )
    navbarUl.classList.add('pure-menu-list')
    titleH1.textContent = this.title
    titleH1.classList.add('pure-link', 'pure-menu-heading')
    navbarDiv.appendChild(titleH1)
    const sectionsArray = this.sections.map((sectionObject) => {
      const idString = sectionObject.name.toLowerCase().split(' ').join('-')

      const sectionLi = document.createElement('li')
      const sectionA = document.createElement('a')
      const sectionP = document.createElement('p')

      sectionLi.id = `navbar-${idString}-item`
      sectionA.id = `navbar-${idString}-link`
      sectionP.id = `navbar-${idString}-text`

      sectionLi.classList.add('pure-menu-item')
      sectionA.classList.add('pure-menu-link')
      sectionP.textContent = sectionObject.name

      sectionA.appendChild(sectionP)

      if (sectionObject.link) {
        sectionA.href = sectionObject.link
      } else if (sectionObject.onClick) {
        sectionA.href = '#'
        sectionA.addEventListener('click', sectionObject.onClick)
      } else {
        sectionA.href = '#'
      }
      sectionLi.appendChild(sectionA)
      return sectionLi
    })
    for (const section of sectionsArray) {
      navbarDiv.appendChild(section)
    }
    if (layout.content()) {
      parent.insertBefore(navbarDiv, layout.content().parentNode)
    } else {
      parent.appendChild(navbarDiv)
    }
  }

  static addInstrumentSection(instrument, layout, tuner, interval) {
    const section = {
      name: instrument.name,
      onClick: instrument.display.bind(
        instrument,
        layout.content(),
        layout,
        tuner,
        interval
      )
    }
    const idString = section.name.toLowerCase().split(' ').join('-')
    const item = document.createElement('li')
    const link = document.createElement('a')
    const p = document.createElement('p')

    item.id = `navbar-${idString}-item`
    link.id = `navbar-${idString}-link`
    p.id = `navbar-${idString}-text`

    item.classList.add('pure-menu-item')
    link.classList.add('pure-menu-link')
    p.textContent = section.name

    link.appendChild(p)
    link.href = '#'
    link.addEventListener('click', section.onClick)
    item.appendChild(link)

    document
      .getElementById('navbar')
      .insertBefore(item, document.getElementById('navbar-new-instrument-item'))
  }

  static createFromData = (parent, layout, client, tuner, interval) =>
    client.getInstruments().then((instrumentJSON) =>
      Instrument.findOrCreateInstrumentsFromJSON(instrumentJSON).then(
        (instruments) => {
          instrumentJSON.included.forEach((tuningJSON) => {
            new Tuning(
              tuningJSON.attributes.name,
              tuningJSON.attributes.notes,
              tuningJSON.id,
              instruments.find(
                (instrumentObject) =>
                  instrumentObject.id ===
                  tuningJSON.relationships.instrument.data.id
              )
            )
          })
          const sections = []
          for (const instrument of instruments) {
            sections.push({
              name: instrument.name,
              onClick: instrument.display.bind(
                instrument,
                layout.content(),
                layout,
                tuner,
                interval
              )
            })
          }
          sections.push(
            {
              name: 'New instrument',
              onClick: Forms.createNewInstrumentForm.bind(
                Forms,
                layout.content(),
                layout,
                client,
                tuner
              )
            },
            {
              name: 'Add tuning to instrument',
              onClick: Forms.createNewTuningForm.bind(
                Forms,
                layout.content(),
                layout,
                client
              )
            },
            {
              name: 'Remove an instrument',
              onClick: Forms.deleteInstrumentForm.bind(
                Forms,
                layout.content(),
                layout,
                client
              )
            },
            {
              name: 'Instructions',
              onClick: layout.createHowToStuff.bind(layout, layout.content())
            }
          )
          const navbar = new Navbar('Instrument Tuner', sections)
          navbar.appendToParent(parent, layout)
          return navbar
        }
      )
    )
}

export default Navbar
