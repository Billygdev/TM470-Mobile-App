import { loginUser } from '../authModel';

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(() => ({
        currentUser: { uid: '123' },
    })),
    signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { uid: '123' } })),
}));

test('loginUser returns user on success', async () => {
    const result = await loginUser('test@email.com', 'password123');
    expect(result.user.uid).toBe('123');
});