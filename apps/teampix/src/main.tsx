import { render } from "preact";
import { App } from "./App";
import "./style.css";

const mount = document.getElementById("app");
if (!mount) throw new Error("Missing #app element");
render(<App />, mount);
