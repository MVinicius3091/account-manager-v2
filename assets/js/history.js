
const divContentList = document.querySelector('.list-content');
const btnPrintHistory = document.querySelector('#btn-print-history');
const selectSearch = document.querySelector('#select-search');
const btnSearch = document.querySelector('#btn-search-history');

btnPrintHistory.addEventListener('click', printListPdf);
btnSearch.addEventListener('click', searchHistory);

let getHistoryStorage = JSON.parse(localStorage.getItem('arrHistoryBill'));
let html = '';

let options = '<option value="" selected>Selecionar</option>';
let arrhistory = [];
let arrSearchHistory = [];

getHistoryStorage.forEach(data=> arrhistory.push(data));

arrhistory.reverse();

arrhistory.forEach(data => {
    let {currentDate} = data;
    options += `<option value="${currentDate.replace(',', '')}">${currentDate.replace(',', '')}</option>`;
});

selectSearch.innerHTML = options;

function searchHistory() {

    let search = selectSearch.value;
    arrSearchHistory = [];

    if (search == '') {
        generateHtmlList(arrhistory);
        return
    };

    let list = arrhistory.filter(data => data.currentDate.includes(search));

    arrSearchHistory = list; 
    generateHtmlList(arrSearchHistory);
}

function printListPdf() {

    let date = new Date().toLocaleDateString();
    let title = `histórico-${date}`;
    let htmlGenerate = `<div class="m-auto">
                            <h3 class="text-center">Histórico - ${date}</h3>
                        </div>
                        ${html}`;

    generatePdf(title, htmlGenerate);
}

function generateHtmlList(arrayCurrent) {

    
    let total = 0;
    html = '';
    
    arrayCurrent.forEach(dataList => {

        let {currentDate, data} = dataList;
        total = 0;

        html += `<style>
                    ul.list-group.mt-3 {
                        page-break-before: auto;
                        page-break-after: auto; 
                        page-break-inside: avoid;
                        position: relative;
                    }
                </style>

                <ul class="list-group mt-3">

                    <ul class="list-group">
                        <li class="list-group-item bg-secondary text-light">
                            Data: ${currentDate.replace(',', '')}
                        </li>
                    </ul>
                    
                    ${data.map(data => {
                        total+= parseFloat(data.val.replace(',', '.'))

                        return `<li class="list-group-item list-date">
                                    ${data.name} - R$ ${data.val}
                                </li>`; 
                    }).join('')}

                    <li class="list-group-item">Total R$ ${total.toFixed(2).replace('.', ',')}</li>
                </ul>`;
    });
    
    console.log(total);
    divContentList.innerHTML = html;
}

generateHtmlList(arrhistory);