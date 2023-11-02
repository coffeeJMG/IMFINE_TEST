// Subject 객체
function DataState() {
    this.observers = [];
    this.data = [];
}

DataState.prototype = {
    subscribe: function (observer) {
        this.observers.push(observer);
    },
    unsubscribe: function (observer) {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    },
    notify: function () {
        this.observers.forEach((observer) => observer.update(this.data));
    },
    updateData: function (newData) {
        this.data = newData;
        this.notify();
        console.log(this.data);
    },
    getData: function () {
        return this.data;
    },
};

// Observer 인터페이스
function Observer() {
    this.update = function (data) {
        console.log(data); // Observer가 구현해야 하는 메소드
    };
}

// 구체적인 Observer 구현

function ChartObserver(chartInstance) {
    this.update = function (data) {
        console.log(data, "차트 데이터 변화");
        chartInstance.setData(data); // 새로운 데이터로 차트 업데이트
    };
}
function TableObserver() {
    this.update = function (data) {
        console.log(data, "테이블 데이터 변화");
        // 기존 테이블 내용을 지우고
        const tableBody = document.getElementById("tableBody");
        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }
        // 새로운 데이터로 테이블을 다시 채운다
        data.forEach((updatedData) => {
            editTable(updatedData);
        });
    };
}

function EditorObserver() {
    this.update = function (data) {
        console.log(data, "고급 편집 변화");
    };
}

// 전역 상태 인스턴스 생성
const globalState = new DataState();

// 예를 들어 데이터가 변경되는 경우, 전역 상태 업데이트
function handleDataChange(newData) {
    globalState.updateData(newData);
}
function chartFactory() {
    const chart = new Chart(); // 'Chart' 생성자 함수 또는 클래스 필요
    chart.init(0, 100);

    // ChartObserver를 위해 chart 인스턴스 반환
    return chart;
}

// init 수정
let init = function () {
    // Chart 인스턴스 생성 및 Observer 등록은 이곳에서만 진행합니다.
    const chartInstance = chartFactory();

    // Observer 생성 및 구독 등록
    const chartObserver = new ChartObserver(chartInstance);
    const tableObserver = new TableObserver();
    const editorObserver = new EditorObserver();

    globalState.subscribe(chartObserver);
    globalState.subscribe(tableObserver);
    globalState.subscribe(editorObserver);

    // 이벤트 리스너 초기화
    initEventListeners();
};

function initEventListeners() {
    document
        .querySelector(".edit-data__apply-btn")
        .addEventListener("click", function () {
            editTableValues(); // 테이블 값을 수정하는 로직
            // 이곳에서 globalState를 업데이트하는 로직을 추가해야 할 수도 있습니다.
        });

    document
        .querySelector(".add-data__input button")
        .addEventListener("click", function () {
            const idValue = document.querySelector(".add-data__input-ID").value;
            const scoreValue = document.querySelector(
                ".add-data__input-VALUE",
            ).value;
            if (idValue && scoreValue) {
                addToJsonData(idValue, scoreValue);
            }
        });
}
