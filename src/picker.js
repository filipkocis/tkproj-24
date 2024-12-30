import { easepick } from "@easepick/bundle";
import { RangePlugin } from '@easepick/range-plugin';

import { availabilities } from "./availabilities";

export function setupPicker(id) {
  const PICKER_CONFIG = {
    element: id,
    css: [
      "https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.1/dist/index.css",
      'https://easepick.com/css/demo_prices.css',
    ],
    plugins: [RangePlugin],
    RangePlugin: {
      tooltipNumber(num) {
        return num - 1;
      },
      locale: {
        one: 'night',
        other: 'nights',
      },
    },
    zIndex: 100,
    setup(picker) {
      // add price to day element
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
            span.style.color = null
          }
        }
      });
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
