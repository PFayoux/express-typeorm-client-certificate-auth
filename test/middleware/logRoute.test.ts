import { Response, Request, NextFunction } from 'express';
import logRoute from '../../src/middleware/logRoute';

describe('logRoute middleware', () => {
  test('logRoute', () => {
    //Arrange
    const request = {
      user: {
        username: 'anonymous',
      },
      body: {
        test: 'test',
      },
    } as Request;

    const response = {
      cookie: jest.fn(),
    } as Response;

    const next = jest.fn() as NextFunction;
    const methodRoute = 'post';
    const routeRoute = '/abonnes/count';
    const spy = jest.spyOn(global.console, 'info').mockImplementation();

    // Act
    const askTakeRouteInformation = logRoute(methodRoute, routeRoute);
    askTakeRouteInformation(request, response, next);

    // Assert
    expect(console.info).toHaveBeenCalled();
    expect(console.info).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toMatch(
      RegExp(`.* ${request.user.username} use methode "${methodRoute}" and take the route "${routeRoute}.`),
    );

    spy.mockRestore();
  });
});
