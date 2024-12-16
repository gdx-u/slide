let ts = 384;

// let order = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let moves = 0;
let seconds = 0;

function color(num) {
    i = num - 1
    let x = i % w;
    let y = Math.floor(i / w);
    let red = 255 * ((x + y) / ((2 * w) - 1))
    let blue = 255 - red;

    return [`rgb(${red}, 0, ${blue})`, `rgb(${blue}, 255, ${red})`];
}

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
    sq.style.backgroundColor = color(num)[0];
    sq.style.color = color(num)[1];
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

let w = Number(localStorage.getItem("size")) || 3;
let h = w;

document.documentElement.style.setProperty('--ts', `${Math.floor(384 / w)}px`);
document.documentElement.style.setProperty('--fs', `${Math.floor(144 / w)}px`);
ts = Math.floor(384 / w)

let zx = w - 1;
let zy = h - 1;

let i = 0;
while (i < w * h - 1) {
    document.body.appendChild(square(i % w, Math.floor(i / w), i + 1))
    i++;
}

shuffle();
