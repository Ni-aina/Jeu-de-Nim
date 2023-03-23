const origBoard = [];
const trees = document.getElementById('tress');
const winnerT = document.getElementById('winnerT');
const winnerB = document.getElementById('winnerB');
const treeNumber = Math.floor(Math.random()*5 + 15);
const buttons = document.querySelectorAll('.btn');
const remove = (id) => {
    if ((id===1 || id===2 || id===3) && (origBoard.length >= id)) {
        for (let i = 0; i < id; i++) {
            let rm = origBoard.length-1;
            const btn = document.getElementById(rm);
            trees.removeChild(btn);
            origBoard.pop();
        }
        return true;
    }
    return false;
}
const checkWin = ()=> {
    if (origBoard.length===0) {
        winnerT.style.display = "block";
        winnerB.style.display = "block";
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].removeEventListener('click', huTurn, false);
        }
        return true;
    }
    return false;
}
const getSucc = (newBoard) => {
    let removes = [];
    for (let i = 1; i < 4; i++) {
        if (i-1 < newBoard.length) {
            let remove = {};
            let succ = newBoard.slice();
            remove.index = i;
            for (let j = 0; j < i; j++) {
                succ.pop();
            }
            remove.succ = succ;
            removes.push(remove);
        }
    }
    return removes;
}
const minimax = (newBoard, player) => {
    if (newBoard.length===0) {
        if (player) return {eval: 10};
        else return {eval: -10}
    }
    let bestRemove = {};
    if (player) {
        let maxEval = -Infinity;
        bestRemove.eval = -Infinity;
        getSucc(newBoard).map(child => {
            maxEval = Math.max(maxEval, minimax(child.succ, false).eval);
            if (bestRemove.eval < maxEval) {
                bestRemove.index = child.index;
            }
            bestRemove.eval = maxEval;
        });
    }
    else {
        let minEval = Infinity;
        bestRemove.eval = Infinity;
        getSucc(newBoard).map(child => {
            minEval = Math.min(minEval, minimax(child.succ, true).eval);
            if (bestRemove.eval > minEval) {
                bestRemove.index = child.index;
            }
            bestRemove.eval = minEval;
        });
    }
    return bestRemove;
}
const aiTurn = () => {
    remove(minimax(origBoard, true).index);
    if (checkWin()) {
        winnerT.style.color = "blue";
        winnerT.innerText = "You win";
    }
}
const huTurn = (e)=> {
    let id;
    switch(e.target.id) {
        case "btn-one": id = 1;
            break;
        case "btn-two": id = 2;
            break;
        case "btn-tree": id = 3;
            break;
        default: return;
    }
    if (remove(id)) {
        if (checkWin()) {
            winnerT.style.color = "red";
            winnerT.innerText = "You lose";
        }
        else {
            setTimeout(aiTurn, 500);
        }
    }
}
const start = ()=> {
    winnerT.style.display = "none";
    winnerB.style.display = "none";
    winnerT.innerText = ""; 
    for (let i = 0; i < treeNumber; i++) {
        const btn = document.createElement('button');
        btn.id = i;
        origBoard.push(i);
        trees.appendChild(btn);
    }
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', huTurn, false);
    }
}
start();