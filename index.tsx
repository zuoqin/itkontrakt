import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from "mobx-react"

import { MainPage } from "./src/mainPage";

ReactDOM.render(
   <Provider>
     <MainPage />
   </Provider>
   ,
   document.getElementById("root")
);



