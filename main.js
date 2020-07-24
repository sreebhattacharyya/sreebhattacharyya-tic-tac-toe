const Player = (name, symbol) =>
{
    //player object: for the two players in the game
    let wins = 0;
    return {name,symbol,wins};
}
const gameBoard = (() =>
    {
        /*module representing the details required for
         one game: the game board, the two players,
         the difficulty of the game, the current player,
         the mode of the game and the number of game moves
         */
        let boardArray = Array(9).fill("");
        let player1 = Player("Player 1", "X");
        let player2 = Player("Player 2", "O");
        let gameDiff = 5;
        let currPlayer;
        let gameMode = '';
        let gameMoves = 9;
        return {boardArray, player1, player2, currPlayer, gameDiff,gameMode, gameMoves};
    }) ();

const displayController = ((doc) =>
    {
        /*this module controls what is displayed in the webapp,
          and helps the user navigate through the whole webapp,
          and contains the functions which respond upon user input.
         */
        const subbtn = doc.getElementById('sub1'); //player 1 form submit button
        const subbtn2 = doc.getElementById('sub2'); // player 2 form submit button
        const render = function()
        {
            //function to handle clicks on the game board given by user
            const cells = doc.querySelectorAll(".cell");
                cells.forEach((cell) => {
                    cell.addEventListener("click", (e) => {
                        console.log(e);
                        const targetCell = e.target;
                        if (targetCell.innerHTML === "" && gameControls.gameFinish === 0)
                        {
                            //updates the UI according to the click of the user
                            targetCell.innerHTML = gameBoard.currPlayer.symbol;
                            gameBoard.boardArray[Number(targetCell.classList[1])] = gameBoard.currPlayer.symbol;
                            console.log(Number(targetCell.classList[1]));
                            gameBoard.gameMoves -= 1;
                            gameControls.checkWin();
                            if(gameBoard.gameMode == "HvH")
                            {
                                //in case of game against another human
                                gameControls.switchTurn();
                            }
                            if(gameBoard.gameMode == "AI")
                            {
                                //in case of game against AI
                                setTimeout(() => {gameControls.playAI();}, 0);
                            }

                        }

                    });
                });
        }
        const suggest = function()
        {
            //handles part of showing suggestions in case of multiplayer game
            const result = AI.findBest(gameBoard.boardArray,gameBoard.currPlayer,5);
            //AI function to find best move is called with maximum difficulty level setting to obtain the optimal move suggestion in every case
            const messageTarget = doc.getElementById("suggestion-message"); //element displaying the suggestion
            const but = doc.getElementById("suggest-button");//button to show suggestion
            if(messageTarget.innerHTML === "")
            {
                //case of displaying the suggestion
                messageTarget.innerHTML = "Count left->right and top->bottom <br> Cell no."+(result+1);
                but.innerHTML = "Hide Suggestion";
            }
            else
            {
                //case of hiding the suggestion
                messageTarget.innerHTML = "";
                but.innerHTML = "Show Suggestion";
            }

        }
        const startGame = function()
        {
            //function called on click of the 'Start' button
            if(gameBoard.gameMode === '')
            {
                //preventing proceeding to the game if mode is not selected
                window.alert("Please select a valid mode");
            }
            else {
                //disabling view of the selection page, enabling view of the game page
                const selectionPage = doc.querySelector("#selection_page");
                const gamePage = doc.querySelector("#gamepage");
                selectionPage.style.display = "none";
                gamePage.style.display = "block";
                doc.forms['player-form2'].reset();
                doc.forms['player-form1'].reset();
                doc.forms['player-form1'].classList.remove('disabled');
                doc.forms['player-form2'].classList.remove('disabled');
                subbtn.disabled = false;
                subbtn2.disabled = false;
                //both the player forms are disabled
                const hide = doc.getElementById("suggestion");
                gameBoard.currPlayer = gameBoard.player1; //player 1 is always set to the first player (i.e, Human, when against AI)
                if (gameBoard.gameMode == "AI")
                {
                    if (gameBoard.player1.symbol === "X")
                        gameBoard.player2 = Player("AI", "O");
                    else
                        gameBoard.player2 = Player("AI", "X");
                    hide.style.display = "none"; //suggestions disabled when playing against the AI
                }
                else
                {
                    hide.style.display = "block"; //suggestions enabled for multiplayer game
                }
            }
        }
        const modeSelect = function()
        {
            //handles the selection of game mode
            const radios = doc.getElementsByName('mode-select');
            console.log(radios);
            radios.forEach((radio) =>
            {
                radio.addEventListener('click', (e) =>
                {
                    const targetRadio = e.target;
                    gameBoard.gameMode = targetRadio.value;
                    if(gameBoard.gameMode == "AI")
                    {
                        //for AI game mode, player 2 form is disabled and difficulty section is enabled
                        doc.forms['player-form2'].classList.add('disabled');
                        subbtn2.disabled = true;
                        const diffSelection = doc.getElementById('select');
                        diffSelection.style.display = "block";
                    }
                    else
                    {
                        //player 2 forms are enabled for multiplayer game, difficulty section is removed
                        doc.forms['player-form2'].classList.remove('disabled');
                        subbtn2.disabled = false;
                        const diffSelection = doc.getElementById('select');
                        diffSelection.style.display = "none";
                    }
                });

            });
        }
        const diffSelect = function()
        {
            //selects the difficulty level of the game (when against AI)
            const radios = doc.getElementsByName('select');
            console.log(radios);
            radios.forEach((radio) => {
                radio.addEventListener('click', (e) =>{
                    const diffVal = e.target;
                    gameBoard.gameDiff = diffVal.value;
                    //value is passed on to the gameDiff variable
                });
            });
        }
        const goBack = function ()
        {
            //this sends back the user to the detail selection area
            const selectionPage = doc.querySelector("#selection_page");
            const gamePage = doc.querySelector("#gamepage");
            const cells = doc.querySelectorAll(".cell");
            cells.forEach((cell)=>
            {
                //resets all cell background to white
                (cell.style.background = "white");
            })
            //view of gamepage is disabled and selection page is enabled
            selectionPage.style.display = "block";
            gamePage.style.display = "none";
            const radios = doc.getElementsByName('mode-select');
            radios.forEach((radio) =>
            {
                //modes are unchecked
                radio.checked = false;
            });
            //game mode is set to '' so that it necessitates selection of mode again, before proceeding to another game
            gameBoard.gameMode = '';
            displayController.resetGame(); //called to reset the game settings
        }
        const resetGame = function()
        {
            //function to reset the game settings
            const cells = doc.querySelectorAll(".cell");
            cells.forEach((cell)=>
            {
                //makes all the cells' background to white (to remove previous win markings) and removes symbols
                (cell.innerHTML = "");
                (cell.style.background = "white");
            })
            //resets all the game settings like: flags, board array, game result, current player is again set to player 1, and no. of moves
            gameControls.gameFinish = 0;
            gameBoard.boardArray = Array(9).fill("");
            const result = doc.getElementById('result');
            result.innerHTML = "";
            gameBoard.gameMoves = 9;
            gameBoard.currPlayer = gameBoard.player1;
        }
        const subEntry = function()
        {
            //function to control the submission of forms of players' details
            subbtn.addEventListener('click', (e) =>
            {
                console.log(e);
                if(gameBoard.gameMode == '')
                {
                    //mode has to be selected before filling in the player details
                    window.alert("Please select a valid mode");
                }
                else {
                    //takes the name and symbol of Player 1 and disables the form after submission
                    let name = doc.forms['player-form1']['name'];
                    let symbol = doc.forms['player-form1']['symbol'];
                    gameBoard.player1 = Player(name.value, symbol.value);
                    e.target.disabled = true;
                    doc.forms['player-form1'].classList.add('disabled');
                }
            });
            subbtn2.addEventListener('click', (e) =>
            {
                console.log(e);
                if(gameBoard.gameMode == '')
                {
                    //selection of valid mode is necessary
                    window.alert("Please select a valid mode");
                }
                else
                {
                    //player 1 form needs to be submitted first
                    if(subbtn.disabled === true)
                    {
                        //takes name, symbol of player 2 and disables form after submission
                        let name = doc.forms['player-form2']['name'];
                        let symbol = doc.forms['player-form2']['symbol'];
                        if(symbol.value === gameBoard.player1.symbol)
                        {
                            //both players cannot have the same symbol
                            window.alert("Both players cannot have same symbols, choose again");
                            doc.forms['player-form2'].reset();
                            return;
                        }
                        gameBoard.player2 = Player(name.value, symbol.value);
                        e.target.disabled = true;
                        doc.forms['player-form2'].classList.add('disabled');
                    }
                    else
                    {
                        window.alert("Please fill Player 1 details first");
                        doc.forms['player-form2'].reset();
                    }
                }
            });
        }
        return {render, startGame, resetGame, subEntry, goBack, diffSelect, modeSelect, suggest};

    })(document);

const gameControls = ((doc) =>
    {
        //module to control the whole flow of the game
        let gameFinish = 0; //flag to signify whether game is over or not
        const checkWin = function()
        {
            //checks if a winning condition is found or not
            //following array stores all possible winning conditions
            const winCombos = [['0','1','2'],['3','4','5'],['6','7','8'],['0','3','6'],['1','4','7'],['2','5','8'],['0','4','8'],['2','4','6']];
            for( let i = 0; i < winCombos.length; i++)
            {
                if(gameBoard.boardArray[winCombos[i][0]] === gameBoard.currPlayer.symbol && gameBoard.boardArray[winCombos[i][1]] === gameBoard.currPlayer.symbol && gameBoard.boardArray[winCombos[i][2]] === gameBoard.currPlayer.symbol)
                {
                    //winning condition is found
                    //UI to be updated by marking the winning cells
                    const targetCell1 = doc.getElementById('cell'+winCombos[i][0]);
                    const targetCell2 = doc.getElementById('cell'+winCombos[i][1]);
                    const targetCell3 = doc.getElementById('cell'+winCombos[i][2]);
                    targetCell1.style.background = "lightcoral";
                    targetCell2.style.background = "lightcoral";
                    targetCell3.style.background = "lightcoral";
                    //updating the winning flag
                    gameControls.gameFinish = 1;
                    //updating the game result
                    const result = doc.getElementById('result');
                    result.innerHTML = gameBoard.currPlayer.name+' wins!';
                    return;
                }
            }
            if(gameBoard.gameMoves === 0)
            {
                //winning condition not found, but no moves are remaining: case of a draw
                const result = doc.getElementById('result');
                result.innerHTML = 'It is a draw!';
                gameControls.gameFinish = 1; //game end flag updated
            }
        }
        const switchTurn = function()
        {
            //switches the turn by changing current player of the game
            gameBoard.currPlayer = (gameBoard.currPlayer === gameBoard.player1) ? gameBoard.player2 : gameBoard.player1;
            console.log('switched');

        }
        const playAI = function()
        {
            //function to control the case of playing against the AI
            if(gameControls.gameFinish === 0)
            {
                gameBoard.gameMoves -= 1;
                gameBoard.currPlayer = gameBoard.player2; //AI is always the Player 2
                let cell = AI.findBest(gameBoard.boardArray, gameBoard.player2, gameBoard.gameDiff); //returns index of the best move cell
                //findBest always called with player2 as AI is always player 2
                let acCell = "#cell" + cell;
                const selectCell = doc.querySelector(acCell);
                console.log(acCell, selectCell);
                selectCell.innerHTML = gameBoard.currPlayer.symbol; //updating the cell with AI's symbol
                gameBoard.boardArray[Number(selectCell.classList[1])] = gameBoard.currPlayer.symbol; //updating the board array with symbol
                console.log(Number(selectCell.classList[1]));
                gameControls.checkWin(); //checking for a winning condition
            }
            gameBoard.currPlayer = gameBoard.player1; // changing turn of the player: Player 1 is always the human
        }
        return {checkWin,gameFinish, switchTurn, playAI};
    })(document);

const AI = (() =>
    {
        const findBest = function(board, player, difficulty)
        {
            //function to find the best possible move by invoking the minimax function
            let bestVal = -1000;
            let best_move = -1;
            let alternate_move;
            for(let i = 0; i<board.length; i++)
            {
                //looks for all empty positions on the board
                if(board[i] === "")
                {
                    //calling the minimax function with the player 1 as player 1 is always Human
                    board[i] = player.symbol;
                    let newVal = minimax(board, gameBoard.player1, 0, -1000, 1000, difficulty);
                    if(newVal > bestVal)
                    {
                        //if obtained value is greater than the already stored best value, then best value is updated
                        bestVal = newVal;
                        best_move = i; //cell index is stored to specify move
                    }
                    else
                    {
                        //in case a higher best value is not found, a random value is generated, till an empty location is found
                        let k = Math.floor(Math.random() * Math.floor(9));
                        while(board[k] !== "")
                        {
                            k = Math.floor(Math.random() * Math.floor(9));
                        }
                        alternate_move = k;
                    }
                    board[i] = "";
                }
            }
            if(best_move === -1)
            {
                return alternate_move;
            }
            else
                return best_move;

        }
        const minimax = function(board, player, depth, alpha,beta, diff)
        {
            //minimax function that implements the algorithm, player 1 is the minimizer, player 2 is maximizer

            //search depth is limited for Easy and Medium levels
            if(diff == 1 && depth>1)
                return -99;
            else if(diff == 2 && depth>2)
                return -99;

            //checking for winning conditions
            if(checkWin(board,gameBoard.player1))
                 return (-10+depth); //minimizer wins
            else if(checkWin(board,gameBoard.player2))
                 return (10-depth); //maximizer wins
            else if(isEnd(board) === true)
                 return 0; //case od draw : no winning condition found but no more board moves left

            //depth is added or subtracted accordingly to determine which move leads to a faster win

            let best_score;
             if(player === gameBoard.player1)
             {
                 //minimizer's case
                 best_score = 1000;
                 for(let i = 0; i<board.length; i++)
                 {
                     if (board[i] === "")
                     {
                         //when an empty spot is found
                         board[i] = player.symbol;
                         let obtain_score = minimax(board, gameBoard.player2, (depth+1), alpha, beta, diff);
                         if (obtain_score !== -99)
                         {
                             best_score = Math.min(best_score, obtain_score); //storing the minimum best score
                             //implementing alpha beta pruning
                             beta = Math.min(beta, best_score);
                             if (beta <= alpha)
                             {
                                 board[i] = "";
                                 break;
                             }
                         }
                         board[i] = "";


                     }
                 }
             }

             if(player === gameBoard.player2)
             {
                 //maximizer's case
                 best_score = -1000;
                 for(let i = 0; i<board.length; i++)
                 {
                     //looks for the empty spots in board
                     if(board[i] === "")
                     {
                         board[i] = player.symbol;
                         let obtain_score = minimax(board, gameBoard.player1, depth + 1, alpha, beta, diff);
                         if (obtain_score !== -99)
                         {
                            best_score = Math.max(best_score, obtain_score); //stores the maximum best score
                             //implementing the alpha beta pruning
                            alpha = Math.max(alpha, best_score);
                            if (beta <= alpha)
                            {
                                board[i] = "";
                                break;
                            }
                         }
                         board[i] = "";
                     }
                 }
             }

             return best_score;
        }
        const isEnd = function(board)
        {
            //checks if any empty spots are remaining in the game board
            for(let i = 0; i<board.length; i++)
            {
                if(board[i] === "")
                    return false;
            }
            return true;
        }
        const checkWin = function(board,player)
        {
            //returns true if any winning case is found
            return (board[0] === player.symbol && board[1] === player.symbol && board[2] === player.symbol) ||
                (board[3] === player.symbol && board[4] === player.symbol && board[5] === player.symbol) ||
                (board[6] === player.symbol && board[7] === player.symbol && board[8] === player.symbol) ||
                (board[0] === player.symbol && board[3] === player.symbol && board[6] === player.symbol) ||
                (board[1] === player.symbol && board[4] === player.symbol && board[7] === player.symbol) ||
                (board[2] === player.symbol && board[5] === player.symbol && board[8] === player.symbol) ||
                (board[0] === player.symbol && board[4] === player.symbol && board[8] === player.symbol) ||
                (board[2] === player.symbol && board[4] === player.symbol && board[6] === player.symbol);
        }
        return {findBest};

    })();

    displayController.render();
    displayController.subEntry();
    displayController.modeSelect();
    displayController.diffSelect();

