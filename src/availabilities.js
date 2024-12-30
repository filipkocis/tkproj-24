import { fetchHotelData } from './api'

class Availabilities {
  #data = new Map()
  loaded = false

  constructor() {}

  async load() {
    if (this.loaded) {
      return
    }

    const data = await fetchHotelData()
    for (const item of data) {
      this.#data.set(item.data, item)
    }
    this.loaded = true
  }

  get(date) {
    return this.#data.get(date)
  }
}

export const availabilities = new Availabilities()
