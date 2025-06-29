import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import { createTravelEvent, getTravelEvents } from '../firestoreEventModel';

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(() => 'mocked-collection-ref'),
  query: jest.fn(() => 'mocked-query-ref'),
  orderBy: jest.fn(() => 'mocked-order-by'),
  getDocs: jest.fn(),
  addDoc: jest.fn(() => Promise.resolve({ id: 'abc123' })),
  serverTimestamp: jest.fn(() => 'mocked-timestamp'),
}));

// CREATE TRAVEL EVENT - Success
test('createTravelEvent adds a new document with the correct data', async () => {
  const mockData = {
    title: 'Travel to Football Match',
    destination: 'Stockport',
    pickupLocation: 'Mansfield',
    pickupDate: '01/01/2025',
    pickupTime: '08:00',
    price: '20',
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
    price: '1',
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
