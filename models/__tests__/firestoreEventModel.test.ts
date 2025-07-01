import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc
} from 'firebase/firestore';
import {
  createTravelEvent,
  createTravelEventBooking,
  getTravelEventBookings,
  getTravelEvents
} from '../firestoreEventModel';

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => 'mocked-firestore'),
  collection: jest.fn(() => 'mocked-collection-ref'),
  doc: jest.fn(() => 'mocked-doc-ref'),
  query: jest.fn(() => 'mocked-query-ref'),
  orderBy: jest.fn(() => 'mocked-order-by'),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  addDoc: jest.fn(() => Promise.resolve({ id: 'abc123' })),
  updateDoc: jest.fn(),
  serverTimestamp: jest.fn(() => 'mocked-timestamp'),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

// CREATE TRAVEL EVENT - Success
test('createTravelEvent adds a new document with the correct data', async () => {
  const mockData = {
    title: 'Travel to Football Match',
    destination: 'Stockport',
    pickupLocation: 'Mansfield',
    pickupDate: '01/01/2025',
    pickupTime: '08:00',
    price: 20,
    seatsAvailable: 56,
    requirePayment: true,
    organizerName: 'Billy',
    organizerUid: 'user123',
  };

  await createTravelEvent(mockData);

  expect(collection).toHaveBeenCalledWith(expect.anything(), 'travelEvents');

  expect(addDoc).toHaveBeenCalledWith('mocked-collection-ref', {
    ...mockData,
    createdAt: 'mocked-timestamp',
  });
});

// CREATE TRAVEL EVENT - Fail
test('createTravelEvent throws an error if addDoc fails', async () => {
  const errorMessage = 'Firestore addDoc failed';
  (addDoc as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

  const mockData = {
    title: 'Test Failure Event',
    destination: 'Nowhere',
    pickupLocation: 'Anywhere',
    pickupDate: '02/05/2025',
    pickupTime: '10:00',
    price: 1,
    seatsAvailable: 56,
    requirePayment: false,
    organizerName: 'Billy',
    organizerUid: 'user123',
  };

  await expect(createTravelEvent(mockData)).rejects.toThrow(errorMessage);
});

// GET TRAVEL EVENT - Success
test('getTravelEvents fetches and returns ordered documents with pickupDate', async () => {
  const mockDocs = [
    { id: '1', data: () => ({ title: 'Match A', pickupDate: '2025-07-01' }) },
    { id: '2', data: () => ({ title: 'Match B', pickupDate: '2025-07-10' }) },
  ];

  (getDocs as jest.Mock).mockResolvedValueOnce({ docs: mockDocs });

  const events = await getTravelEvents();

  expect(collection).toHaveBeenCalledWith(expect.anything(), 'travelEvents');
  expect(query).toHaveBeenCalledWith('mocked-collection-ref', 'mocked-order-by');
  expect(getDocs).toHaveBeenCalledWith('mocked-query-ref');

  expect(events).toEqual([
    { id: '1', title: 'Match A', pickupDate: '2025-07-01' },
    { id: '2', title: 'Match B', pickupDate: '2025-07-10' },
  ]);
});

// GET TRAVEL EVENT - Fail
test('getTravelEvents throws an error if getDocs fails', async () => {
  const errorMessage = 'Firestore getDocs failed';
  (getDocs as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

  await expect(getTravelEvents()).rejects.toThrow(errorMessage);
});

// TRAVEL EVENT BOOKING - Success
test('createTravelEventBooking successfully updates seatsBooked and adds a booking', async () => {
  const booking = {
    seatsBooked: 2,
    payed: true,
    bookerName: 'Alice',
    bookerUid: 'user789',
  };

  (getDoc as jest.Mock).mockResolvedValueOnce({
    exists: () => true,
    data: () => ({
      seatsAvailable: 10,
      seatsBooked: 3, // seats already booked
    }),
  });

  await createTravelEventBooking('event123', booking);

  expect(updateDoc).toHaveBeenCalledWith('mocked-doc-ref', {
    seatsBooked: 5,
  });

  expect(collection).toHaveBeenCalledWith('mocked-doc-ref', 'bookings');
  expect(addDoc).toHaveBeenCalledWith('mocked-collection-ref', {
    ...booking,
    createdAt: 'mocked-timestamp',
  });
});

// TRAVEL EVENT BOOKING - Fail (overbooking)
test('createTravelEventBooking throws an error when booking exceeds available seats', async () => {
  const booking = {
    seatsBooked: 4,
    payed: false,
    bookerName: 'Bob',
    bookerUid: 'user111',
  };

  (getDoc as jest.Mock).mockResolvedValueOnce({
    exists: () => true,
    data: () => ({
      seatsAvailable: 5,
      seatsBooked: 3, // seats already booked
    }),
  });

  await expect(createTravelEventBooking('event123', booking)).rejects.toThrow(
    'Only 2 seat(s) remaining.'
  );

  expect(updateDoc).not.toHaveBeenCalled();
  expect(addDoc).not.toHaveBeenCalled();
});

// GET TRAVEL EVENT BOOKINGS - Success
test('getTravelEventBookings returns bookings from subcollection', async () => {
  const mockDocs = [
    { id: '1', data: () => ({ bookerName: 'Alice', seatsBooked: 2, payed: true }) },
    { id: '2', data: () => ({ bookerName: 'Bob', seatsBooked: 1, payed: false }) },
  ];

  (getDocs as jest.Mock).mockResolvedValueOnce({ docs: mockDocs });

  const bookings = await getTravelEventBookings('event123');

  expect(doc).toHaveBeenCalledWith(expect.anything(), 'travelEvents', 'event123');
  expect(collection).toHaveBeenCalledWith('mocked-doc-ref', 'bookings');
  expect(getDocs).toHaveBeenCalledWith('mocked-collection-ref');

  expect(bookings).toEqual([
    { id: '1', bookerName: 'Alice', seatsBooked: 2, payed: true },
    { id: '2', bookerName: 'Bob', seatsBooked: 1, payed: false },
  ]);
});

// GET TRAVEL EVENT BOOKINGS - Fail
test('getTravelEventBookings throws an error if getDocs fails', async () => {
  const errorMessage = 'Failed to get bookings';
  (getDocs as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

  await expect(getTravelEventBookings('event123')).rejects.toThrow(errorMessage);

  expect(doc).toHaveBeenCalledWith(expect.anything(), 'travelEvents', 'event123');
  expect(collection).toHaveBeenCalledWith('mocked-doc-ref', 'bookings');
});