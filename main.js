function chartFactory() {
    const chart = new Chart();
    chart.init(0, 100);

    return {
        setChartData: function (data) {
            chart.setData(data);
        },
        // 여기에 chart와 관련된 다른 메소드들도 추가할 수 있습니다.
    };
}

let init = function () {
    const chartInstance = chartFactory();
    chartInstance.setChartData(jsonData);
};

document.addEventListener("DOMContentLoaded", function () {
    const addButton = document.querySelector(".add-data__input > button");

    addButton.addEventListener("click", editTable);
});
