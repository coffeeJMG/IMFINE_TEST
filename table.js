// table과 고급 편집 텍스트 관리 js 파일

// 테이블 동적 생성 함수
function editTable(updateData) {
    const tableBody = document.getElementById("tableBody");
    const idValue = updateData
        ? updateData.id
        : document.querySelector(".add-data__input-ID").value;
    const scoreValue = updateData
        ? updateData.value
        : document.querySelector(".add-data__input-VALUE").value;
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
}

// 테이블 데이터 추가 함수
function addToJsonData(id, value) {
    const updatedDataList = [...globalState.getData()];
    let newEntry = {
        id: id,
        value: value,
    };
    updatedDataList.push(newEntry);
    globalState.updateData(updatedDataList);
}

// 테이블 데이터 추가 시 고급 편집 엘리먼트 생성
function renderAdvancedEditor() {
    const updatedDataList = [...globalState.getData()];
    const advancedEditor = document.querySelector(".advanced-editor__bracket");
    const jsonDataBox = document.createElement("div"); // 데이터를 표시할 div 생성
    jsonDataBox.className = "advanced-editor__content";

    updatedDataList.forEach((data) => {
        const updatedDataList = document.createElement("p");
        updatedDataList.className = "advanced-editor__text";
        updatedDataList.innerHTML = `{
            &nbsp;&nbsp;&nbsp;&nbsp;"id" : <span class="advanced-editor__editable-id">${data.id}</span>,
            &nbsp;&nbsp;&nbsp;&nbsp;"value": <span class="advanced-editor__editable-value">${data.value}</span>
        },`;
        jsonDataBox.appendChild(updatedDataList);
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

            console.log(entriesToUpdate);
            editTableValues(entriesToUpdate);
            globalState.updateData(entriesToUpdate);
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
        console.log(id, value, "데이터 수정 시에 선택되는 아이디밸류");
    });

    // 변경된 항목들로 jsonDataList 업데이트
    globalState.updateData(entriesToUpdate);

    // 변경된 jsonData로 고급 편집기 업데이트
    renderAdvancedEditor();

    return entriesToUpdate;
}

// 삭제 버튼 이벤트 리스너
function handleDeleteClick(row, idValue) {
    const updatedDataList = [...globalState.getData()];
    tableBody.removeChild(row);

    const updateData = updatedDataList.findIndex((data) => data.id === idValue);
    if (updateData > -1) {
        updatedDataList.splice(updateData, 1);
    }
    globalState.updateData(updatedDataList);
    renderAdvancedEditor();
}
