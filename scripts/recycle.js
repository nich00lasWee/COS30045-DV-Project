// Method source: https://stackoverflow.com/questions/950087/how-do-i-include-a-javascript-file-in-another-javascript-file

import { stackedBarChart } from "./stackedBar.js";
import { graph } from "./recycle2.js";

function init() {
    stackedBarChart();
    graph();
}

window.onload = init;