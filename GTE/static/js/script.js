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

console.log(squares[0]);

// Variables
var chess = new Chess();

// Functions
export function getPGN() {
    let buttonDict;
    var value = PGN.value;
    setPosition("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");

    try {
        chess.loadPgn(value);
        PGN.value = "";
        moveContainer.innerHTML = "";
        buttonDict = setMoves(chess.history());
    } catch (e) {
        console.error(e);
        return;
    }

    document.getElementById('guess-div').innerText = "Processing (This could take up to 2 minutes because stockfish is slow :))...";


    getPosition(buttonDict);
    fetch("prediction/", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-CSRFToken": getCookie("csrftoken") // Include CSRF token for Django
        },
        body: "data=" + encodeURIComponent(value)
    })
    .then(response => response.json())
        .then(data => {
            // Handle the processed data and update the HTML
            document.getElementById('guess-div').innerText = "Guess: " + data.result;
        });


}

export function getPosition(buttonDict) {
    let buttons = document.querySelectorAll('.white-move,.black-move');

    let fenString;
    buttons.forEach(function(button) {
        button.addEventListener('click', function() {
          // Get the clicked button
            var clickedButton = event.target;
          // Get the FEN string from the Map using the clicked button as the key
            fenString = buttonDict.get(clickedButton);
          // Use the retrieved FEN string as desired
            console.log("FEN string:", fenString);
            setPosition(fenString);
        });
    });

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

        const moveDiv = document.createElement("div");
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


    for (let i = 0; i < squares.length; i++) {
        for (let j = 0; j < squares[i].length; j++) {
            squares[i][j].innerHTML = "";

        }
    }

    console.log(squares[0][0]);

    let rank = 7;
    let file = 0;
    for (let i = 0; i < position.length; i++) {
        if (position[i] == " ") {
            break;
        }
        if (position[i] == "/") {
            file = 0;
            rank--;
        } else if (position[i] === "r") {
            let a = document.createElement("img"); a.src = "/static/chess_pieces/b_rook.png"; a.draggable = false; a.width = 60; a.height = 60;
            squares[rank][file].appendChild(a);
            file++;
        } else if (position[i] === "n") {
            let a = document.createElement("img"); a.src = "/static/chess_pieces/b_knight.png"; a.draggable = false; a.width = 60; a.height = 60;
            squares[rank][file].appendChild(a);
            file++;
        } else if (position[i] === "b") {
            let a = document.createElement("img"); a.src = "/static/chess_pieces/b_bishop.png"; a.draggable = false; a.width = 60; a.height = 60;
            squares[rank][file].appendChild(a);
            file++;
        } else if (position[i] === "q") {
            let a = document.createElement("img"); a.src = "/static/chess_pieces/b_queen.png"; a.draggable = false; a.width = 60; a.height = 60;
            squares[rank][file].appendChild(a);
            file++;
        } else if (position[i] === "k") {
            let a = document.createElement("img"); a.src = "/static/chess_pieces/b_king.png"; a.draggable = false; a.width = 60; a.height = 60;
            squares[rank][file].appendChild(a);
            file++;
        } else if (position[i] === "p") {
            let a = document.createElement("img"); a.src = "/static/chess_pieces/b_pawn.png"; a.draggable = false; a.width = 60; a.height = 60;
            squares[rank][file].appendChild(a);
            file++;
        } else if (position[i] === "R") {
            let a = document.createElement("img"); a.src = "/static/chess_pieces/w_rook.png"; a.draggable = false; a.width = 60; a.height = 60;
            squares[rank][file].appendChild(a);
            file++;
        } else if (position[i] === "N") {
            let a = document.createElement("img"); a.src = "/static/chess_pieces/w_knight.png"; a.draggable = false; a.width = 60; a.height = 60;
            squares[rank][file].appendChild(a);
            file++;
        } else if (position[i] === "B") {
            let a = document.createElement("img"); a.src = "/static/chess_pieces/w_bishop.png"; a.draggable = false; a.width = 60; a.height = 60;
            squares[rank][file].appendChild(a);
            file++;
        } else if (position[i] === "Q") {
            let a = document.createElement("img"); a.src = "/static/chess_pieces/w_queen.png"; a.draggable = false; a.width = 60; a.height = 60;
            squares[rank][file].appendChild(a);
            file++;
        } else if (position[i] === "K") {
            let a = document.createElement("img"); a.src = "/static/chess_pieces/w_king.png"; a.draggable = false; a.width = 60; a.height = 60;
            squares[rank][file].appendChild(a);
            file++;
        } else if (position[i] === "P") {
            let a = document.createElement("img"); a.src = "/static/chess_pieces/w_pawn.png"; a.draggable = false; a.width = 60; a.height = 60;
            squares[rank][file].appendChild(a);
            file++;
        } else if (!isNaN(position[i])) {
            file+=parseInt(position[i]);
        }
    }
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === name + "=") {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}