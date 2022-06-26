var tetris = document.querySelector('#tetris');
var tetrisData = [];
var currentBlock;
var nextBlock;
var currentTopLeft = [0, 3];
var blocks = [
    {
        name: 's', //square
        center: false,
        numCode: 1,
        color: 'red',
        currentShapeIndex: 0,
        shape: [
            [
                [0, 0, 0],
                [0, 1, 1],
                [0, 1, 1],
            ]
        ],
    },
    {
        name: 't', //T
        center: true,
        numCode: 2,
        color: 'orange',
        currentShapeIndex: 0,
        shape: [
            [
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0],
            ],
            [
                [0, 1, 0],
                [1, 1, 0],
                [0, 1, 0],
            ],
            [
                [0, 1, 0],
                [1, 1, 1],
                [0, 0, 0],
            ],
            [
                [0, 1, 0],
                [0, 1, 1],
                [0, 1, 0],
            ],
        ],
    },
    {
        name: 'z', //z
        center: true,
        numCode: 3,
        color: 'yellow',
        currentShapeIndex: 0,
        shape: [
            [
                [0, 0, 0],
                [1, 1, 0],
                [0, 1, 1],
            ],
            [
                [0, 1, 0],
                [1, 1, 0],
                [1, 0, 0],
            ],
            [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 0],
            ],
            [
                [0, 0, 1],
                [0, 1, 1],
                [0, 1, 0],
            ],
        ],
    },
    {
        name: 'zr', //z rotate
        center: true,
        numCode: 4,
        color: 'green',
        startRow: 1,
        currentShapeIndex: 0,
        shape: [
            [
                [0, 0, 0],
                [0, 1, 1],
                [1, 1, 0],
            ],
            [
                [1, 0, 0],
                [1, 1, 0],
                [0, 1, 0],
            ],
            [
                [0, 1, 1],
                [1, 1, 0],
                [0, 0, 0],
            ],
            [
                [0, 1, 0],
                [0, 1, 1],
                [0, 0, 1],
            ],
        ],
    },
    {
        name: 'l', //L
        center: true,
        numCode: 5,
        color: 'blue',
        currentShapeIndex: 0,
        shape: [
            [
                [0, 0, 0],
                [1, 1, 1],
                [1, 0, 0],
            ],
            [
                [1, 1, 0],
                [0, 1, 0],
                [0, 1, 0],
            ],
            [
                [0, 0, 1],
                [1, 1, 1],
                [0, 0, 0],
            ],
            [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 1],
            ],
        ],
    },
    {
        name: 'lr', //L rotate
        center: true,
        numCode: 6,
        color: 'navy',
        currentShapeIndex: 0,
        shape: [
            [
                [0, 0, 0],
                [1, 1, 1],
                [0, 0, 1],
            ],
            [
                [0, 1, 0],
                [0, 1, 0],
                [1, 1, 0],
            ],
            [
                [1, 0, 0],
                [1, 1, 1],
                [0, 0, 0],
            ],
            [
                [0, 1, 1],
                [0, 1, 0],
                [0, 1, 0],
            ],
        ],
    },
    {
        name: 'b', //1자
        center: true,
        numCode: 7,
        color: 'violet',
        currentShapeIndex: 0,
        shape: [
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
            ],
            [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
            ],
            [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ],
            [
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
            ],
        ],
    }
];

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'navy', 'violet'];

//예전문법 : function 함수명() {}
//최신문법 : const 함수명 = () => {} 
//this가 서로 달라서 둘 다 쓰임
const isActiveBlock = value => (value > 0 && value < 10); //움직이는 블럭
const isInvalidBlock = value => (value == undefined || value >= 10); //움직일 수 없는 블럭

function init() { //초기화
    const fragment = document.createDocumentFragment();
    //Array/Object spread 문법 : [...Array(숫자).keys()], 배열content을 대괄호를 빼서 밖으로 내보낼 수 있음
    //0~(숫자-1)까지 있는 배열을 만드는 것
    //[...Array(숫자).keys().map((v)=>v+1)] : 1~숫자까지의 배열
    [...Array(20).keys()].forEach((col, i) => { //0~19 tr 생성
        const tr = document.createElement('tr');
        fragment.appendChild(tr);
        [...Array(10).keys()].forEach((row, j) => { //0~9 tr 생성
            const td = document.createElement('td');
            tr.appendChild(td);
        });
        const column = Array(10).fill(0);
        tetrisData.push(column);
    });
    tetris.appendChild(fragment);
}

function draw() {
    tetrisData.forEach((col, i) => {
        col.forEach((row, j) => {
            if (row > 0) { //칸 색칠
                tetris.children[i].children[j].className = tetrisData[i][j] >= 10 ? colors[tetrisData[i][j] / 10 - 1] : colors[tetrisData[i][j] - 1];
            } else {
                tetris.children[i].children[j].className = '';
            }
        });
    });
}

function drawNext() { //다음 블록 미리보기
    const nextTable = document.getElementById('next-table');
    nextTable.querySelectorAll('tr').forEach((col, i) => {
        Array.from(col.children).forEach((row, j) => {
            if (nextBlock.shape[0][i] && nextBlock.shape[0][i][j] > 0) {
                nextTable.querySelectorAll('tr')[i].children[j].className = colors[nextBlock.numCode - 1];
            } else {
                nextTable.querySelectorAll('tr')[i].children[j].className = 'white';
            }
        });
    });
}

function generate() { //블록생성
    if (!currentBlock) {
        currentBlock = blocks[Math.floor(Math.random() * blocks.length)];
    } else {
        currentBlock = nextBlock;
    }
    currentBlock.currentShapeIndex = 0;
    nextBlock = blocks[Math.floor(Math.random() * blocks.length)]; // 다음 블록 미리 생성
    //console.log(currentBlock);
    drawNext(); //다음 블록 미리보기를 그려줌
    currentTopLeft = [-1, 3]; //맨 윗칸부터 블록이 그려지도록

    //게임 오버 판단
    let isGameOver = false;
    currentBlock.shape[0].slice(1).forEach((col, i) => {
        col.forEach((row, j) => {
            if (row && tetrisData[i][j + 3]) isGameOver = true;
        });
    });

    //블록 데이터 생성
    currentBlock.shape[0].slice(1).forEach((col, i) => {
        //console.log(currentBlock.shape[0]);
        col.forEach((row, j) => {
            if (row) tetrisData[i][j + 3] = currentBlock.numCode;
        });
    });

    //화면에 도형 그리기
    if (isGameOver) {
        clearInterval(int);
        draw();
        alert('game over');
    } else {
        draw();
    }
}

function checkRows() { //한 줄 다 찼는지 검사
    const fullRows = [];

    //칸 돌면서 꽉 찬 줄의 index를 fullRows에 넣어줌
    tetrisData.forEach((col, i) => {
        let count = 0;
        col.forEach((row, j) => {
            if (row > 0) {
                count++;
            }
        });
        if (count == 10) {
            fullRows.push(i);
        }
    });

    const fullRowsCount = fullRows.length;
    tetrisData = tetrisData.filter((row, i) => !fullRows.includes(i)); //꽉 찬 줄 삭제
    for (let i = 0; i < fullRowsCount; i++) { //맨 위쪽에 줄 추가
        tetrisData.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0,]);
    }

    let score = parseInt(document.getElementById('score').textContent, 10);
    score += fullRowsCount ** 2;
    document.getElementById('score').textContent = String(score);
}

function tick() { //한 칸 아래로 
    const nextTopLeft = [currentTopLeft[0] + 1, currentTopLeft[1]];
    const activeBlocks = [];
    let canGoDown = true; //내려갈 수 있는지 여부 판단
    let currentBlockShape = currentBlock.shape[currentBlock.currentShapeIndex];

    //현재 3x3과 한 칸 아래 3x3을 비교해서 내려갈 수 있는지 검사
    for (let i = currentTopLeft[0]; i < currentTopLeft[0] + currentBlockShape.length; i++) {
        if (i < 0 || i >= 20) continue;
        for (let j = currentTopLeft[1]; j < currentTopLeft[1] + currentBlockShape.length; j++) {
            if (isActiveBlock(tetrisData[i][j])) { //현재 움직이는 블럭이면
                activeBlocks.push([i, j]);
                //TODO : bug fix (아래 블럭이 있어도 멈추지 않음)
                if (isInvalidBlock(tetrisData[i + 1] && tetrisData[i + 1][j])) { //만약 아래 칸에 블럭이 있다면
                    canGoDown = false;
                }
            }
        }
    }

    if (!canGoDown) { //cannot go down
        activeBlocks.forEach((blocks) => {
            tetrisData[blocks[0]][blocks[1]] *= 10;
        });
        checkRows(); //지워질 줄 있나 확인
        generate(); //새 블록 생성
        return false;
    } else if (canGoDown) { //데이터 한 칸씩 내리기
        for (let i = tetrisData.length - 1; i >= 0; i--) {
            const col = tetrisData[i];
            col.forEach((row, j) => {
                if (row < 10 && tetrisData[i + 1] && tetrisData[i + 1][j] < 10) {
                    tetrisData[i + 1][j] = row;
                    tetrisData[i][j] = 0;
                }
            });
        }
        currentTopLeft = nextTopLeft;
        draw();
        return true;
    }
}

let int = setInterval(tick, 50); //1000=1초마다 실행
init();
generate();

document.getElementById('stop').addEventListener('click', function () {
    clearInterval(int);
});
document.getElementById('start').addEventListener('click', function () {
    if (int) {
        clearInterval(int);
    }
    int = setInterval(tick, 2000);
});
/*
document.getElementById('mute').addEventListener('click', function() {
  if (document.getElementById('bgm').paused) {
    document.getElementById('bgm').play();
  } else {
    document.getElementById('bgm').pause();
  }
});
*/
window.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'ArrowLeft': { // 키보드 왼쪽 클릭 = 좌측 한 칸 이동
            const nextTopLeft = [currentTopLeft[0], currentTopLeft[1] - 1];
            let isMovable = true;
            let currentBlockShape = currentBlock.shape[currentBlock.currentShapeIndex];
            for (let i = currentTopLeft[0]; i < currentTopLeft[0] + currentBlockShape.length; i++) { // 왼쪽 공간 체크
                if (!isMovable) break;
                for (let j = currentTopLeft[1]; j < currentTopLeft[1] + currentBlockShape.length; j++) {
                    if (!tetrisData[i] || !tetrisData[i][j]) continue;
                    if (isActiveBlock(tetrisData[i][j]) && isInvalidBlock(tetrisData[i] && tetrisData[i][j - 1])) {
                        isMovable = false;
                    }
                }
            }
            console.log('left', 'isMovable', isMovable);
            if (isMovable) {
                currentTopLeft = nextTopLeft;
                tetrisData.forEach((col, i) => {
                    for (var j = 0; j < col.length; j++) {
                        const row = col[j];
                        if (tetrisData[i][j - 1] === 0 && row < 10) {
                            tetrisData[i][j - 1] = row;
                            tetrisData[i][j] = 0;
                        }
                    }
                });
                draw();
            }
            break;
        }
        case 'ArrowRight': { // 키보드 오른쪽 클릭 = 우측 한 칸 이동
            const nextTopLeft = [currentTopLeft[0], currentTopLeft[1] + 1];
            let isMovable = true;
            let currentBlockShape = currentBlock.shape[currentBlock.currentShapeIndex];
            for (let i = currentTopLeft[0]; i < currentTopLeft[0] + currentBlockShape.length; i++) { // 오른쪽 공간 체크
                if (!isMovable) break;
                for (let j = currentTopLeft[1]; j < currentTopLeft[1] + currentBlockShape.length; j++) {
                    if (!tetrisData[i] || !tetrisData[i][j]) continue;
                    if (isActiveBlock(tetrisData[i][j]) && isInvalidBlock(tetrisData[i] && tetrisData[i][j + 1])) {
                        isMovable = false;
                    }
                }
            }
            if (isMovable) {
                currentTopLeft = nextTopLeft;
                tetrisData.forEach((col, i) => {
                    for (var j = col.length - 1; j >= 0; j--) {
                        const row = col[j];
                        if (tetrisData[i][j + 1] === 0 && row < 10) {
                            tetrisData[i][j + 1] = row;
                            tetrisData[i][j] = 0;
                        }
                    }
                });
                draw();
            }
            break;
        }
        case 'ArrowDown': { // 키보드 아래쪽 클릭 = 아래로 한 칸 이동
            tick();
        }
    }
});

window.addEventListener('keyup', (e) => {
    switch (e.code) {
        case 'ArrowUp': { // 방향 전환
            let currentBlockShape = currentBlock.shape[currentBlock.currentShapeIndex];
            let isChangeable = true;
            const nextShapeIndex = currentBlock.currentShapeIndex + 1 === currentBlock.shape.length
                ? 0
                : currentBlock.currentShapeIndex + 1;
            const nextBlockShape = currentBlock.shape[nextShapeIndex];
            for (let i = currentTopLeft[0]; i < currentTopLeft[0] + currentBlockShape.length; i++) { // 돌린 이후 공간 체크
                if (!isChangeable) break;
                for (let j = currentTopLeft[1]; j < currentTopLeft[1] + currentBlockShape.length; j++) {
                    if (!tetrisData[i]) continue;
                    if (nextBlockShape[i - currentTopLeft[0]][j - currentTopLeft[1]] > 0 && isInvalidBlock(tetrisData[i] && tetrisData[i][j])) {
                        isChangeable = false;
                    }
                }
            }

            if (isChangeable) {
                while (currentTopLeft[0] < 0) {
                    tick();
                }
                for (let i = currentTopLeft[0]; i < currentTopLeft[0] + currentBlockShape.length; i++) { // 돌린 이후 공간 체크
                    for (let j = currentTopLeft[1]; j < currentTopLeft[1] + currentBlockShape.length; j++) {
                        if (!tetrisData[i]) continue;
                        let nextBlockShapeCell = nextBlockShape[i - currentTopLeft[0]][j - currentTopLeft[1]];
                        if (nextBlockShapeCell > 0 && tetrisData[i][j] === 0) {
                            // 다음 모양은 있는데 현재 칸이 없으면
                            tetrisData[i][j] = currentBlock.numCode;
                        } else if (nextBlockShapeCell === 0 && tetrisData[i][j] && tetrisData[i][j] < 10) {
                            // 다음 모양은 없는데  현재 칸이 있으면
                            tetrisData[i][j] = 0;
                        }
                    }
                }
                currentBlock.currentShapeIndex = nextShapeIndex;
            }
            draw();
            break;
        }
        case 'Space': // 한방에 쭉 떨구기
            while (tick()) { }
            break;
    }
});