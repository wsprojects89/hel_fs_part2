import React from "react";
import ReactDOM from "react-dom";
import Countries from "./components/Countries";

const App = () => {
  return (
    <div>
      <Countries />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
