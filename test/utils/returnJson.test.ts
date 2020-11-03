import { Response } from 'express';
import returnJson from '../../src/utils/returnJson';

/**
 * This method call returnJson with a mockedResponse and return the mockedResponse
 * @param json a json object that contain datas to test
 */
function getReturnJsonMockedResponse(json: any): Response {
  const mockedResponse = {
    json: jest.fn(),
    status: (status) => mockedResponse,
  } as Response;

  returnJson(mockedResponse, json.data, json.error);
  return mockedResponse;
}

describe('Test the returnJson function', () => {
  it('Should return the json with success = true, when error is null', () => {
    const json = {
      success: true,
      data: '',
      error: null,
    };

    const mockedResponse = getReturnJsonMockedResponse(json);
    expect(mockedResponse.json).toBeCalledTimes(1);
    expect(mockedResponse.json).toHaveBeenCalledWith(json);
  });

  it('Should return the json with success = false, when error is not null', () => {
    const json = {
      success: false,
      data: '',
      error: new Error(),
    };

    const mockedResponse = getReturnJsonMockedResponse(json);
    expect(mockedResponse.json).toBeCalledTimes(1);
    expect(mockedResponse.json).toHaveBeenCalledWith(json);
  });

  it('Should return the json with success = true, when there is no error and no data', () => {
    const json = {
      success: true,
      data: null,
      error: null,
    };

    const mockedResponse = getReturnJsonMockedResponse(json);
    expect(mockedResponse.json).toBeCalledTimes(1);
    expect(mockedResponse.json).toHaveBeenCalledWith(json);
  });
});
