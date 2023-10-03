
const divContentList = document.querySelector('.list-content');
const btnPrintHistory = document.querySelector('#btn-print-history');
const selectSearch = document.querySelector('#select-search');
const btnSearch = document.querySelector('#btn-search-history');

btnPrintHistory.addEventListener('click', printListPdf);
btnSearch.addEventListener('click', searchHistory);

let getHistoryStorage = JSON.parse(localStorage.getItem('arrHistoryBill'));
let html = '';

let arrhistory = [];
let arrSearchHistory = [];
let SEARCH = false;

getHistoryStorage.forEach(data=> arrhistory.push(data));

function selectHistoryContent() {

    let options = '<option value="" selected>Selecionar</option>';

    if (SEARCH) {

        arrSearchHistory.forEach(data => {
            let {currentDate} = data;
            options += `<option value="${currentDate.replace(',', '')}">${currentDate.replace(',', '')}</option>`;
        });

    } else {

        arrhistory.forEach(data => {
            let {currentDate} = data;
            options += `<option value="${currentDate.replace(',', '')}">${currentDate.replace(',', '')}</option>`;
        });
    }

    selectSearch.innerHTML = options;

}

selectHistoryContent();

function searchHistory() {

    let search = selectSearch.value;
    arrSearchHistory = [];

    if (search == '') {
        SEARCH = false;
        generateHtmlList();
        selectHistoryContent();
        return
    }

    arrhistory.filter((data,i) => {
        if (data.currentDate.includes(search)) {
            return arrSearchHistory[i] = data;
        }
    });

    selectSearch.value = selectSearch[0];
    SEARCH = true;
    generateHtmlList();
    selectHistoryContent();
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

function generateHtmlList() {
    
    if (SEARCH) {
        getCurrentList(arrSearchHistory);
    } else {
        getCurrentList(arrhistory);
    }
}

function getCurrentList(arrayCurrent) {

    let total = 0;
    html = '';

    arrayCurrent.forEach((dataList, i) => {

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
                        <li class="list-group-item bg-secondary text-light d-flex justify-content-between align-items-center">
                            <span>
                                Data: ${currentDate.replace(',', '')}
                            </span>
                            <div>
                                <span role="button" title="Restaurar" class="me-2" id="${i}" onclick="restoreBill(event)">
                                    ${ICONS.restore}
                                </span>
                                <span role="button" title="Excluir" id="${i}" onclick="deleteHistory(event)"
                                data-bs-toggle="modal" data-bs-target="#deleteHistory">
                                    ${ICONS.trash}
                                </span>
                            </div>
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
    
    divContentList.innerHTML = html;
}

function restoreBill(event) {

    let id = event.currentTarget.id;
    let dataRestore = arrhistory[id].data;

    localStorage.setItem('arrBillCreate', JSON.stringify(dataRestore));

    alertMsg(true, 'success', 'Lista restaurada com sucesso!');
}

function deleteHistory(event) {

    let id = event.currentTarget.id;
    const btnConfirm = document.querySelector('#btn-delete-history');

    btnConfirm.addEventListener('click', () => {
        arrhistory.splice(id,1);
        SEARCH=false;
        alertMsg(true, 'success', 'Lista excluída do histórico com sucesso!');

        generateHtmlList();
        selectHistoryContent();

        localStorage.setItem('arrHistoryBill', JSON.stringify(arrhistory));
    });
}

generateHtmlList();