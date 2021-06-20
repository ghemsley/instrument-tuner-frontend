class ErrorModal {
  constructor(message, timeout) {
    this.message = message
    this.timeout = timeout
    this.element = this.getOrCreateElement()
  }

  getOrCreateElement() {
    if (this.element) {
      return this.element
    } else {
      if (document.getElementById('error')) {
        return document.getElementById('error')
      } else {
        const error = document.createElement('div')
        const errorMessage = document.createElement('p')
        const errorCloseButton = document.createElement('button')

        error.id = 'error'
        errorMessage.id = 'error-message'
        errorCloseButton.id = 'error-close-button'
        errorMessage.textContent = this.message
        errorCloseButton.textContent = 'Close'

        errorCloseButton.addEventListener('click', (event) => this.remove())

        error.append(errorMessage, errorCloseButton)

        return error
      }
    }
  }

  remove() {
    this.element.remove()
  }

  display() {
    document.body.appendChild(this.element)
    this.removeAfterTimeout()
  }

  removeAfterTimeout() {
    setTimeout(() => {
      this.remove()
    }, this.timeout)
  }
}

export default ErrorModal
