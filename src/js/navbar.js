const content = () => document.getElementById('content')

class Navbar {
  constructor(title, sections = []) {
    this.title = title
    this.sections = sections
  }

  addSection(sectionObject) {
    this.sections.push(sectionObject)
  }

  appendToParent(parent) {
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
      const sectionLi = document.createElement('li')
      const sectionA = document.createElement('a')
      const sectionP = document.createElement('p')
      sectionLi.id = `navbar-${sectionObject.name}-item`
      sectionA.id = `navbar-${sectionObject.name}-link`
      sectionP.id = `navbar-${sectionObject.name}-text`
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
    if (content()) {
      parent.insertBefore(navbarDiv, content().parentNode)
    } else {
      parent.appendChild(navbarDiv)
    }
  }
}

export default Navbar
