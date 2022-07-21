const rangeValues = ['currSensorReading','voltageSensorReading','powerConsumptionReading','motorSpeedReading'];
const vvvalues = ['currSensorRead','voltageSensorRead','powerConsumptionRead','motorSpeedRead'];
const rangeLabels = ['currSensor', 'voltageSensor', 'powerConsumption', 'motorSpeed'];
var rangeValuesArray = [];
// these are the values that do not use the gauge library to display the data
const nonRange = ['pumpOnReading', 'relayOnReading', 'isBoardOnReading', 'uss1Reading', 'uss2Reading', 'uss3Reading', 'motorTempReading'];
const nonRangeLabels = ['isPumpOn', 'isRelayOn', 'isBoardOn', 'uss1', 'uss2', 'uss3', 'motorTemp'];
const data = {
    labels: [],
    datasets: [{
        type: 'bar',
        label: 'Energy Meter Power Consumption plot (W)',
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
    },{
        type: 'line',
        label: 'Energy Meter Power Consumption plot (W)',
        data: [],
    }]
};
const config = {
    // type: 'bar',
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
const firebaseData = database.ref("meter/");
setInterval(function () {
    var tankdivs = document.querySelectorAll(".tank");
    firebaseData.on("value", function (snapshot) {
        var data = snapshot.val();
        Object.keys(data).forEach(function (key) {
            if (rangeLabels.includes(key)) {
                rangeValuesArray.push(data[key]);
                if(key == 'powerConsumption'){
                    addData(chart, data[key]);
                }
            } else if (nonRangeLabels.includes(key)) {
                if(key == 'isPumpOn'){
                    if(data[key] == true){
                        document.getElementById('pumpOnReading').innerHTML = 'Pump is On';
                        document.getElementById('pumpCheck').checked = true;
                    }
                    else if(data[key] == false){
                        document.getElementById('pumpOnReading').innerHTML = 'Pump is Off';
                        document.getElementById('pumpCheck').checked = false;
                    }
                } else if(key == 'isRelayOn'){
                    if(data[key] == true){
                        document.getElementById('relayOnReading').innerHTML = 'Relay is On';
                        document.getElementById('relayCheck').checked = true;
                    }
                    else if(data[key] == false){
                        document.getElementById('relayOnReading').innerHTML = 'Relay is Off';
                        document.getElementById('relayCheck').checked = false;
                    }
                }else if (key == 'uss1') {
                    // fetch the tank divs and update the value of background position
                    document.getElementById('uss1Reading').innerHTML = data[key];
                    console.log('uss1: '+data[key]);
                    tankdivs[0].style.backgroundPosition = "0px " + (data[key] +50)+ "px";
                }
                else if (key == 'uss2') {
                    document.getElementById('uss2Reading').innerHTML = data[key];
                    console.log('uss2: ' + data[key]);
                    tankdivs[1].style.backgroundPosition = "0px "+ (data[key] + 100)+"px";
                }
                else if (key == 'uss3') {
                    document.getElementById('uss3Reading').innerHTML = data[key];
                    console.log('uss3: '+data[key]);
                    tankdivs[2].style.backgroundPosition = "0px "+( data[key] +20)+ "px";
                }
                else{
                    document.getElementById(nonRange[nonRangeLabels.indexOf(key)]).innerHTML = data[key];
                }
            }
        });
        rangeValuesArray.forEach(function (value, index) {
            var newVal = Math.floor(((value/500) * 179) + 1);
            // console.log('New value is' +newVal + " for " + vvvalues[index]);
            // console.log('Old value is' +rangeValuesArray[index] + '\n');
            document.getElementById(rangeValues[index]).innerHTML = value;
            document.getElementById(rangeValues[index]).style.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
            $('.'+ vvvalues[index]).attr({
                style: '-webkit-transform: rotate(' + newVal + 'deg);' +
                    '-moz-transform: rotate(' + newVal + 'deg);' +
                    'transform: rotate(' + newVal + 'deg);'
            });
        });
    }, (error) => {
        console.log("Error: " + error.code);
    });
    rangeValuesArray = [];
}, 3000);
function addData(chart, data) {
    let timeDay = new Date();
    let label = timeDay.toLocaleString('default', { month: 'long' }) +"-"+ timeDay.getFullYear() + "-"+ timeDay.getHours() + ":" + timeDay.getMinutes() + ":" + timeDay.getSeconds();
    let previousNumber = chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1];
    if(data != previousNumber){
        if(chart.data.datasets[0].data.length == 10){
            console.log('it has reached the limit');
            chart.data.datasets[0].data.shift();
            chart.data.labels.shift();
            chart.data.datasets[0].data.push(data);
            chart.data.labels.push(label);
            chart.update();
        }else{
            chart.data.labels.push(label);
            chart.data.datasets[0].data.push(data);
            chart.update();
        }
    }
}