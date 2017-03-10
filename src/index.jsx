import React from "react";
import {render} from "react-dom";
import AwesomeComponent from "./awesomecomponent.jsx";
import SizeMe from "./api/sizeme-api.js";

class App extends React.Component {
    render() {
        return (
            <div>
                <p> Hello React! Toppen!</p>
                <AwesomeComponent />
            </div>
        );
    }
}

render(<App/>, document.getElementById("app"));