/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

test('renders correctly', async () => {
  jest.useFakeTimers();
  let renderer: any;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
    jest.runOnlyPendingTimers();
  });
  expect(renderer).toBeDefined();
  jest.useRealTimers();
});
