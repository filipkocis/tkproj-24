/**
 * Fetch hotel availabilities for a 6 month range from the current date
 */
export const fetchHotelData = async () => {
  const now = new Date();
  const future = new Date();
  future.setMonth(now.getMonth() + 6);

  const start = now.toISOString().split('T')[0];
  const end = future.toISOString().split('T')[0];

  const res =  await fetch(`https://api.travelcircus.net/hotels/17080/checkins?E&party=%7B%22adults%22:2,%22children%22:%5B%5D%7D&domain=de&date_start=${start}&date_end=${end}`)
  const json = await res.json()
  return json._embedded.hotel_availabilities
}

/**
 * Fetch hotel quotes for a given date range (format YYYY-MM-DD)
 */
export const fetchRooms = async (start, end) => {
  await fetch(`https://api.travelcircus.net/hotels/17080/quotes?locale=de_DE&checkin=${start}&checkout=${end}&party=%7B%22adults%22:2,%22children%22:[]%7D&domain=de`)
}
