import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  updateDoc
} from 'firebase/firestore';
import {
  createTravelEvent,
  createTravelEventBooking,
  getTravelEventBookings,
  getTravelEvents,
  getUserTravelEventBookings,
  subscribeToTravelEventById,
  subscribeToTravelEvents,
  subscribeToUserTravelEventBookings,
  updateTravelEvent,
  updateTravelEventBooking,
} from '../firestoreEventModel';

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => 'mocked-firestore'),
  collection: jest.fn(() => 'mocked-collection-ref'),
  doc: jest.fn(() => 'mocked-doc-ref'),
  query: jest.fn(() => 'mocked-query-ref'),
  where: jest.fn(),
  orderBy: jest.fn(() => 'mocked-order-by'),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  addDoc: jest.fn(() => Promise.resolve({ id: 'abc123' })),
  updateDoc: jest.fn(),
  serverTimestamp: jest.fn(() => 'mocked-timestamp'),
  onSnapshot: jest.fn(),
  collectionGroup: jest.fn(),
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

// UPDATE TRAVEL EVENT - Success
test('updateTravelEvent updates event with new data', async () => {
  const updateData = {
    title: 'Updated Title',
    destination: 'New Destination',
    requirePayment: false,
  };

  await updateTravelEvent('event456', updateData);

  expect(doc).toHaveBeenCalledWith(expect.anything(), 'travelEvents', 'event456');
  expect(updateDoc).toHaveBeenCalledWith('mocked-doc-ref', {
    ...updateData,
    updatedAt: 'mocked-timestamp',
  });
});

// UPDATE TRAVEL EVENT - Fail
test('updateTravelEvent throws if updateDoc fails', async () => {
  const errorMessage = 'Update failed';
  (updateDoc as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

  await expect(updateTravelEvent('event789', { title: 'Broken' })).rejects.toThrow('Update failed');
});

// GET TRAVEL EVENT - Success
test('getTravelEvents fetches and returns ordered documents with pickupDate', async () => {
  // Mock the travel event docs
  const mockDocs = [
    {
      id: '1',
      data: () => ({
        title: 'Match A',
        pickupDate: '2025-07-01',
        pickupTime: '09:00',
        destination: 'Leeds',
        pickupLocation: 'Mansfield',
        price: '20',
        seatsAvailable: 30,
        requirePayment: true,
        organizerName: 'Billy',
        organizerUid: 'user123',
        createdAt: 'mocked-timestamp',
      }),
    },
    {
      id: '2',
      data: () => ({
        title: 'Match B',
        pickupDate: '2025-07-10',
        pickupTime: '10:00',
        destination: 'York',
        pickupLocation: 'Chesterfield',
        price: '25',
        seatsAvailable: 40,
        requirePayment: false,
        organizerName: 'Amy',
        organizerUid: 'user456',
        createdAt: 'mocked-timestamp',
      }),
    },
  ];

  // First getDocs for travelEvents
  (getDocs as jest.Mock).mockResolvedValueOnce({ docs: mockDocs });

  // Then mock getDocs for bookings for each event (once per event)
  const mockBookingDocs = (seats: number[]) => ({
    forEach: (cb: any) => seats.forEach(s => cb({ data: () => ({ seatsBooked: s }) })),
    docs: seats.map(s => ({ data: () => ({ seatsBooked: s }) })),
  });

  (getDocs as jest.Mock).mockResolvedValueOnce(mockBookingDocs([2, 1])); // for event 1
  (getDocs as jest.Mock).mockResolvedValueOnce(mockBookingDocs([3]));    // for event 2

  const events = await getTravelEvents();

  expect(events).toEqual([
    expect.objectContaining({ id: '1', title: 'Match A', seatsBooked: 3 }),
    expect.objectContaining({ id: '2', title: 'Match B', seatsBooked: 3 }),
  ]);
});

// GET TRAVEL EVENT - Fail
test('getTravelEvents throws an error if getDocs fails', async () => {
  const errorMessage = 'Firestore getDocs failed';
  (getDocs as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

  await expect(getTravelEvents()).rejects.toThrow(errorMessage);
});

// TRAVEL EVENT BOOKING - Success
test('createTravelEventBooking successfully adds a booking', async () => {
  const booking = {
    seatsBooked: 2,
    payed: true,
    bookerName: 'Alice',
    bookerUid: 'user789',
  };

  // Mock event document
  (getDoc as jest.Mock).mockResolvedValueOnce({
    exists: () => true,
    data: () => ({
      seatsAvailable: 10,
    }),
  });

  // Mock current bookings total (3 already booked)
  const mockBookingDocs = {
    forEach: (cb: any) => cb({ data: () => ({ seatsBooked: 3 }) }),
    docs: [{ data: () => ({ seatsBooked: 3 }) }],
  };
  (getDocs as jest.Mock).mockResolvedValueOnce(mockBookingDocs);

  await createTravelEventBooking('event123', booking);

  expect(collection).toHaveBeenCalledWith('mocked-doc-ref', 'bookings');
  expect(addDoc).toHaveBeenCalledWith('mocked-collection-ref', {
    ...booking,
    createdAt: 'mocked-timestamp',
  });

  // No static update to event doc anymore
  expect(updateDoc).not.toHaveBeenCalled();
});

// TRAVEL EVENT BOOKING - Fail (overbooking)
test('createTravelEventBooking throws an error when booking exceeds available seats', async () => {
  const booking = {
    seatsBooked: 4,
    payed: false,
    bookerName: 'Bob',
    bookerUid: 'user111',
  };

  // Mock event document
  (getDoc as jest.Mock).mockResolvedValueOnce({
    exists: () => true,
    data: () => ({
      seatsAvailable: 5,
    }),
  });

  // Mock bookings with 3 already booked
  const mockBookingDocs = {
    forEach: (cb: any) => cb({ data: () => ({ seatsBooked: 3 }) }),
    docs: [{ data: () => ({ seatsBooked: 3 }) }],
  };
  (getDocs as jest.Mock).mockResolvedValueOnce(mockBookingDocs);

  await expect(createTravelEventBooking('event123', booking)).rejects.toThrow(
    'Only 2 seat(s) remaining.'
  );

  expect(updateDoc).not.toHaveBeenCalled();
  expect(addDoc).not.toHaveBeenCalled();
});

// UPDATE TRAVEL EVENT BOOKING - Success
test('updateTravelEventBooking updates the payed status successfully', async () => {
  (getDoc as jest.Mock).mockResolvedValueOnce({
    exists: () => true,
    data: () => ({ payed: false }),
  });

  await updateTravelEventBooking('event123', 'booking456', true);

  expect(doc).toHaveBeenCalledWith(expect.anything(), 'travelEvents', 'event123', 'bookings', 'booking456');
  expect(updateDoc).toHaveBeenCalledWith('mocked-doc-ref', { payed: true });
});

// UPDATE TRAVEL EVENT BOOKING - Fail
test('updateTravelEventBooking throws an error if booking does not exist', async () => {
  (getDoc as jest.Mock).mockResolvedValueOnce({
    exists: () => false,
  });

  await expect(updateTravelEventBooking('event123', 'booking456', true)).rejects.toThrow('Booking not found');

  expect(updateDoc).not.toHaveBeenCalled();
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

// SUBSCRIBE TO EVENTS - Success
test('subscribeToTravelEvents calls callback with parsed event list', () => {
  const mockCallback = jest.fn();
  const mockSetLoading = jest.fn();

  const mockSnapshot = {
    docs: [
      {
        id: '1',
        data: () => ({
          title: 'Match A',
          destination: 'York',
          pickupLocation: 'Mansfield',
          pickupDate: '2025-07-01',
          pickupTime: '09:00',
          price: '25',
          seatsAvailable: 30,
          requirePayment: true,
          organizerName: 'Billy',
          organizerUid: 'user123',
          createdAt: 'mocked-timestamp',
        }),
      },
    ],
  };

  (onSnapshot as jest.Mock).mockImplementationOnce((q, handler) => {
    handler(mockSnapshot);
    return () => {};
  });

  const unsubscribe = subscribeToTravelEvents(mockCallback, mockSetLoading);

  expect(mockSetLoading).toHaveBeenCalledWith(true);
  expect(mockSetLoading).toHaveBeenCalledWith(false);
  expect(mockCallback).toHaveBeenCalledWith([
    expect.objectContaining({ id: '1', title: 'Match A', price: 25 }),
  ]);
  expect(typeof unsubscribe).toBe('function');
});

// SUBSCRIBE TO EVENTS - Edge: Empty snapshot
test('subscribeToTravelEvents calls callback with empty array if no docs', () => {
  const mockCallback = jest.fn();
  const mockSetLoading = jest.fn();

  const mockSnapshot = { docs: [] };

  (onSnapshot as jest.Mock).mockImplementationOnce((q, handler) => {
    handler(mockSnapshot);
    return () => {};
  });

  subscribeToTravelEvents(mockCallback, mockSetLoading);

  expect(mockCallback).toHaveBeenCalledWith([]);
  expect(mockSetLoading).toHaveBeenCalledWith(true);
  expect(mockSetLoading).toHaveBeenCalledWith(false);
});

// SUBSCRIBE TO EVENT BY ID - Success
test('subscribeToTravelEventById calls callback with parsed event data', () => {
  const mockCallback = jest.fn();

  const mockSnapshot = {
    exists: () => true,
    id: 'abc123',
    data: () => ({
      title: 'Match C',
      destination: 'Sheffield',
      pickupLocation: 'Derby',
      pickupDate: '2025-08-01',
      pickupTime: '10:00',
      price: '30',
      seatsAvailable: 50,
      requirePayment: false,
      organizerName: 'Amy',
      organizerUid: 'user456',
      createdAt: 'mocked-timestamp',
    }),
  };

  (onSnapshot as jest.Mock).mockImplementationOnce((docRef, handler) => {
    handler(mockSnapshot);
    return () => {};
  });

  const unsubscribe = subscribeToTravelEventById('abc123', mockCallback);

  expect(mockCallback).toHaveBeenCalledWith(
    expect.objectContaining({
      id: 'abc123',
      title: 'Match C',
      price: 30,
    })
  );
  expect(typeof unsubscribe).toBe('function');
});

// SUBSCRIBE TO EVENT BY ID - Fail (not found)
test('subscribeToTravelEventById calls callback with null if snapshot does not exist', () => {
  const mockCallback = jest.fn();

  const mockSnapshot = {
    exists: () => false,
  };

  (onSnapshot as jest.Mock).mockImplementationOnce((docRef, handler) => {
    handler(mockSnapshot);
    return () => {};
  });

  subscribeToTravelEventById('missing-id', mockCallback);

  expect(mockCallback).toHaveBeenCalledWith(null);
});

// GET USER'S TRAVEL EVENT BOOKINGS - Success
test('getUserTravelEventBookings returns bookings with event data', async () => {
  const mockBookingDoc = {
    id: 'booking123',
    data: () => ({
      seatsBooked: 2,
      payed: true,
      bookerUid: 'user123',
      bookerName: 'Alice',
    }),
    ref: {
      parent: {
        parent: 'mocked-event-ref',
      },
    },
  };

  const mockEventSnap = {
    exists: () => true,
    id: 'event456',
    data: () => ({
      title: 'Match A',
      destination: 'London',
      pickupLocation: 'Field Mill',
      pickupDate: '2025-12-12',
      pickupTime: '09:00',
      price: 30,
      seatsAvailable: 50,
      requirePayment: true,
      organizerName: 'Billy',
      organizerUid: 'user999',
    }),
  };

  (getDocs as jest.Mock).mockResolvedValueOnce({ docs: [mockBookingDoc] });
  (getDoc as jest.Mock).mockResolvedValueOnce(mockEventSnap);
  (mockBookingDoc.ref.parent.parent as any) = { id: 'event456' }; // simulate parent doc

  const bookings = await getUserTravelEventBookings('user123');

  expect(bookings).toEqual([
    {
      bookingId: 'booking123',
      eventId: 'event456',
      booking: {
        id: 'booking123',
        seatsBooked: 2,
        payed: true,
        bookerUid: 'user123',
        bookerName: 'Alice',
      },
      event: {
        id: 'event456',
        title: 'Match A',
        destination: 'London',
        pickupLocation: 'Field Mill',
        pickupDate: '2025-12-12',
        pickupTime: '09:00',
        price: 30,
        seatsAvailable: 50,
        requirePayment: true,
        organizerName: 'Billy',
        organizerUid: 'user999',
      },
    },
  ]);

  expect(getDocs).toHaveBeenCalled();
  expect(getDoc).toHaveBeenCalled();
});

// GET USER'S TRAVEL EVENT BOOKINGS - Fail
test('getUserTravelEventBookings skips booking if eventRef is missing', async () => {
  const mockBookingDoc = {
    id: 'booking123',
    data: () => ({
      seatsBooked: 2,
      payed: true,
      bookerUid: 'user123',
    }),
    ref: {
      parent: {
        parent: null, // simulate missing event reference
      },
    },
  };

  (getDocs as jest.Mock).mockResolvedValueOnce({ docs: [mockBookingDoc] });

  const bookings = await getUserTravelEventBookings('user123');

  expect(bookings).toEqual([]);
  expect(getDoc).not.toHaveBeenCalled();
});

// SUBSCRIBE TO USERS BOOKINGS - Success
test('subscribeToUserTravelEventBookings calls callback with user bookings and event data', async () => {
  const mockCallback = jest.fn();

  const mockBookingDoc = {
    id: 'booking123',
    data: () => ({
      seatsBooked: 2,
      payed: false,
      bookerUid: 'user123',
      bookerName: 'Test User',
    }),
    ref: {
      parent: {
        parent: {
          id: 'event456',
        },
      },
    },
  };

  const mockEventSnap = {
    exists: () => true,
    id: 'event456',
    data: () => ({
      title: 'Mock Event',
      destination: 'Mock City',
      pickupLocation: 'Mock Location',
      pickupDate: '2025-12-12',
      pickupTime: '08:30',
      price: 50,
      seatsAvailable: 40,
      requirePayment: true,
      organizerName: 'Billy',
      organizerUid: 'userOrg',
    }),
  };

  // Setup mocks
  (onSnapshot as jest.Mock).mockImplementationOnce((query, handler) => {
    handler({ docs: [mockBookingDoc] });
    return () => {}; // unsubscribe fn
  });

  (getDoc as jest.Mock).mockResolvedValueOnce(mockEventSnap);
  (getDocs as jest.Mock).mockResolvedValueOnce({
    forEach: (cb: any) => cb({ data: () => ({ seatsBooked: 2 }) }),
    docs: [{ data: () => ({ seatsBooked: 2 }) }],
  });

  const unsubscribe = subscribeToUserTravelEventBookings('user123', mockCallback);

  // Allow async to resolve
  await new Promise(process.nextTick);

  expect(mockCallback).toHaveBeenCalledWith([
    {
      bookingId: 'booking123',
      eventId: 'event456',
      booking: {
        id: 'booking123',
        seatsBooked: 2,
        payed: false,
        bookerUid: 'user123',
        bookerName: 'Test User',
      },
      event: {
        id: 'event456',
        title: 'Mock Event',
        destination: 'Mock City',
        pickupLocation: 'Mock Location',
        pickupDate: '2025-12-12',
        pickupTime: '08:30',
        price: 50,
        seatsAvailable: 40,
        requirePayment: true,
        organizerName: 'Billy',
        organizerUid: 'userOrg',
        seatsBooked: 2,
      },
    },
  ]);

  expect(typeof unsubscribe).toBe('function');
});

// SUBSCRIBE TO USERS BOOKINGS - Fail
test('subscribeToUserTravelEventBookings skips booking if eventRef is missing', async () => {
  const mockCallback = jest.fn();

  const mockBookingDoc = {
    id: 'booking123',
    data: () => ({
      seatsBooked: 1,
      payed: true,
      bookerUid: 'user123',
    }),
    ref: {
      parent: {
        parent: null, // no parent event ref
      },
    },
  };

  (onSnapshot as jest.Mock).mockImplementationOnce((query, handler) => {
    handler({ docs: [mockBookingDoc] });
    return () => {};
  });

  const unsubscribe = subscribeToUserTravelEventBookings('user123', mockCallback);

  await new Promise(process.nextTick);

  expect(mockCallback).toHaveBeenCalledWith([]); // no valid bookings
  expect(typeof unsubscribe).toBe('function');
});