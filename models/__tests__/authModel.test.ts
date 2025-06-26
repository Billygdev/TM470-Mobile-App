import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { loginUser, registerUser } from '../authModel';

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: { uid: '123' },
  })),
  signInWithEmailAndPassword: jest.fn(() =>
    Promise.resolve({ user: { uid: '123' } })
  ),
  createUserWithEmailAndPassword: jest.fn(() =>
    Promise.resolve({
      user: {
        uid: '123',
        email: 'newuser@example.com',
        displayName: 'NewUser',
      },
    })
  ),
  updateProfile: jest.fn(() => Promise.resolve()),
}));

test('loginUser returns user on success', async () => {
  const result = await loginUser('test@email.com', 'password123');

  expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
    expect.anything(),
    'test@email.com',
    'password123'
  );

  expect(result.user.uid).toBe('123');
});

test('registerUser creates user with correct credentials and sets displayName', async () => {
  const email = 'newuser@example.com';
  const password = 'securePassword123';
  const username = 'NewUser';

  const result = await registerUser(email, password, username);

  expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
    expect.anything(),
    email,
    password
  );

  expect(updateProfile).toHaveBeenCalledWith(result.user, {
    displayName: username,
  });

  expect(result.user.uid).toBe('123');
  expect(result.user.email).toBe(email);
  expect(result.user.displayName).toBe(username);
});
