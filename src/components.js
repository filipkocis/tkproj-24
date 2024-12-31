/**
 * Returns HTML for the picker component
 */
export function pickerComponent(width, height, fontSize = 20) {
  const view = `
    <div 
      id="picker-container"
      style="width: ${width}px; height: ${height}px; font-size: ${fontSize}px"
      class="relative ease-in-out duration-0 transition-all"
    >
      <button id="picker" class="absolute opacity-0 bottom-0 -left-[230px]"></button>

      <button 
        id="picker-button"
        class="transition-all duration-100 w-full h-full overflow-hidden -translate-x-2 -translate-y-2 bg-yellow-400 text-black font-bold border-4 border-black flex items-center justify-center hover:-translate-x-1 hover:-translate-y-1"
      >
        BOOK NOW
      </button>

      <div class="absolute -z-10 w-full h-full bg-black top-0 left-0">
      </div>
    </div>
  `
  return view
}

/**
 * Returns HTML for the picker component
 */
export function overlayComponent() {
  return `
    <div id="overlay" class="duration-1000 bg-[#1561fa] transition-opacity z-[1] absolute w-screen h-screen top-0 left-0 flex items-center justify-center">
    </div>
  `
}

/**
 * Returns HTML for the first grid component
 */
export function topComponent() {
  return `
    <div class="grid grid-cols-[1fr,250px] gap-1 items-center justify-items-center">
      <div class="flex flex-col gap-2">
        <h2 class="font-bold text-3xl">Available rooms</h2>
        <p id="selected-range" class="text-2xl"></p>
      </div>

      ${pickerComponent(250, 70, 16 * 1.5)} 
    </div>
  `
}

/**
 * Returns HTML for the second grid component
 */
export function listComponent() {
  const defaultLoader = `
    <div class="animate-pulse bg-blue-100 h-[208px]"></div>
  `

  return `
    <div id="rooms" class="content-baseline p-1 grid gap-3 overflow-y-auto">
      ${defaultLoader} 
      ${defaultLoader} 
      ${defaultLoader} 
    </div>
  `
}

function roomComponent(room) {
  const img = room._embedded.pictures.at(0)?.offer_teaser_square
  // where is the field in the api response? 
  const peopleNum = Math.floor(room.full_price / room.full_price_pp)
  const peopleText = peopleNum > 1 ? `${peopleNum} people` : `1 person`

  const parseAmenity = (amenity) => {
    // limit to 3 to not stretch the card
    const whitelisted = ['air-conditioning', 'hair-dryer', 'flat-tv']
    if (!whitelisted.includes(amenity.name)) return null
    return amenity.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const amenities = room._embedded.amenities.map(parseAmenity).filter(Boolean)

  return `
    <div class="grid grid-cols-[auto,1fr,auto] gap-4 p-3 border-4 border-black">
      <div>
        <img src="${img}" alt="${room.name}" class="w-44 h-44 object-cover">
      </div>

      <div class="flex flex-col gap-2">
        <h3 class="font-semibold text-2xl">${room.name}</h3> 
        <ul class="flex flex-col gap-1 items-start list-disc pl-5 [&>li]:text-[0.95rem]">
          <li>${room.room_size_max} m<sup>2</sup></li>
          ${amenities.map(amenity => `<li>${amenity}</li>`).join('')}
        </ul>
      </div>

      <div class="flex flex-col justify-center items-center">
        <p class="font-bold text-3xl">${room.full_formatted_price}</p>
        <p class="text-sm">/ per ${peopleText}</p>
      </div>
    </div>
  `
}

export function updateSelectedRange(start, end) {
  const selectedRange = document.querySelector('#selected-range')
  selectedRange.innerHTML = `${start} <span class="font-bold px-1">to</span> ${end}`
}

export function updateRooms(rooms) {
  const roomsEl = document.querySelector('#rooms')
  roomsEl.innerHTML = ''

  for (const room of rooms){
    const component = roomComponent(room)
    roomsEl.insertAdjacentHTML('beforeend', component) 
  }
}
