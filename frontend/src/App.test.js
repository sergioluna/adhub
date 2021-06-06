/* App.test.js */

import { render, screen } from '@testing-library/react';
import App from './App';

// test example
test('renders post ad link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Post An Ad/i);
  expect(linkElement).toBeInTheDocument();
});
