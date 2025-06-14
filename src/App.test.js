import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import App from './App';
import configureStore from './store'; // <-- To Twój configureStore z reducerami

test('renders app', () => {
  const history = createMemoryHistory();
  const store = configureStore({}, history); // pusty stan początkowy i historia

  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  // Możesz dodać konkretny test, np.
  // expect(screen.getByText(/Coś tam/i)).toBeInTheDocument();
});
