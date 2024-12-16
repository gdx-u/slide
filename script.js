let ts = 77;

let order = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let moves = 0;
let seconds = 0;

function update() {
    seconds++;
    document.title = `TPS: ${moves / seconds}`;
}

function square(x, y, num) {
    if (num == 0) return;
    let sq = document.createElement("div")
    sq.className = "square";
    sq.style.left = `${(x + 2) * (ts + 1)}px`;
    sq.style.top = `${(y + 2) * (ts + 1)}px`;
    sq.innerText = num;
    sq.id = `${x},${y}`;
    sq.onmouseover = e => move(e.target);
    return sq;
}

function move(sq) {
    let [x, y] = sq.id.split(",").map(e => Number(e));
    if (Math.abs(x - zx) + Math.abs(y - zy) == 1) {
        document.body.appendChild(square(zx, zy, sq.innerText));
        document.body.removeChild(sq);
        zx = x;
        zy = y;
        moves++
        return true;
    }
    return false;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function shuffle() {
    for (let i = 0; i < 1000; i++) {
        let els = [...document.querySelectorAll(".square")];
        let to_swap = els[Math.floor(Math.random() * els.length)];
        // if (move(to_swap)) await sleep(50);
        // else i--;
        if (!move(to_swap)) i--;
    }
    moves = 0;
    window.setInterval(update, 1000);
}

let w = 6;
let h = w;

let zx = w - 1;
let zy = h - 1;

let i = 0;
while (i < w * h - 1) {
    document.body.appendChild(square(i % w, Math.floor(i / w), order[i]))
    i++;
}

shuffle();
