import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { getRecentNews } from '../firestoreNewsModel';

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(() => 'mocked-collection-ref'),
  query: jest.fn(() => 'mocked-query-ref'),
  orderBy: jest.fn(() => 'mocked-order-by'),
  limit: jest.fn(() => 'mocked-limit'),
  getDocs: jest.fn(),
}));

// GET NEWS - Success
test('getRecentNews returns the latest 5 news articles ordered by date', async () => {
  const mockDocs = [
    { id: '1', data: () => ({ title: 'News A', date: '2025-07-01' }) },
    { id: '2', data: () => ({ title: 'News B', date: '2025-06-28' }) },
    { id: '3', data: () => ({ title: 'News C', date: '2025-06-25' }) },
    { id: '4', data: () => ({ title: 'News D', date: '2025-06-20' }) },
    { id: '5', data: () => ({ title: 'News E', date: '2025-06-18' }) },
    { id: '6', data: () => ({ title: 'News F', date: '2025-06-10' }) }, // should be excluded
  ];

  // Only return the first 5, since Firestore would enforce the limit
  (getDocs as jest.Mock).mockResolvedValueOnce({ docs: mockDocs.slice(0, 5) });

  const news = await getRecentNews();

  expect(collection).toHaveBeenCalledWith(expect.anything(), 'news');
  expect(orderBy).toHaveBeenCalledWith('date', 'desc');
  expect(limit).toHaveBeenCalledWith(5);
  expect(query).toHaveBeenCalledWith('mocked-collection-ref', 'mocked-order-by', 'mocked-limit');
  expect(getDocs).toHaveBeenCalledWith('mocked-query-ref');

  expect(news).toEqual([
    { id: '1', title: 'News A', date: '2025-07-01' },
    { id: '2', title: 'News B', date: '2025-06-28' },
    { id: '3', title: 'News C', date: '2025-06-25' },
    { id: '4', title: 'News D', date: '2025-06-20' },
    { id: '5', title: 'News E', date: '2025-06-18' },
  ]);
});

// GET NEWS - Fail
test('getRecentNews throws an error if getDocs fails', async () => {
  const errorMessage = 'Firestore getDocs failed';
  (getDocs as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

  await expect(getRecentNews()).rejects.toThrow(errorMessage);
});
