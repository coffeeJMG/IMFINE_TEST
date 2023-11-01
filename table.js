function editTable() {
    const tableBody = document.getElementById("tableBody");

    const idValue = document.querySelector(".add-data__input-ID").value;
    const scoreValue = document.querySelector(".add-data__input-VALUE").value;

    addToJsonData(idValue, scoreValue);
    const chartInstance = chartFactory();
    chartInstance.setChartData(jsonData);
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

    deleteBtn.addEventListener("click", function () {
        // 해당 행을 삭제
        tableBody.removeChild(row);

        // jsonData 배열에서 해당 항목 제거
        const updateData = jsonData.findIndex((data) => data.id === idValue);
        if (updateData > -1) {
            jsonData.splice(updateData, 1);
        }
        chartInstance.setChartData(jsonData);
        // 필요에 따라 추가적인 렌더링 함수나 로직 호출
        renderAdvancedEditor();
    });

    deleteCell.appendChild(deleteBtn);

    row.appendChild(idCell);
    row.appendChild(valueCell);
    row.appendChild(deleteCell);

    tableBody.appendChild(row);

    renderAdvancedEditor();
}

let jsonData = [];

function addToJsonData(id, value) {
    let newEntry = {
        id: id,
        value: value,
    };
    jsonData.push(newEntry);
}

function renderAdvancedEditor() {
    const advancedEditor = document.querySelector(".advanced-editor");
    const jsonDataDisplay = document.createElement("div"); // 데이터를 표시할 div 생성
    jsonDataDisplay.className = "jsonData-display";

    jsonData.forEach((data) => {
        const dataLine = document.createElement("p"); // 각 데이터 아이템을 위한 p 엘리먼트
        dataLine.innerText = `ID: ${data.id}, Value: ${data.value}`;
        jsonDataDisplay.appendChild(dataLine);
    });

    // 기존에 추가된 jsonDataDisplay 삭제 (중복 방지)
    const oldDisplay = advancedEditor.querySelector(".jsonData-display");
    if (oldDisplay) {
        advancedEditor.removeChild(oldDisplay);
    }

    advancedEditor.appendChild(jsonDataDisplay);
}
