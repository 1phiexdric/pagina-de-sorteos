window.addEventListener('load', ()=>{
    const saveTheme = localStorage.getItem('tema') || 'ligth'
    if(saveTheme == 'dark-mode'){
        document.body.classList.add('dark-mode')
        document.getElementById('theme-img').src = './img/sun.svg'
    }
    init()});

function init() {
    // Elementos del DOM
    const wheel = document.getElementById('wheel');
    const spinBtn = document.getElementById('spin-btn');
    const finalWinner = document.getElementById('final-winner');
    const div1 = document.querySelector('.sorteo.div1');
    const form = document.querySelector("#ruleta_form");
    const changeThemebtn = document.getElementById('theme-change');
    let parrafo = document.createElement('p');
    let myChart;
    let elementos = [
        "Pedro", "Santiago", "el Anciano", "Juan", "Andrés", "Bartolomé",
        "Santiago", "el Menor", "Judas Iscariote", "Judas Tadeo", "Mateo",
        "Felipe", "Simón", "Tomás"
    ];

    generarRuleta(elementos);

    form.addEventListener('submit', handleFormSubmit);
    spinBtn.addEventListener('click', spinWheel);
    changeThemebtn.addEventListener('click', changeTheme);
    window.addEventListener('resize', updateFontSize);

    function handleFormSubmit(event) {
        event.preventDefault();
        const participantes = document.getElementById("personas").value;
        elementos = participantes.split("\n").filter(e => e.trim() !== "");
        if (elementos.length !== 0) {
            generarRuleta(elementos);
            cleanMessage();
        } else {
            showMessage("Introdusca los participantes");
        }
    }

    function showMessage(msg) {
        parrafo.innerHTML = `<span style="color: red; margin: auto">${msg}</span>`;
        if (!div1.contains(parrafo)) div1.appendChild(parrafo);
    }

    function cleanMessage() {
        if (div1.contains(parrafo)) div1.removeChild(parrafo);
        parrafo.innerHTML = "";
    }

    function generarRuleta(elementos) {
        if (myChart) myChart.destroy();
        const data = elementos.map(() => 1);
        const colores = elementos.map(() => randomColor());

        myChart = new Chart(wheel, {
            plugins: [ChartDataLabels],
            type: "pie",
            data: {
                labels: elementos,
                datasets: [{ backgroundColor: colores, data }]
            },
            options: getChartOptions()
        });
    }

    function getChartOptions() {
        return {
            responsive: true,
            animation: { duration: 0 },
            plugins: {
                tooltip: false,
                legend: { display: false },
                datalabels: {
                    color: "#fff",
                    formatter: (_, context) => {
                        const label = context.chart.data.labels[context.dataIndex];
                        const maxLength = 10; // número máximo de caracteres visibles
                        return label.length > maxLength ? label.slice(0, maxLength - 1) + '…' : label;
                    },
                    font: { size: getLabelFontSize() },
                    align: 'end',
                    rotation: (context) => {
                        const chart = context.chart;
                        const meta = chart.getDatasetMeta(0);
                        const sector = meta.data[context.dataIndex];
                        const angle = (sector.startAngle + sector.endAngle) / 2;
                        return (angle * 180 / Math.PI);
                    }
                }
            }
        };
    }

    function spinWheel() {
        spinBtn.disabled = true;
        finalWinner.innerHTML = `<p>Buena Suerte!</p>`;
        let count = 0;
        let resultValue = 101;
        const randomDegree = Math.floor(Math.random() * 356);

        const rotationInterval = setInterval(() => {
            myChart.options.rotation += resultValue;
            myChart.update();

            if (myChart.options.rotation >= 360) {
                count += 1;
                resultValue -= 5;
                myChart.options.rotation = 0;
            } else if (count > 15 && myChart.options.rotation === randomDegree) {
                clearInterval(rotationInterval);
                finalWinner.innerHTML = `<p>Felicitaciones</p>`;
                spinBtn.disabled = false;
            }
        }, 10);
    }

    function updateFontSize() {
        if (myChart) {
            myChart.options.plugins.datalabels.font.size = getLabelFontSize();
            myChart.update();
        }
    }
}

function getLabelFontSize() {
    const width = window.innerWidth;
    if (width <= 480) return 10;
    if (width <= 768) return 12;
    return 16;
}

function randomColor() {
    let color = '#';
    const simbolos = '0123456789ABCDEF';
    for (let i = 0; i < 6; i++) {
        color += simbolos[Math.floor(Math.random() * 16)];
    }
    return color;
}

function changeTheme() {
    const img = document.getElementById('theme-img');
    const body = document.body;
    body.classList.toggle('dark-mode');
    
    if(body.classList.contains('dark-mode')){
        img.src = './img/sun.svg'
        localStorage.setItem('tema', 'dark-mode')
    }else{
        img.src = './img/moon.svg'
        localStorage.setItem('tema', 'ligth')
    }
}
