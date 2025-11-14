import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';

const initialBalance = 50;
const extra = 10;
const accountOne = getBankAccount(initialBalance);
const accountTwo = getBankAccount(initialBalance);

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    expect(accountOne.getBalance()).toEqual(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => accountOne.withdraw(initialBalance + extra)).toThrow(
      new InsufficientFundsError(initialBalance),
    );
  });

  test('should throw error when transferring more than balance', () => {
    expect(() =>
      accountOne.transfer(initialBalance + extra, accountTwo),
    ).toThrow(new InsufficientFundsError(initialBalance));
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => accountOne.transfer(extra, accountOne)).toThrow(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    expect(accountOne.deposit(extra).getBalance()).toEqual(
      initialBalance + extra,
    );
  });

  test('should withdraw money', () => {
    expect(accountOne.withdraw(extra).getBalance()).toEqual(initialBalance);
  });

  test('should transfer money', () => {
    expect(accountOne.transfer(extra, accountTwo).getBalance()).toEqual(
      initialBalance - extra,
    );
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    jest.spyOn(accountOne, 'fetchBalance').mockResolvedValue(extra);

    await expect(accountOne.synchronizeBalance()).resolves.not.toThrow(
      SynchronizationFailedError,
    );
    jest.restoreAllMocks();
  });

  test('should set new balance if fetchBalance returned number', async () => {
    jest.spyOn(accountOne, 'fetchBalance').mockResolvedValue(extra);

    await accountOne.synchronizeBalance();
    expect(accountOne.getBalance()).toEqual(extra);
    jest.restoreAllMocks();
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(accountOne, 'fetchBalance').mockResolvedValue(null);

    await expect(accountOne.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
    jest.restoreAllMocks();
  });
});
