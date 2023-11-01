// table과 고급 편집 텍스트 관리 js 파일

let jsonDataList = [];

function editTable() {
    const tableBody = document.getElementById("tableBody");

    const idValue = document.querySelector(".add-data__input-ID").value;
    const scoreValue = document.querySelector(".add-data__input-VALUE").value;

    addToJsonData(idValue, scoreValue);
    const chartInstance = chartFactory();
    chartInstance.setChartData(jsonDataList);
    const row = document.createElement("tr");

    // 현재 행의 개수를 기반으로 배경색 설정
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

    row.appendChild(idCell);
    row.appendChild(valueCell);
    row.appendChild(deleteCell);

    tableBody.appendChild(row);

    renderAdvancedEditor();
    deleteBtn.addEventListener("click", function () {
        handleDeleteClick(row, idValue, chartInstance);
    });

    document
        .querySelector(".edit-data__apply-btn")
        .addEventListener("click", function () {
            handleApplyClick(chartInstance);
        });
}

// 테이블 데이터 추가 함수
function addToJsonData(id, value) {
    let newEntry = {
        id: id,
        value: value,
    };
    jsonDataList.push(newEntry);
}

// 테이블 데이터 추가 시 고급 편집 엘리먼트 생성
function renderAdvancedEditor() {
    const advancedEditor = document.querySelector(".advanced-editor__bracket");
    const jsonDataBox = document.createElement("div"); // 데이터를 표시할 div 생성
    jsonDataBox.className = "advanced-editor__content";

    jsonDataList.forEach((data) => {
        const jsonData = document.createElement("p");
        jsonData.className = "advanced-editor__text";
        jsonData.innerHTML = `{
            &nbsp;&nbsp;&nbsp;&nbsp;"id" : <span class="advanced-editor__editable-id">${data.id}</span>, 
            &nbsp;&nbsp;&nbsp;&nbsp;"value": <span class="advanced-editor__editable-value">${data.value}</span>
        },`;
        jsonDataBox.appendChild(jsonData);
    });

    // 더블 클릭 시 span을 input으로 변환하는 함수
    function convertToInput(event, className) {
        if (event.target.classList.contains(className)) {
            const span = event.target;
            const currentValue = span.textContent;

            const input = document.createElement("input");
            input.value = currentValue;
            span.replaceWith(input);
            input.focus();

            // input 값이 변경되면 '수정하기' 버튼 표시
            input.addEventListener("input", function () {
                if (!document.querySelector(".advanced-editor__save-btn")) {
                    const saveBtn = document.createElement("button");
                    saveBtn.textContent = "수정하기";
                    saveBtn.className = "advanced-editor__save-btn";
                    document
                        .querySelector(".advanced-editor__content")
                        .after(saveBtn);
                }
            });
        }
    }

    document.addEventListener("dblclick", function (event) {
        convertToInput(event, "advanced-editor__editable-id");
        convertToInput(event, "advanced-editor__editable-value");
    });

    // '수정하기' 버튼 클릭 시 값을 저장하고 input을 span으로 변환
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("advanced-editor__save-btn")) {
            // .advanced-editor__content 내의 모든 input 요소들을 찾습니다.
            const inputs = document.querySelectorAll(
                ".advanced-editor__content input",
            );

            inputs.forEach((input) => {
                const span = document.createElement("span");

                // input의 이전 형제 요소가 "id"를 포함하고 있는지 확인
                if (
                    input.previousElementSibling &&
                    input.previousElementSibling.textContent.includes("id")
                ) {
                    span.className = "advanced-editor__editable-id";
                } else {
                    span.className = "advanced-editor__editable-value";
                }

                span.textContent = input.value;
                input.replaceWith(span);
            });

            // 수정하기 버튼 제거
            event.target.remove();
        }
    });

    // 기존에 추가된 jsonDataBox 삭제 (중복 방지)
    const oldDisplay = advancedEditor.querySelector(
        ".advanced-editor__content",
    );
    if (oldDisplay) {
        advancedEditor.removeChild(oldDisplay);
    }

    advancedEditor.appendChild(jsonDataBox);
}

// 테이블 데이터 수정
function editTableValues() {
    const tableBody = document.getElementById("tableBody");
    const rows = tableBody.querySelectorAll("tr");
    let updatedValues = [];

    rows.forEach((row) => {
        const valueInput = row.querySelector("td:nth-child(2) input");
        const id = row.querySelector("td:nth-child(1) div").innerText;

        let updatedValue = updateJsonData(id, valueInput.value); // 이렇게 바뀐 값을 업데이트하고 결과를 받아옴
        if (updatedValue) {
            updatedValues.push(updatedValue); // 변경된 값을 배열에 추가
        }
    });

    renderAdvancedEditor(); // 변경된 jsonData로 고급 편집기 업데이트
    return updatedValues; // 수정된 값을 반환
}

// JSON Data 업데이트
function updateJsonData(id, value) {
    let existingEntry = jsonDataList.find((data) => data.id === id);
    if (existingEntry) {
        existingEntry.value = value; // 해당 id의 value 값을 업데이트
        return { id: id, value: value };
    }
}

// 삭제 버튼 이벤트 리스너
function handleDeleteClick(row, idValue, chartInstance) {
    tableBody.removeChild(row);

    const updateData = jsonData.findIndex((data) => data.id === idValue);
    if (updateData > -1) {
        jsonData.splice(updateData, 1);
    }
    chartInstance.setChartData(jsonDataList);
    renderAdvancedEditor();
}

// 데이터 수정 버튼 이벤트 리스너
function handleApplyClick(chartInstance) {
    const updatedValues = editTableValues();
    chartInstance.setChartData(updatedValues);
    console.log(updatedValues);
}
