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

        if (view === 'CalendarDay' && availabilities[d]) {
          const span = target.querySelector('.day-price') || document.createElement('span')
          span.className = 'day-price border border-red-400'
          span.innerHTML = `$ ${availabilities[d]}`
          target.append(span)
        }
      });
    }
  }

  return new easepick.create(PICKER_CONFIG);
}
