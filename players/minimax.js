let evalBoard = [
    [3, 4, 5, 7, 5, 4, 3],
    [4, 6, 8, 10, 8, 6, 4],
    [5, 8, 11, 13, 11, 8, 5],
    [5, 8, 11, 13, 11, 8, 5],
    [4, 6, 8, 10, 8, 6, 4],
    [3, 4, 5, 7, 5, 4, 3],
]

function evaluate(board) {
    let sum = 0;
    const height = board.length;
    const width = board[0].length;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            switch (board[y][x]) {
                case null:
                    break
                case true:
                    sum += evalBoard[y][x]
                    break
                case false:
                    sum -= evalBoard[y][x]
            }
        }
    }

    return sum;
}

function minimax(
    depth,
    game,
    alpha = Number.NEGATIVE_INFINITY,
    beta = Number.POSITIVE_INFINITY
) {
    if (depth === 0) {
        return [evaluate(game.state.board), null]
    }

    const isMaximizingPlayer = game.state.turn

    var bestMove = null
    var possibleMoves = game.getPossibleMoves().sort(() => Math.random() - 0.5)

    var bestMoveValue = isMaximizingPlayer
        ? Number.NEGATIVE_INFINITY
        : Number.POSITIVE_INFINITY

    for (var i = 0; i < possibleMoves.length; i++) {
        var move = possibleMoves[i]

        game.playMove(move)
        let value
        if (game.getTerminated()) {
            value = {
                true: 1000 * depth,
                false: -1000 * depth,
                null: 0,
            }[game.getWinner()]
        } else {
            value = minimax(depth - 1, game, alpha, beta)[0]
        }
        // Recursively get the value from this move

        if (isMaximizingPlayer) {
            // Look for moves that maximize position
            if (value > bestMoveValue) {
                bestMoveValue = value
                bestMove = move
            }
            alpha = Math.max(alpha, value)
        } else {
            // Look for moves that minimize position
            if (value < bestMoveValue) {
                bestMoveValue = value
                bestMove = move
            }
            beta = Math.min(beta, value)
        }
        // Undo previous move
        game.undoMove()
        // Check for alpha beta pruning
        if (beta <= alpha) {
            break
        }
    }
    return [bestMoveValue, bestMove]
}

function minimaxAgent(game) {
    const startTime = Date.now()
    const minimaxResult = minimax(
        10,
        new MinimaxConnect4(game.getMinimaxStartState())
    )
    console.log(`best score: ${minimaxResult[0]}`)
    console.log(`ran for ${Date.now() - startTime} ms`)
    return minimaxResult[1]
}