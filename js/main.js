let div = document.getElementById('enemy');
let elems = div.getElementsByTagName('TD');

let stepCounter = document.querySelector('.step');
let timerCounter = document.querySelector('.time');

let timerHour = document.querySelector('#time-hour');
let timerMin = document.querySelector('#time-min');
let timerSec = document.querySelector('#time-sec');

const btn = document.querySelector('.btn');
const btnModal = document.querySelector('.btn-modal');

const modal = document.querySelector('.modal');

const resultStep = document.querySelector('.result-step');
const resultTime = document.querySelector('.result-time');


let counter = 0;

numToString = {
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    7: 'seven',
    8: 'eight',
    9: 'nine',
    10: 'ten',
    11: 'eleven',
    12: 'twelve',
    13: 'thirteen',
    14: 'fourteen',
    15: 'fifteen',
    16: 'sixteen',
};

click = (event) => {
    target = event.target.parentNode.parentNode;

    id = target.id;

    aroundCell = around(target);

    if (aroundCell.length === 0) {
        console.log('Недопустимый ход!');
    } else {
        newIndex = document.getElementById(aroundCell[0]);
        oldIndex = document.getElementById(id);

        imgBlock = oldIndex.querySelector('.img');
        iconValue = imgBlock.classList.value.split(' ').pop();

        deleteOldDiv(oldIndex);
        createNumberDiv(iconValue, newIndex, true);

        counter++;
        stepCounter.textContent = counter;
    }
    checkRight();
};

// ищет ближайшие клетки
around = (aroundTarget) => {
    let aroundList = [];
    now = target.id;

    aroundList.push(Number(now) + Number(1));
    aroundList.push(now - 1);
    aroundList.push(Number(now) + Number(4));
    aroundList.push(now - 4);

    // осталось отработать когда крайний елемент
    aroundList.forEach(element => {
        if (element < 1 || element > 16) {
            delete((aroundList[aroundList.indexOf(element)]));
        }

        if (aroundTarget.classList.contains('farRight')) {
            // нужно убрать слева
            delete((aroundList[aroundList.indexOf(Number(now) + Number(1))]));
        }

        if (aroundTarget.classList.contains('farLeft')) {
            // нужно убрать слева
            delete((aroundList[aroundList.indexOf(now - 1)]));
        }
    });

    aroundAll = aroundList.filter(element => element !== null);

    return aroundPossible(aroundAll);
};

// ближайшие свободные
aroundPossible = (arr) => {
    arr.forEach(element => {
        if (elems[element - 1].classList.contains('full')) {
            delete((arr[arr.indexOf(element)]));
        }
    });

    possible = arr.filter(element => element !== null);

    return possible;
};

// создаем div для вставки в таблицу
createNumberDiv = (index, element, flag) => {

    imageWrap = document.createElement('div');
    imageWrap.className = 'number';

    img = document.createElement("IMG");
    img.className = 'img';

    if (flag) {
        img.classList.add(index);
        img.src = "img/" + index + ".svg";
    } else {
        img.classList.add(numToString[(Number(index) + 1)]);
        img.src = "img/" + numToString[(Number(index) + 1)] + ".svg";
    }

    imageWrap.append(img);
    element.append(imageWrap);

    // показывает что клетка занята
    element.classList.add('full');
};

deleteOldDiv = (oldIndex) => {
    oldIndex.classList.toggle('full');
    oldIndex.querySelector('.number').remove();
};

// навешиваем прослушку на все клетки
for (let i = 0; i < elems.length; i++) {
    const element = elems[i];
    element.addEventListener('click', click);
}

// этот цикл заполняет всю таблицу элементами с номерами
fillTable = () => {
    elemsList = shuffle();
    elemsList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 13, 14, 11];

    elemsList.forEach(element => {
        createNumberDiv(element - 1, elems[element - 1]);
    });

    /*elemsList.forEach(function(element, index, elemsList) {
        el = elems[index];
        createNumberDiv(element - 1, el);
    });*/
};


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

shuffle = () => {
    startList = [];
    shuffleList = [];

    for (let index = 0; index < 15; index++) {
        startList.push(index + 1);
    }

    shuffleList = shuffleArray(startList);

    return shuffleList;
};

checkRight = () => {
    rightEl = 0;
    for (let index = 0; index < elems.length; index++) {
        const element = elems[index];

        classImg = element.querySelector('.img');

        if (classImg !== null) {


            num = classImg.classList.value.split(' ')[1];

            if (numToString[element.id] === num) {
                rightEl++;
            }
        }
    }

    if (rightEl === 15 && counter > 0) {
        resultGame();
        console.log('Все верно, игра окончена');
    }
};

resultGame = () => {
    stepAll = stepCounter.textContent;
    gameTime = timerCounter.textContent;

    let bestTime, bestStep;

    stop_timer();

    modal.style.display = "block";

    if (localStorage.getItem('step') === null) {
        oldRecordStep = 10000;
        localStorage.setItem('step', oldRecordStep);
    } else {
        oldRecordStep = localStorage.getItem('step');
    }

    // подумать
    if (localStorage.getItem('time') === null) {
        oldRecordTime = '100:00:00';
        localStorage.setItem('time', oldRecordTime);
    } else {
        oldRecordTime = localStorage.getItem('time');
    }

    if (stepAll < oldRecordStep) {
        bestStep = stepAll;
        localStorage.setItem('step', bestTime);
    }

    sOld = timeToSec(oldRecordTime);
    s = timeToSec(gameTime);

    if (s < sOld) {
        bestTime = gameTime;
        localStorage.setItem('time', bestTime);
    } else {
        bestTime = localStorage.getItem('time');
    }

    resultStep.textContent = 'Количество ходов: ' + stepAll + '\t\t\t(Лучший результат: ' + bestStep + ')';
    resultTime.textContent = 'Время игры: ' + gameTime + '\t\t\t(Лучший результат: ' + bestTime + ')';
};

timeToSec = (str) => {

    h = Number(str.split(':')[0]);
    m = Number(str.split(':')[1]);
    s = Number(str.split(':')[2]);

    sec = h * 3600 + m * 60 + s;
    return sec;
};

stop_timer = () => {
    clearInterval(sec);
};

start_timer = () => {
    timerCounter.classList.remove('oldRecordColor');
    timerCounter.classList.add('newRecordColor');

    if (localStorage.getItem('time') === null) {
        localStorage.setItem('time', '100:00:00');
    }

    bestTimeSec = timeToSec(localStorage.getItem('time'));

    hourTimer = 0;
    minuteTimer = 0;
    secondTimer = 0;

    record = setTimeout(() => {
        timerCounter.classList.remove('newRecordColor');
        timerCounter.classList.add('oldRecordColor');
        clearTimeout(record);
    }, bestTimeSec * 1000);

    sec = setInterval(() => {

        secondTimer++;

        if (secondTimer > 59) {
            secondTimer = 0;
            minuteTimer++;
        }

        if (minuteTimer > 59) {
            minuteTimer = 0;
            hourTimer++;
        }

        second = secondTimer < 10 ? (':0' + secondTimer) : (':' + secondTimer);
        minute = minuteTimer < 10 ? (':0' + minuteTimer) : (':' + minuteTimer);
        hour = hourTimer < 10 ? ('0' + hourTimer) : hourTimer;

        allTime = hour + minute + second;
        timerCounter.textContent = allTime;

    }, 1000);
};

btnModal.addEventListener('click', () => {
    modal.style.display = "none";
    newGame();

});

btn.addEventListener('click', () => {
    newGame();
});

newGame = () => {
    for (let i = 0; i < 16; i++) {
        el = elems[i];

        number = el.querySelector('.number');
        if (number) {
            number.remove();
        }
    }
    counter = 0;
    init();
};

init = () => {
    timerCounter.textContent = '00:00:00';
    timerCounter.classList.add('newRecordColor');

    stepCounter.textContent = counter;
    stepCounter.classList.add('newRecordColor');

    fillTable();
    start_timer();
}

init();

// проверка на лучшее время
// проверка на лучшие ходы
// выигрыш