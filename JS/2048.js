/*
https://github.com/ZeroCho/webgame-lecture
애니메이션 구현은 canvas를 이용해야 함
*/

//data
var table = document.getElementById('table');
var data;
var score = document.getElementById('scoreText');

function init() { //init data
    data = [];
    var fragment = document.createDocumentFragment();
    [1, 2, 3, 4].forEach(function () {
        var trData = [];
        data.push(trData);
        var tr = document.createElement('tr');
        [1, 2, 3, 4].forEach(function () {
            trData.push(0);
            var td = document.createElement('td');
            tr.appendChild(td);
        });
        fragment.appendChild(tr);
    });
    table.appendChild(fragment);
}

function randomCreate() {
    //create the random number in one of the blanks
    var blank = [];
    data.forEach(function (trData, i) {
        trData.forEach(function (tdData, j) {
            if (!tdData) { //when the number is zero == !0 == 1
                blank.push([i, j]);
            }
        });
    });
    if (blank.length === 0) { //no blank
        alert("GAME OVER : " + score.textContent);
        table.innerHTML = ''; //delete table
        score.textContent = '0'; //init score
        init(); //init data
    } else {
        var randomCell = blank[Math.floor(Math.random() * blank.length)];
        data[randomCell[0]][randomCell[1]] = 2;
        draw();
    }
}

//draw a screen from data
function draw() {
    data.forEach(function (trData, i) {
        trData.forEach(function (tdData, j) {
            if (tdData > 0) { //display only when number>0
                table.children[i].children[j].textContent = tdData;
            } else { //0 is not visible
                table.children[i].children[j].textContent = '';
            }
        });
    });
}

//start
function start() {
    init();
    randomCreate();
    draw();
}


/*
screenX : 모니터기준좌표
pageX : 페이지 기준좌표(스크롤포함)
clientX : 브라우저화면기준
offsetX : 이벤트타겟기준
*/

start();

var dragStart = false;
var draging = false;
var coordinateS;
var coordinateE;

window.addEventListener('mousedown', function (e) { //mouse click
    dragStart = true;
    coordinateS = [e.clientX, e.clientY];
});
window.addEventListener('mousemove', function (e) {
    if (dragStart) {
        draging = true;
    }
});
window.addEventListener('mouseup', function (e) { //release mouse click
    coordinateE = [e.clientX, e.clientY];
    //difinite the direction
    if (draging) {
        var deltaX = coordinateE[0] - coordinateS[0];
        var deltaY = coordinateE[1] - coordinateS[1];
        var slope = Math.abs(deltaY) / Math.abs(deltaX);
        var direction;

        if (deltaY < 0 && slope > 1) {
            direction = "up";
        } else if (deltaY > 0 && slope > 1) {
            direction = "down";
        } else if (deltaX > 0 && slope < 1) {
            direction = "right";
        } else if (deltaX < 0 && slope < 1) {
            direction = "left";
        }
        console.log(direction);
    }
    dragStart = false;
    draging = false;

    //move number and add number(need bug fix:addition at once)
    switch (direction) {
        case "left":
            var newData = [[], [], [], []];
            data.forEach(function (tr, i) {
                tr.forEach(function (td, j) {
                    if (td) {
                        //앞 데이터가 있고, 그게 지금 데이터와 같으면 합치기
                        if (newData[i][newData[i].length - 1] && newData[i][newData[i].length - 1] === td) {
                            newData[i][newData[i].length - 1] *= 2;
                            var totalScore = parseInt(score.textContent, 10);
                            score.textContent = totalScore + newData[i][newData[i].length - 1];
                        } else {
                            newData[i].push(td);
                        }
                    }
                });
            });
            [1, 2, 3, 4].forEach(function (tr, i) {
                [1, 2, 3, 4].forEach(function (td, j) {
                    data[i][j] = newData[i][j] || 0;
                });
            });
            break;
        case "right":
            var newData = [[], [], [], []];
            data.forEach(function (tr, i) {
                tr.forEach(function (td, j) {
                    if (td) {
                        if (newData[i][0] && newData[i][0] === td) {
                            newData[i][0] *= 2;
                            var totalScore = parseInt(score.textContent, 10);
                            score.textContent = totalScore + newData[i][0];
                        } else {
                            newData[i].unshift(td);
                        }
                    }
                });
            });
            [1, 2, 3, 4].forEach(function (tr, i) {
                [1, 2, 3, 4].forEach(function (td, j) {
                    data[i][3 - j] = newData[i][j] || 0;
                });
            });
            break;
        case "up":
            var newData = [[], [], [], []];
            data.forEach(function (tr, i) {
                tr.forEach(function (td, j) {
                    if (td) {
                        if (newData[j][newData[j].length - 1] && newData[j][newData[j].length - 1] === td) {
                            newData[j][newData[j].length - 1] *= 2;
                            var totalScore = parseInt(score.textContent, 10);
                            score.textContent = totalScore + newData[j][newData[j].length - 1];
                        } else {
                            newData[j].push(td);//배열의 맨 끝에 원소추가
                        }
                    }
                });
            });
            [1, 2, 3, 4].forEach(function (td, i) {
                [1, 2, 3, 4].forEach(function (tr, j) {
                    data[j][i] = newData[i][j] || 0;
                });
            });
            break;
        case "down":
            var newData = [[], [], [], []];
            data.forEach(function (tr, i) {
                tr.forEach(function (td, j) {
                    if (td) {
                        if (newData[j][0] && newData[j][0] === td) {
                            newData[j][0] *= 2;
                            var totalScore = parseInt(score.textContent, 10);
                            score.textContent = totalScore + newData[j][0];
                        } else {
                            newData[j].unshift(td);//배열의 맨 끝에 원소추가
                        }
                    }
                });
            });
            [1, 2, 3, 4].forEach(function (td, i) {
                [1, 2, 3, 4].forEach(function (tr, j) {
                    data[3 - j][i] = newData[i][j] || 0;
                });
            });
            break;
    }

    //create number
    randomCreate();
});