import { LockPlugin, RangePlugin, easepick } from "@easepick/bundle";
import { availabilities } from "./availabilities";
import { updateRooms, updateSelectedRange } from "./components";
import { fetchRooms } from "./api";

export function setupPicker(id) {
  const PICKER_CONFIG = {
    element: id,
    autoApply: false,
    grid: 2,
    calendars: 2,
    zIndex: 100,
    css: [
      "https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.1/dist/index.css",
      'https://easepick.com/css/demo_prices.css',
      'https://easepick.com/css/demo_hotelcal.css',
    ],
    plugins: [RangePlugin, LockPlugin],
    RangePlugin: {
      tooltipNumber(num) {
        return num - 1;
      },
      locale: {
        one: 'night',
        other: 'nights',
      },
    },
    LockPlugin: {
      minDate: new Date(),
      minDays: 2,
      inseparable: true,
      filter(date) {
        const next = new Date(date.getTime() + 24 * 60 * 60 * 1000);
        const fmtDate = next.toISOString().split('T')[0];
        return !availabilities.get(fmtDate)
      },
    },
    setup(picker) {
      picker.on('view', (evt) => {
        const { view, date, target } = evt.detail
        const d = date ? date.format('YYYY-MM-DD') : null
        const span = getSpan(target)

        const dayData = availabilities.get(d);
        if (view === 'CalendarDay' && dayData) {
          span.innerHTML = `$ ${availabilities.get(d).price}`
          if (dayData.price_position === "high") {
            span.style.color = "red"
          } else {
            if (target.classList.contains('start') || target.classList.contains('end')) {
              span.style.color = "white"
            } else {
              span.style.color = null
            }
          }
        }
      })

      picker.on('select', (ext) => {
        const { start, end } = ext.detail

        fetchRooms(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'))
          .then(updateRooms)

        updateSelectedRange(
          start.format("MMMM-D").replace(/-/g, ', '), 
          end.format("MMMM-D").replace(/-/g, ', ')
        )
      })
    }
  }

  return new easepick.create(PICKER_CONFIG);
}

/**
 * Either returns the existing span or creates a new one
 */
function getSpan(target) {
  const span = target.querySelector('.day-price')
  if (span) {
    return span
  }

  const newSpan = `
    <span class="day-price"></span>
  `

  target.insertAdjacentHTML('beforeend', newSpan)
  return target.querySelector('.day-price')
}
