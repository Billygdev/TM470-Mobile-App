import { addDoc, collection } from 'firebase/firestore';
import { createTravelEvent } from '../firestoreEventModel';

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(() => 'mocked-collection-ref'),
  addDoc: jest.fn(() => Promise.resolve({ id: 'abc123' })),
  serverTimestamp: jest.fn(() => 'mocked-timestamp'),
}));

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