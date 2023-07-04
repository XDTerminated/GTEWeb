// Imports
import { Chess } from 'chess.js';

// HTML elements
var movesContainer = document.querySelector(".moves");
var PGN = document.getElementById("pgn");
var squares = [];

for (let i = 1; i <= 8; i++) {
    let j = 97
    let temp = [];
    do {
        temp.push(document.getElementById(String.fromCharCode(j) + i));
        j++;
    } while (j <= 104);

    squares.push(temp);
}

// Variables
var chess = new Chess();

// Functions
export function getPGN() {
    var value = PGN.value;

    try {
        chess.loadPgn(value);
        PGN.value = "";
        console.log(divA8.innerHTML)
    } catch (e) {
        console.error(e);
    }
}

function setMoves() {

}





