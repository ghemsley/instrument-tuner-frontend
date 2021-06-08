import Forms from './forms'
import Instrument from './instrument'

class Navbar {
  constructor(title, sections = []) {
    this.title = title
    this.sections = sections
  }

  addSection(sectionObject) {
    this.sections.push(sectionObject)
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

  static createFromData = (parent, layout, client, tuner) => {
    return client.getInstruments().then((instrumentJSON) => {
      Instrument.createInstrumentsFromJSON(instrumentJSON, client).then(
        (instruments) => {
          const sections = []
          for (const instrument of instruments) {
            sections.push({
              name: instrument.name,
              onClick: instrument.display.bind(
                instrument,
                layout.content(),
                layout,
                tuner
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
                client
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
            }
          )
          const navbar = new Navbar('Instrument tuner', sections)
          navbar.appendToParent(parent, layout)
          return navbar
        }
      )
    })
  }
}

export default Navbar
