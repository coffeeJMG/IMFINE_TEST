// table과 고급 편집 텍스트 관리 js 파일

let jsonDataList = [];

function editTable() {
    const tableBody = document.getElementById("tableBody");

    const idValue = document.querySelector(".add-data__input-ID").value;
    const scoreValue = document.querySelector(".add-data__input-VALUE").value;

    addToJsonData(idValue, scoreValue);
    updateChartData(jsonDataList);
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
        handleDeleteClick(row, idValue);
    });

    document
        .querySelector(".edit-data__apply-btn")
        .addEventListener("click", function () {
            editTableValues();
            updateChartData(jsonDataList);
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
            input.className = className;
        }
    }

    document.addEventListener("dblclick", function (event) {
        convertToInput(event, "advanced-editor__editable-value");
    });

    // '수정하기' 버튼 클릭 시 값을 저장하고 input을 span으로 변환
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("advanced-editor__save-btn")) {
            const entriesToUpdate = [];

            // .advanced-editor__content 내의 모든 input 요소들을 찾습니다.
            const paragraphs = document.querySelectorAll(
                ".advanced-editor__text",
            );

            paragraphs.forEach((paragraph) => {
                // ID와 value를 담고 있는 input 태그를 찾습니다.
                const idSpan = paragraph.querySelector(
                    ".advanced-editor__editable-id",
                );
                const valueInput = paragraph.querySelector(
                    "input.advanced-editor__editable-value",
                );

                let id = idSpan.textContent;
                let value;

                // input 요소로 변환된 value 값이 있는지 확인
                if (valueInput) {
                    value = valueInput.value;
                } else {
                    // input 요소가 없다면 span에서 value 값을 가져옵니다.
                    const valueSpan = paragraph.querySelector(
                        ".advanced-editor__editable-value",
                    );
                    value = valueSpan.textContent;
                }

                // 업데이트할 항목 정보를 추가합니다.
                entriesToUpdate.push({ id, value });
            });

            // entriesToUpdate 배열을 사용하여 jsonDataList를 업데이트합니다.
            updateJsonDataList(entriesToUpdate);
            updateHtmlTable();
            updateChartData(jsonDataList); // 차트를 업데이트할 때 jsonDataList 전체를 전달

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
    let entriesToUpdate = []; // 업데이트할 항목들을 저장할 배열

    rows.forEach((row) => {
        const valueInput = row.querySelector("td:nth-child(2) input");
        const idDiv = row.querySelector("td:nth-child(1) div");
        const id = idDiv.textContent;
        const value = valueInput.value;

        // 업데이트할 항목 정보를 배열에 추가
        entriesToUpdate.push({ id, value });
    });

    // 변경된 항목들로 jsonDataList 업데이트
    updateJsonDataList(entriesToUpdate);

    // 변경된 jsonData로 고급 편집기 업데이트
    renderAdvancedEditor();

    // 수정된 값을 반환
    return entriesToUpdate;
}

// JSON Data 업데이트

function updateJsonDataList(entries) {
    // entries 배열에 있는 모든 항목을 처리합니다.
    entries.forEach((entry) => {
        const index = jsonDataList.findIndex((data) => data.id === entry.id);
        if (index >= 0) {
            // 기존 데이터 업데이트
            jsonDataList[index].value = entry.value;
        } else {
            // 새 데이터 추가
            jsonDataList.push(entry);
        }
    });
}

// 삭제 버튼 이벤트 리스너
function handleDeleteClick(row, idValue, chartInstance) {
    tableBody.removeChild(row);

    const updateData = jsonDataList.findIndex((data) => data.id === idValue);
    if (updateData > -1) {
        jsonDataList.splice(updateData, 1);
    }
    updateChartData(jsonDataList);
    renderAdvancedEditor();
}

function updateChartData(data) {
    // 차트 인스턴스를 업데이트
    const chartInstance = chartFactory();
    chartInstance.setChartData(data);
}

function updateHtmlTable() {
    const tableBody = document.getElementById("tableBody");
    const rows = tableBody.querySelectorAll("tr");

    // jsonDataList의 각 요소에 대해 반복
    jsonDataList.forEach((jsonData) => {
        // ID가 일치하는 행을 찾습니다.
        let rowToUpdate = Array.from(rows).find((row) => {
            const idDiv = row.querySelector("td:nth-child(1) div");
            return idDiv.textContent === jsonData.id;
        });

        // 일치하는 행이 있으면 업데이트
        if (rowToUpdate) {
            const valueInput = rowToUpdate.querySelector(
                "td:nth-child(2) input",
            );
            if (valueInput.value !== jsonData.value) {
                valueInput.value = jsonData.value;
            }
        }
    });
}
