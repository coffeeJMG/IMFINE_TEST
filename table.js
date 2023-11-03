// table과 고급 편집 텍스트 관리 js 파일

// 테이블 동적 생성 함수
function editTable(updateData) {
    const tableBody = document.getElementById("tableBody"); // data 가 적용될 테이블
    const idValue = updateData
        ? updateData.id
        : document.querySelector(".add-data__input-ID").value; // 변경된 id 데이터 없다면 새로 입력된 id 데이터
    const scoreValue = updateData
        ? updateData.value
        : document.querySelector(".add-data__input-VALUE").value; // 변경된 value 데이터 없다면 새로 입력된 value 데이터
    const row = document.createElement("tr"); // 테이블 행 생성

    // 짝수, 홀수 번 째 행 색상 다르게 지정
    if (tableBody.childNodes.length % 2 === 0) {
        row.style.backgroundColor = "#f2f2f2"; // 짝수 행의 배경색
    } else {
        row.style.backgroundColor = "#e6e6e6"; // 홀수 행의 배경색
    }

    // table의 id cell 생성
    const idCell = document.createElement("td");
    const idInput = document.createElement("div");
    idInput.type = "text";
    idInput.innerHTML = idValue;
    idCell.appendChild(idInput);

    // table의 value cell 생성
    const valueCell = document.createElement("td");
    const valueInput = document.createElement("input");
    valueInput.type = "text";
    valueInput.value = scoreValue;
    valueCell.appendChild(valueInput);

    // table의 삭제버튼 생성
    const deleteCell = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "text";
    deleteBtn.innerHTML = "삭제";

    deleteCell.appendChild(deleteBtn);

    // 행에 들어갈 요소 추가
    row.appendChild(idCell);
    row.appendChild(valueCell);
    row.appendChild(deleteCell);

    // 테이블에 생성된 행 추가
    tableBody.appendChild(row);

    // 고급 편집에 데이터 동시 생성
    renderAdvancedEditor();

    // 삭제 버튼 이벤트 리스너 추가
    deleteBtn.addEventListener("click", function () {
        // 데이터 삭제 함수
        handleDeleteClick(row, idValue);
    });
}

// 테이블 데이터 추가 함수
function addTabelData(id, value) {
    const tabelDataList = [...tabelDataState.getData()]; // 기존 데이터 열람
    let newData = {
        id: id,
        value: value,
    };
    tabelDataList.push(newData); // 새로운 데이터 추가
    tabelDataState.updateData(tabelDataList); // 기존 데이터 업데이트
}

// 테이블 데이터 추가 시 고급 편집 엘리먼트 생성
function renderAdvancedEditor() {
    const tabelDataList = [...tabelDataState.getData()]; // 기존 데이터 열람
    const advancedEditor = document.querySelector(".advanced-editor__bracket"); // 데이터 추가될 요소 선택
    const tabelDataDiv = document.createElement("div"); // 데이터를 표시할 div 생성
    tabelDataDiv.className = "advanced-editor__content";

    // 데이터를 순회하며 엘리먼트 생성
    tabelDataList.forEach((data) => {
        const tabelDataList = document.createElement("p");
        tabelDataList.className = "advanced-editor__text";
        tabelDataList.innerHTML = `{
            &nbsp;&nbsp;&nbsp;&nbsp;"id" : <span class="advanced-editor__editable-id">${data.id}</span>,
            &nbsp;&nbsp;&nbsp;&nbsp;"value": <span class="advanced-editor__editable-value">${data.value}</span>
        },`;
        tabelDataDiv.appendChild(tabelDataList);
    });

    // 더블 클릭 시 span을 input으로 변환하는 함수
    function convertToInput(event, className) {
        if (event.target.classList.contains(className)) {
            const span = event.target; // 대상 text 선택
            const currentValue = span.textContent; // text의 값 저장

            const input = document.createElement("input"); // 변화 될 Input 생성
            input.value = currentValue; // 기존 데이터 값 저장
            input.setAttribute("data-original-value", currentValue);
            span.replaceWith(input); // Input으로 변경
            input.focus();

            // 여기서 '수정하기'와 '취소하기' 버튼을 생성합니다.
            const buttonContainer = document.createElement("div");
            buttonContainer.className = "advanced-editor__button-container";

            // 수정하기 버튼
            const saveBtn = document.createElement("button");
            saveBtn.textContent = "수정하기";
            saveBtn.className = "advanced-editor__save-btn";

            // 취소하기 버튼
            const cancelBtn = document.createElement("button");
            cancelBtn.textContent = "취소하기";
            cancelBtn.className = "advanced-editor__cancel-btn";

            // 버튼들을 컨테이너에 추가
            buttonContainer.appendChild(saveBtn);
            buttonContainer.appendChild(cancelBtn);

            // 컨테이너를 화면에 표시
            document
                .querySelector(".advanced-editor__content")
                .after(buttonContainer);

            input.className = className;
        }
    }

    // 더블 클릭 시 span => input 변경하는 함수 실행
    document.addEventListener("dblclick", function (event) {
        convertToInput(event, "advanced-editor__editable-value");
    });

    // '수정하기' 버튼 클릭 시 값을 저장하고 input을 span으로 변환
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("advanced-editor__save-btn")) {
            const updateTabelDataList = [];

            // .advanced-editor__content 내의 모든 input 요소들을 찾습니다.
            const tabelInputs = document.querySelectorAll(
                ".advanced-editor__text",
            );

            tabelInputs.forEach((input) => {
                // ID를 담은 span과 Value 담고 있는 input 태그를 찾아서 선택
                const idSpan = input.querySelector(
                    ".advanced-editor__editable-id",
                );
                const valueInput = input.querySelector(
                    "input.advanced-editor__editable-value",
                );

                let id = idSpan.textContent; // id 값은 변경하지 않으므로 기존 값 그대로 사용
                let value; // 변경될 value를 담을 변수

                // input 요소로 변환된 value 값이 있는지 확인
                if (valueInput) {
                    value = valueInput.value;
                } else {
                    // input 요소가 없다면 span에서 value 값을 가져옵니다.
                    const valueSpan = input.querySelector(
                        ".advanced-editor__editable-value",
                    );
                    value = valueSpan.textContent;
                }

                // 업데이트할 항목 정보를 추가합니다.
                updateTabelDataList.push({ id, value });
            });

            editTableValues(updateTabelDataList);
            tabelDataState.updateData(updateTabelDataList);

            //버튼 삭제
            removeButtons();
        }
    });

    // 기존에 추가된 advance Data 삭제 (중복 방지)
    const oldDisplay = advancedEditor.querySelector(
        ".advanced-editor__content",
    );
    if (oldDisplay) {
        advancedEditor.removeChild(oldDisplay);
    }

    advancedEditor.appendChild(tabelDataDiv);
}

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("advanced-editor__cancel-btn")) {
        // 모든 input 요소를 다시 span 요소로 변환합니다.
        const inputs = document.querySelectorAll(
            "input.advanced-editor__editable-value",
        );
        inputs.forEach((input) => {
            // data-original-value를 사용하여 원본 데이터를 span에 설정
            const originalValue = input.getAttribute("data-original-value");
            const span = document.createElement("span");
            span.textContent = originalValue;
            span.className = "advanced-editor__editable-value";
            input.replaceWith(span);
        });

        //버튼 삭제
        removeButtons();
    }
});

// 수정하기,취소하기 버튼 없애는 함수
function removeButtons() {
    const buttonContainers = document.querySelectorAll(
        ".advanced-editor__button-container",
    );
    buttonContainers.forEach((container) => {
        container.remove();
    });
}

// 테이블 데이터 변경 함수
function editTableValues() {
    // 새로운 데이터를 반영할 테이블 엘리먼트 생성
    const tableBody = document.getElementById("tableBody");
    const rows = tableBody.querySelectorAll("tr");
    let updateTabelData = []; // 업데이트할 항목들을 저장할 배열

    // 행을 순회하며 데이터 저장
    rows.forEach((row) => {
        const valueInput = row.querySelector("td:nth-child(2) input");
        const idDiv = row.querySelector("td:nth-child(1) div");
        const id = idDiv.textContent;
        const value = valueInput.value;

        // 업데이트할 항목 정보를 배열에 추가
        updateTabelData.push({ id, value });
    });

    // 변경된 항목들로 jsonDataList 업데이트
    tabelDataState.updateData(updateTabelData);

    // 변경된 jsonData로 고급 편집기 업데이트
    renderAdvancedEditor();

    return updateTabelData;
}

// 삭제 버튼 이벤트 리스너
function handleDeleteClick(row, idValue) {
    const tabelDataList = [...tabelDataState.getData()]; // 기존 데이터 열람
    tableBody.removeChild(row); // 행 삭제

    // 데이터 삭제
    const deleteData = tabelDataList.findIndex((data) => data.id === idValue);
    if (deleteData > -1) {
        tabelDataList.splice(deleteData, 1);
    }

    // 변경된 데이터 저장
    tabelDataState.updateData(tabelDataList);
    renderAdvancedEditor();
}
