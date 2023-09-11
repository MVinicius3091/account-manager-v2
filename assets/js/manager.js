
const formRegister = document.forms['form-register'];
const formSearch = document.forms['form-search'];
const inputValBill = document.querySelector('input[name="value_bill"]');
const inputNameBill = document.querySelector('input[name="name_bill"]');
const listBill = document.querySelector('.list-bill');
const selectAll = document.querySelector('.select-all-list');
const sumTotalList = document.querySelector('#sum-bill-list');
const btnRegister = document.querySelector('#btn-register');
const btnDeleteAll = document.querySelector('#btn-delete-all-list');
const btnPrint = document.querySelector('#btn-print-list');
const btnSaveHistory = document.querySelector('#btn-save-list-historic');
const btnViewHistory = document.querySelector('#btn-view-list-historic');

let arrBillCreate = [];
let arrSearchBill = [];
let arrHistoryBill = [];

let EDIT = false;
let SEARCH = false;

inputValBill.addEventListener('keydown', setTypeDigits);
btnDeleteAll.addEventListener('click', deleteAllList);
btnPrint.addEventListener('click', printList);
formSearch.addEventListener('submit', searchBillList);
btnSaveHistory.addEventListener('click', saveHistory);

let getBillStorage = JSON.parse(localStorage.getItem('arrBillCreate'));
let getHistoricStorage = JSON.parse(localStorage.getItem('arrHistoryBill'));

if (getBillStorage) {
    getBillStorage.forEach(data => arrBillCreate.push(data));
} 

if (getHistoricStorage) {
    btnViewHistory.classList.remove('d-none');
    getHistoricStorage.forEach(data => arrHistoryBill.push(data));
}

function handleButtonRegister(id=null) {

    if (!EDIT) {

        btnRegister.textContent = 'Cadastrar';
        btnRegister.id = id;
        btnRegister.previousSibling.remove();
        inputValBill.value = '';
        inputNameBill.value = '';
        formRegister.id = 'form-register';

    } else {

        btnRegister.textContent = 'Editar';
        btnRegister.id = id;

        if (!btnRegister.previousSibling) {
            btnRegister.insertAdjacentHTML('beforebegin', '<button class="btn btn-danger btn-sm mx-2" type="button" onclick="javascript:EDIT=false;handleButtonRegister()">Voltar</button>');
        }
        
        formRegister.id = 'form-register-edit';
    }

}

handleButtonRegister();

function setTypeDigits(event) {

    let pressKey = event.key;
    let pressValue = event.target.value;
    let patters = /[0-9]/;

    if (pressKey == 'Enter' || pressKey == 'Tab' || pressKey == ' '|| (pressValue.length > 6 && pressKey != 'Backspace')) {
        event.preventDefault();
        return false;
    }

    if (!patters.test(pressKey)) {
        event.preventDefault();
    }

    event.target.value = formatMoney(pressValue, pressKey);
}

function deleteAllList() {
    let btnConfirm = document.querySelector('#btn-delete-all');

    btnConfirm.addEventListener('click', () => {
        localStorage.removeItem('arrBillCreate');
        arrBillCreate = [];
        alertMsg(true, 'success', 'Lista excluída com sucesso!');
        generateList();
    });
}

function printList() {

    let date = new Date().toLocaleDateString();
    let title = `lista-${date}`;
    let total=0;

    let html = `<html lang="pt-br">
                <head>
                    <meta charset="utf-8">
                </head>
                <style>
                    body{
                        font-family: Arial, Helvetica, sans-serif
                    }
                    
                    .container h3 {
                        text-align: center;
                        margin: 0 auto;
                    }

                    ul {
                        width: 300px;
                        margin: 0 auto;
                        padding: 0;
                    }

                    ul li {
                        list-style: none;
                        border-bottom: solid 1px #000;
                        margin: 5px 0;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        width: 100%;
                        page-break-before: auto;
                        page-break-after: auto; 
                        page-break-inside: avoid;
                        position: relative;
                    }

                </style>
                <body>
                    <div class="container">
                        <h3>Lista de Contas - ${date}</h3>
                        <ul>`;

    if (SEARCH) {

        arrSearchBill.forEach((data, i) => {

            html += `<li>
                        <span align="center">${data.name}</span>
                        <span align="center">R$ ${data.val}</span>
                    </li>`;
    
            total += parseFloat(data.val.replace(',', '.'));
            
        });
        
    } else {

        arrBillCreate.forEach((data, i) => {

            html += `<li>
                        <span>${data.name}</span>
                        <span>R$ ${data.val}</span>
                    </li>`;
    
            total += parseFloat(data.val.replace(',', '.'));
            
        });
    }

    html += `<li>
                <span>Total</span>
                <span>R$ ${String(total.toFixed(2)).replace('.', ',')}</span>
            </li>
            </ul>
                </div>
                    </body>
                        </html>`;
  
    generatePdf(title, html);
}

btnRegister.addEventListener('click', (event) => {
    event.preventDefault();

    let idEdit = event.target.id;
    let formData = new FormData(formRegister);
    let data = Object.fromEntries(formData);

    if (idEdit == 'null') {

        if (!data.name_bill || !data.value_bill) {
            alertMsg(true, 'danger', 'Preencha os campos abaixo!'); 
            return;
        } 
    
        registerNewBill(data);

    } else {

        if (!data.name_bill || !data.value_bill) {
            alertMsg(true, 'danger', 'Preencha os campos abaixo!'); 
            return;
        } 

        editBillContent(data, idEdit);
    }

    inputValBill.value = '';
    inputNameBill.value = '';

});

function searchBillList(event) {
    event.preventDefault();

    let formData = new FormData(event.target);
    let {search} = Object.fromEntries(formData);
    arrSearchBill=[];

    let dataSearch = arrBillCreate.filter((data, i) => {
        if (data.name.includes(search) || data.val.includes(search)){
            return arrSearchBill[i] = data;
        }
    });

    if (dataSearch.length == 0) {
        alertMsg(true, 'danger', 'Nenhuma conta encontrada!');
        event.target[0].value = '';
        return;
    }

    SEARCH = true;
    generateList();

    event.target[0].value = '';
}

function saveHistory() {

    let dateHistory = new Date().toLocaleDateString('pt-BR', {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    let newArrData = [];

    arrBillCreate.forEach(data => newArrData.push(data));

    let newData = {
        currentDate: dateHistory.replace(',', ''),
        data: newArrData
    };

    arrHistoryBill.push(newData);
    btnViewHistory.classList.remove('d-none');

    alertMsg(true, 'success', 'Lista salva no histórico com sucesso!')
    localStorage.setItem('arrHistoryBill', JSON.stringify(arrHistoryBill));
    
}

function registerNewBill(data) {

    let newBill = {
        name: data.name_bill,
        val: data.value_bill
    }

    arrBillCreate.push(newBill);
    localStorage.setItem('arrBillCreate', JSON.stringify(arrBillCreate));

    alertMsg(true, 'success', 'Cadastrado com sucesso!');
    generateList();

}

function editBillContent(data, id) {
    
    let edit = {
        name: data.name_bill,
        val: data.value_bill
    }

    arrBillCreate.forEach((_,i) => {
        if (id == i) {
            arrBillCreate[i] = edit;
        }
    });

    localStorage.setItem('arrBillCreate', JSON.stringify(arrBillCreate));

    alertMsg(true, 'success', 'Conta editada com sucesso!');
    SEARCH=false;

    generateList();

    EDIT=false;

    handleButtonRegister();
}

function generateList() {

    if (arrBillCreate.length == 0) {
        emptyList();
        return;
    }

    if (SEARCH) {
        createHtmlList(arrSearchBill);
    } else {
        createHtmlList(arrBillCreate);
    }

    selectAll.classList.remove('d-none');

    document.querySelector('.empty-list') ? 
        document.querySelector('.empty-list').remove():
        false;
}

function createHtmlList(arrayCurrent) {

    let li='';
    let total=0;

    arrayCurrent.forEach((data, i) => {
        let {name, val} = data;

        li += ` <li class="list-group-item d-flex justify-content-between align-items-center" id="${i}">
                    <div>
                        <span>
                            ${name} - R$ ${val}
                        </span>
                    </div>

                    <div class="col-3">

                        <a href="javascript:void(0)" onclick="editBill(event)" class="position-relative p-2 text-decoration-none"  title="Editar" id="${i}">
                            ${ICONS.pencil}
                        </a>

                        <a href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#deleteBill" class="position-relative p-1" onclick="deleteList(event)" title="Excluir" id="${i}">
                            ${ICONS.trash}
                        </a>

                    </div>

                </li>`;

        total += parseFloat(val.replace(',','.'));

    });

    listBill.innerHTML = li + ` <ul class="list-group">
                                    <li class="list-group-item d-flex justify-content-between align-items-center">
                                        Total - R$ ${total.toFixed(2).replace('.', ',')}
                                    </li>
                                </ul>`;
}

function emptyList() {
    selectAll.classList.add('d-none');
    listBill.innerHTML = '<h3 class="text-center empty-list" >Nenhuma conta cadastrada!</h3>';
}

function editBill(event) {

    let id = event.currentTarget.id;

    arrBillCreate.forEach((data, i) => {
        if (id == i) { 
            inputNameBill.value = data.name;
            inputValBill.value = data.val;
        }
    });

    EDIT=true;
    handleButtonRegister(id);
}

function deleteList(event) {

    let id = event.currentTarget.id;
    let btnDelete = document.querySelector('#btn-delete-bill');
    let getBillsContentLocalStorage = JSON.parse(localStorage.getItem('arrBillCreate'));
  
    btnDelete.addEventListener('click', () => {

        getBillsContentLocalStorage.forEach((_,i) => {
            if (i == id) {
                getBillsContentLocalStorage.splice(id,1);
                return;
            }
        });

        localStorage.setItem('arrBillCreate', JSON.stringify(getBillsContentLocalStorage));

        arrBillCreate = getBillsContentLocalStorage;
        alertMsg(true, 'success', 'Conta excluída com sucesso!');
        SEARCH=false;
        generateList();

    });
}

generateList();
