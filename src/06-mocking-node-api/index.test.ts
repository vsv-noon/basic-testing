import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import fs from 'node:fs';
import path from 'node:path';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    jest.spyOn(global, 'setTimeout');
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);

    expect(setTimeout).toHaveBeenLastCalledWith(callback, timeout);
    jest.resetAllMocks();
  });

  test('should call callback only after timeout', () => {
    jest.spyOn(global, 'setTimeout');
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(timeout);

    expect(setTimeout).toHaveBeenLastCalledWith(callback, timeout);
    jest.resetAllMocks();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    jest.spyOn(global, 'setInterval');
    const callback = jest.fn();
    const interval = 1000;

    doStuffByInterval(callback, interval);

    expect(setInterval).toHaveBeenCalledWith(callback, interval);
  });

  test('should call callback multiple times after multiple intervals', () => {
    jest.spyOn(global, 'setInterval');
    const callback = jest.fn();
    const interval = 1000;

    doStuffByInterval(callback, interval);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(interval);

    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(interval * 2);

    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const pathToFile = 'text.txt';
    jest.spyOn(fs, 'existsSync').mockImplementation(() => false);
    jest.spyOn(path, 'join');

    await readFileAsynchronously(pathToFile);

    expect(path.join).toHaveBeenLastCalledWith(__dirname, pathToFile);
  });

  test('should return null if file does not exist', async () => {
    const pathToFile = 'text.txt';
    jest.spyOn(fs, 'existsSync').mockImplementation(() => false);
    jest
      .spyOn(fs.promises, 'readFile')
      .mockImplementation(async () => Buffer.from('Hello, world!', 'utf-8'));
    const expected = await readFileAsynchronously(pathToFile);

    expect(expected).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const pathToFile = 'text.txt';
    jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
    jest
      .spyOn(fs.promises, 'readFile')
      .mockImplementation(async () => Buffer.from('Hello, world!', 'utf-8'));
    const expected = await readFileAsynchronously(pathToFile);

    expect(expected).toBe('Hello, world!');
  });
});
