import { Fragment, StrictMode } from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import DataCompute from "./canvas/main";
import "../index.css";
import "../App.css";

const App = ()=>{

    return (
        <Fragment>
            <Provider store={store}>
              <StrictMode>
                <DataCompute />
              </StrictMode>
            </Provider>
        </Fragment>
    )
}

export default App;