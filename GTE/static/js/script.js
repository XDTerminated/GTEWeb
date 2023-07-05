// Imports
import { Chess } from 'chess.js';

// HTML elements
var moveContainer = document.getElementById("move");
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
    let buttonDict;
    var value = PGN.value;

    try {
        chess.loadPgn(value);
        PGN.value = "";
        moveContainer.innerHTML = "";
        buttonDict = setMoves(chess.history());
    } catch (e) {
        console.error(e);
    }

    getPosition(buttonDict);
}

export function getPosition(buttonDict) {
    let buttons = document.querySelectorAll('button');
    buttons.forEach(function(button) {
        button.addEventListener('click', function() {
          // Get the clicked button
            var clickedButton = event.target;
          // Get the FEN string from the Map using the clicked button as the key
            var fenString = buttonDict.get(clickedButton);
          // Use the retrieved FEN string as desired
            console.log("FEN string:", fenString);
        });
    });

    return fen;
}

function setMoves(history) {
    // let buttonDict = {};
    let buttonDict = new Map();
    let chessTemp = new Chess();
    let last;
    if (history.length%2 != 0) {
        last = history.pop();
    }

    let count = 0;

    for (let i = 0; i < history.length; i+=2) {
        
        if (i%2 == 0) {
            count++;
        }
        let whiteMove = history[i];
        let blackMove = history[i + 1];

        chessTemp.move(whiteMove);
        let whiteFen = chessTemp.fen();
        chessTemp.move(blackMove);
        let blackFen = chessTemp.fen();

        const moveDiv  = document.createElement("div");
        moveDiv.classList.add("move");

        const moveWhite = document.createElement("button");
        moveWhite.classList.add("white-move");
        moveWhite.classList.add("move-button");

        moveWhite.id = count + "w";
        moveWhite.innerHTML = "&nbsp;" + count + ".&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + whiteMove;

        const moveBlack = document.createElement("button");
        moveBlack.classList.add("black-move");
        moveBlack.classList.add("move-button");

        moveBlack.id = count + "b";
        moveBlack.innerHTML = blackMove;

        moveDiv.appendChild(moveWhite);
        moveDiv.appendChild(moveBlack);

        moveContainer.appendChild(moveDiv);

        buttonDict.set(moveWhite, whiteFen);
        buttonDict.set(moveBlack, blackFen);

    }

    if (last != null) {
        count+=1;

        chessTemp.move(last);
        let whiteFen = chessTemp.fen();

        const moveDiv = document.createElement("div");
        moveDiv.classList.add("move");

        const moveWhite = document.createElement("button");
        moveWhite.classList.add("white-move");
        moveWhite.classList.add("move-button");
        moveWhite.innerHTML = "&nbsp;" + count + ".&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + last;


        moveDiv.appendChild(moveWhite);

        moveContainer.appendChild(moveDiv);
        buttonDict.set(moveWhite, whiteFen);

    }

    console.log(buttonDict.size);

    return buttonDict;

}

function setPosition(position) {
    
}



