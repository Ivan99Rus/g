let div = document.getElementById('enemy');
let elems = div.getElementsByTagName('TD');

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
    console.log('aroundCell: ', aroundCell);

    newIndex = document.getElementById(aroundCell[0]);
    oldIndex = document.getElementById(id);

    imgBlock = oldIndex.querySelector('.img');
    iconValue = imgBlock.classList.value.split(' ').pop();

    deleteOldDiv(oldIndex);
    createNumberDiv(iconValue, newIndex, true);

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
        //        console.log('element: ', element);
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


    elemsList.forEach(function(element, index, elemsList) {
        el = elems[index];
        createNumberDiv(element - 1, el);
    });
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

fillTable();