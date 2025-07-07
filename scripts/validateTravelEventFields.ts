export function validateTravelEventFields(fields: {
  title: string;
  destination: string;
  pickupLocation: string;
  pickupDate: string;
  pickupTime: string;
  price: string;
  seatsAvailable: string;
}): string {
  const {
    title,
    destination,
    pickupLocation,
    pickupDate,
    pickupTime,
    price,
    seatsAvailable,
  } = fields;

  if (
    !title ||
    !destination ||
    !pickupLocation ||
    !pickupDate ||
    !pickupTime ||
    !price ||
    !seatsAvailable
  ) {
    return 'All fields are required.';
  }

  if (isNaN(Number(price))) {
    return 'Price must be a number.';
  }

  if (
    isNaN(Number(seatsAvailable)) ||
    !Number.isInteger(Number(seatsAvailable))
  ) {
    return 'Seats available must be a whole number.';
  }

  return '';
}