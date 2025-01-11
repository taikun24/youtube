const pos = document.getElementById('pos');
const first = document.getElementById('first');
let firstTarget;
const second = document.getElementById('second');
let isFirst = true;
const nk = document.getElementById('nokori');
const stat = document.getElementById('status');
function create(i) {
    let elem = document.createElement("div");
    elem.className = 'card';
    elem.addEventListener('mouseenter', (e) => {
        if (dataGranted[i]) return;
        pos.innerText = 'そのカードは' + (parseInt(i / 100) + 1) + '行' + (i % 100 + 1) + '列目'
            + '(' + (i + 1) + '枚目)';
        if (e.target.className != 'card selected') {
            e.target.className = 'card hovered';
        }
    });
    elem.addEventListener('mouseleave', (e) => {
        if (dataGranted[i]) return;
        if (e.target.className != 'card selected') {
            e.target.className = 'card';
        }
    });
    elem.addEventListener('click', (e) => {
        if (dataGranted[i]) return;
        clicked(i, e.target);
    });
    document.getElementById('main').appendChild(elem);
}
let url = new URL(window.location.href);
let params = url.searchParams;
const pairsCount = params.get('c') == undefined ? 5000 : parseInt(params.get('c'));
const data = randomize();
let dataGranted = [];
let nokori = pairsCount * 2;
for (let index = 0; index < pairsCount * 2; index++) {
    create(index);
    dataGranted.push(false);
}
nk.innerText = '残り枚数 ' + nokori + '/' + (pairsCount * 2);
function randomize() {
    var arr = [];
    numArr = [];
    for (var i = 0; i < pairsCount; i++) {
        arr[i * 2] = i + 1;
        arr[i * 2 + 1] = i + 1;
    }
    for (var j = 0, len = arr.length; j < pairsCount * 2; j++, len--) {
        rndNum = Math.floor(Math.random() * len);
        numArr.push(arr[rndNum]);
        arr[rndNum] = arr[len - 1];
    }
    return numArr;
}
function clicked(i, target) {
    const number = data[i];
    if (isFirst) {
        first.innerText = number;
        first.name = i;
        isFirst = false;
        target.className = 'card selected';
        firstTarget = target;
        second.innerText = '?';
    } else {
        if (parseInt(first.name) == i) {
            return;
        }
        second.innerText = number;
        firstTarget.className = 'card';
        isFirst = true;
        if (first.innerText == second.innerText) {
            console.log("正解")
            firstTarget.className = 'granted';
            target.className = 'granted';
            dataGranted[parseInt(first.name)] = true;
            dataGranted[i] = true;
            nokori -= 2;
            nk.innerText = '残り枚数 ' + nokori + '/' + (pairsCount * 2);
            stat.innerText = '正解！';
            stat.className = 'red';
            if (nokori == 0) {
                location.href = "./clear.html"
            }
        } else {
            stat.innerText = '不正解';
            stat.className = 'blue';
        }
    }
}
