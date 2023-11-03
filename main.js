// 렌더링 시 기본 옵션 설정

// 테이블 데이터 전역 상태관리를 위한 옵저버 패턴
function DataState() {
    this.observers = [];
    this.data = [];
}

DataState.prototype = {
    // 함수 구독
    subscribe: function (observer) {
        this.observers.push(observer);
    },

    // 변화 감지
    notify: function () {
        this.observers.forEach((observer) => observer.update(this.data));
    },

    // 데이터 업데이트
    updateData: function (newData) {
        this.data = newData;
        this.notify();
    },

    // 데이터 열람
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

// 차트 옵저버
function ChartObserver(chartInstance) {
    this.update = function (data) {
        chartInstance.setData(data); // 새로운 데이터로 차트 업데이트
    };
}

// 테이블 옵저버
function TableObserver() {
    this.update = function (data) {
        // 기존 테이블 내용을 삭제
        const tableBody = document.getElementById("tableBody");
        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }

        // 새로운 데이터 추가
        data.forEach((updatedData) => {
            editTable(updatedData);
        });
    };
}

// 고급 편집 옵저버

function EditorObserver() {
    this.update = function (data) {};
}

// 전역 상태 관리 인스턴스
const tabelDataState = new DataState();

// 데이터가 변경되는 경우, 전역 상태 업데이트
function handleDataChange(newData) {
    tabelDataState.updateData(newData);
}

// 차트 실행
function chartFactory() {
    const chart = new Chart(); // 'Chart' 생성자 함수 또는 클래스 필요
    chart.init(0, 100);

    // ChartObserver를 위해 chart 인스턴스 반환
    return chart;
}

// 렌더링시에 기본 설정
let init = function () {
    // Chart 인스턴스 생성
    const chartInstance = chartFactory();

    // Observer 생성 및 구독 등록
    const chartObserver = new ChartObserver(chartInstance);
    const tableObserver = new TableObserver();
    const editorObserver = new EditorObserver();

    tabelDataState.subscribe(chartObserver);
    tabelDataState.subscribe(tableObserver);
    tabelDataState.subscribe(editorObserver);

    // 이벤트 리스너 초기화
    initEventListeners();
};

// 버튼 별 이벤트 리스너 추가
function initEventListeners() {
    // 데이터 수정하기 버튼
    document
        .querySelector(".edit-data__apply-btn")
        .addEventListener("click", function () {
            editTableValues(); // 테이블 값을 수정하는 함수
        });

    // 데이터 추가하기 버튼
    document
        .querySelector(".add-data__input button")
        .addEventListener("click", function () {
            const idValue = document.querySelector(".add-data__input-ID").value;
            const scoreValue = document.querySelector(
                ".add-data__input-VALUE",
            ).value;
            if (idValue && scoreValue) {
                addTabelData(idValue, scoreValue);
            }
        });
}
