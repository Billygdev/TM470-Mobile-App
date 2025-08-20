import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { loginUser, registerUser } from '../../authModel';

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

// LOGIN USER - Success
test('loginUser returns user on success', async () => {
  const result = await loginUser('test@email.com', 'password123');

  expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
    expect.anything(),
    'test@email.com',
    'password123'
  );

  expect(result.user.uid).toBe('123');
});

// LOGIN USER - Fail
test('loginUser throws an error on failure', async () => {
  const errorMessage = 'Invalid login credentials';
  (signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

  await expect(loginUser('test@email.com', 'wrongpassword123')).rejects.toThrow(errorMessage);

  expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
    expect.anything(),
    'test@email.com',
    'wrongpassword123'
  );
});

// REGISTER USER - Success
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

// REGISTER USER - Fail
test('registerUser throws an error on failure', async () => {
  const errorMessage = 'Email already in use';
  (createUserWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

  await expect(registerUser('duplicate@email.com', 'password123', 'DuplicateUser')).rejects.toThrow(errorMessage);

  expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
    expect.anything(),
    'duplicate@email.com',
    'password123'
  );
});