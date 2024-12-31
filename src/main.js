import './style.css'

import { availabilities } from './availabilities.js'
import { listComponent, overlayComponent, topComponent } from './components.js';
import { setupPicker } from './picker.js'

function loadFirstView() {
  // insert components
  const app = document.querySelector('#app');   
  app.insertAdjacentHTML('beforeend', topComponent())
  app.insertAdjacentHTML('beforeend', listComponent())
  app.insertAdjacentHTML('beforeend', overlayComponent())

  // center picker
  window.addEventListener('resize', centerPicker)
  centerPicker()

  // event listener for first selection
  const picker = setupPicker('#picker')

  // add event listeners
  addPickerListeners(picker)

  const listener = (_) => {
    const overlay = document.querySelector('#overlay')
    const container = document.querySelector('#picker-container')

    overlay.style.opacity = 0
    container.style.transitionDuration = '1s';
    container.style.transform = ""
    container.style.width = '180px'
    container.style.height = '50px'
    container.style.fontSize = '16px'

    picker.off("select", listener)
    window.removeEventListener('resize', centerPicker)

    setTimeout(() => {
      overlay.remove() 
    }, 1000)
  };
  picker.on("select", listener)
}
loadFirstView()

/**
 * Center the picker container to the middle of the screen
 */
function centerPicker() {
  const container = document.querySelector('#picker-container')
  container.style.transform = ''

  const shw = window.innerWidth / 2
  const shh = window.innerHeight / 2
  const rect = container.getBoundingClientRect();

  const translate = {
    x: (shw - rect.width / 2) - rect.x,
    y: (shh - rect.height / 2) - rect.y,
  };

  container.style.transform = `translate(${translate.x}px, ${translate.y}px)`
  container.style.zIndex = 10;
}

function addPickerListeners(picker) {
  const button = document.querySelector('#picker-button')

  const firstClickHandler = async () => {
    await availabilities.load()

    picker.renderAll()
    clickHandler()

    button.addEventListener('click', clickHandler)
    button.removeEventListener('click', firstClickHandler)
  }

  const clickHandler = () => {
    document.querySelector('#picker').click()
  }

  button.addEventListener('click', firstClickHandler)
}
