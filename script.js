let ts = 384;

shuffling = true;

let start, end;

function format() {
    const durationMs = end - start;

    const milliseconds = durationMs % 1000;
    const totalSeconds = Math.floor(durationMs / 1000);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60);

    if (minutes > 0) {
        return `${minutes}m${seconds}s`;
    } else if (seconds > 0) {
        return `${seconds}s`;
    } else {
        return `${milliseconds}ms`;
    }
}

function color_el(el) {
    let [bg, font] = color(Number(el.innerText));
    el.style.backgroundColor = bg;
    el.style.color = font;
}

function color(num) {
    i = num - 1
    let x = i % w;
    let y = Math.floor(i / w);
    let red = 255 * ((x + y) / ((2 * w) - 1))
    let blue = 255 - red;

    return [`rgb(${red}, 0, ${blue})`, `rgb(${blue}, 255, ${red})`];
}

function square(x, y, num) {
    if (num == 0) return;
    let sq = document.createElement("div")
    sq.className = "square";
    sq.style.left = `${(x + 1) * (ts + 1)}px`;
    sq.style.top = `${(y + 1) * (ts + 1)}px`;
    sq.innerText = num;
    sq.id = `${x},${y}`;
    sq.onmouseover = e => {
        if (move(e.target) && !start) start = Date.now();
    }
    color_el(sq);
    return sq;
}

function move(sq) {
    if (is_solved() && !shuffling) return;
    let [x, y] = sq.id.split(",").map(e => Number(e));
    if (Math.abs(x - zx) + Math.abs(y - zy) == 1) {
        sq.id = `${zx},${zy}`;
        sq.style.left = `${(zx + 1) * (ts + 1)}px`;
        sq.style.top = `${(zy + 1) * (ts + 1)}px`;
        zx = x;
        zy = y;
        if (is_solved() && !shuffling) window.setTimeout(() => {alert(`Solved in ${format()}!`);}, 100);
        return true;
    }
    return false;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let just_moved;
function find_neighbours() {
    let nb = [];
    for (let [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        let nx = zx + dx;
        let ny = zy + dy;
        if (0 <= nx && nx < w && 0 <= ny && ny < h && JSON.stringify([nx, ny]) != JSON.stringify(just_moved)) nb.push([nx, ny]);
    }
    return nb;
}

function shuffle() {
    for (let i = 0; i < 0.5 * Math.pow(w, 4); i++) {
        let neighbours = find_neighbours();
        let els = neighbours.map(e => document.getElementById(`${e[0]},${e[1]}`));
        let to_swap = els[Math.floor(Math.random() * els.length)];
        if (!move(to_swap)) i--;
        else just_moved = to_swap.id.split(",").map(Number);
    }
    shuffling = false;
}

function is_solved() {
    if (zx != w - 1 || zy != h - 1) return false;

    for (let i = 0; i < w * h - 1; i++) {
        if (document.getElementById(`${i % w},${Math.floor(i / w)}`).innerText != i + 1) {
            return false;
        }
    }

    end = Date.now()
    return true;
}

let w = Number(localStorage.getItem("size")) || 3;
let h = w;

let max = String(w * h - 1).length;

let my = h + 2;
let mts = Math.floor(window.innerHeight / my);

document.documentElement.style.setProperty('--ts', `${mts}px`);
document.documentElement.style.setProperty('--fs', `${mts / max}px`);
ts = mts;

let zx = w - 1;
let zy = h - 1;

for (let i = 0; i < w * h - 1; i++) {
    document.body.appendChild(square(i % w, Math.floor(i / w), i + 1))
}

shuffle();

let hidden = false;
document.onkeydown = (e) => {
    if (e.key.toLowerCase() === "b") {
        hidden = !hidden;
        if (hidden) {
            for (let sq of document.querySelectorAll(".square")) {
                sq.style.color = "transparent";
                sq.style.backgroundColor = "black";
            }
        } else {
            for (let sq of document.querySelectorAll(".square")) {
                color_el (sq);
            }
        }
    }
}
