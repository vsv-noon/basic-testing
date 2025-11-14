import axios from 'axios';
import { throttledGetDataFromApi } from './index';

const baseURL = 'https://jsonplaceholder.typicode.com';
const endPoint = '/posts/1';

const response = {
  id: 1,
  title: 'Hello!',
};

jest.mock('axios');

jest.mock('lodash', () => ({
  throttle: (func: unknown) => func,
}));

describe('throttledGetDataFromApi', () => {
  beforeEach(() => {
    axios.create = jest.fn(() => axios);
    (axios.get as jest.Mock).mockResolvedValue({ data: response });
  });

  afterEach(() => jest.clearAllMocks());

  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi(endPoint);

    expect(axios.create).toHaveBeenCalledWith({ baseURL });
  });

  test('should perform request to correct provided url', async () => {
    await throttledGetDataFromApi(endPoint);

    expect(axios.get).toHaveBeenCalledWith(endPoint);
  });

  test('should return response data', async () => {
    const expected = await throttledGetDataFromApi(endPoint);
    expect(expected).toEqual(response);
  });
});
