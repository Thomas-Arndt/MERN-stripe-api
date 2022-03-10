import React, { useState } from 'react';
import {
  BrowserRouter,
  Switch,
  Route
} from 'react-router-dom';
import PaymentView from './views/PaymentView';
import Main from './views/Main';

function App() {

  const items = [
    { price: 7500 }
  ]

  return (
    <div className="App">
      <BrowserRouter>
        <Main>
          <Switch>
            <Route path='/payment-accepted'>
              <h1>Success</h1>
            </Route>
            <Route path='/'>
              <PaymentView items={items} />
            </Route>
          </Switch>
        </Main>
      </BrowserRouter>
    </div>
  );
}

export default App;
