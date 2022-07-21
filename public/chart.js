function myFunction(value){
    //if a new value is passed in, then add it to the array
    let timeDay = new Date();
    document.getElementById('inputText').value = '';
    let timeEl = timeDay.toLocaleString('default', { month: 'long' }) +"-"+ timeDay.getFullYear() + "-"+ timeDay.getHours() + ":" + timeDay.getMinutes() + ":" + timeDay.getSeconds();
    addData(chart, timeEl, value);
}
function addData(chart, label, data) {
    let previousNumber = chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1];
    if(data != previousNumber){
        if(chart.data.datasets[0].data.length == 10){
            console.log('it has reached the limit');
            chart.data.datasets[0].data.shift();
            chart.data.labels.shift();
            chart.data.datasets[0].data.push(data);
            chart.data.labels.push(label);
            chart.update();
            console.log(chart.data.datasets[0].data.length);
            console.log(chart.data.datasets[0].data);
            console.log('label length is: '+chart.data.labels.length);
        }else{
            chart.data.labels.push(label);
            chart.data.datasets[0].data.push(data);
            chart.update();
            console.log(chart.data.datasets[0].data.length);
            console.log(chart.data.datasets[0].data);
        }
    }
}
const data = {
    labels: [],
    datasets: [{
        label: 'Monthly dataset',
        data: [],
        backgroundColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ],
        borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
        ],
    }]
};
const config = {
    type: 'bar',
    data: data,
    options: {
        scales: {
            y: {
              beginAtZero: true
            }
        }
    }
};
const chart = new Chart(
    document.getElementById('myChart'),
    config
);

