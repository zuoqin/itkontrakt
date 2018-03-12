import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

// should be tested fetchdata method
// Should be tested component rendering for Table without crash
// Should be tested component rendering for Dialog without crash
// Should test results of updateitem