import React, { useEffect, useState } from "react";
import axios from "axios";

import "./App.css";
import { Switch, Route } from "react-router-dom";

import HomePage from "./pages/Home.page";
import RedirectPage from "./pages/Redirect.page";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" render={() => <HomePage />} />
        <Route exact path="/callback" render={() => <RedirectPage />} />
      </Switch>
    </div>
  );
}

export default App;
