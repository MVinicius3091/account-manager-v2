var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

const ICONS = {
  trash: `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
        <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/>
      </svg>`,
  pencil: `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
        <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/>
      </svg>`,
  dot: `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 128 512" type="button" data-bs-drop="menu" class="drop-list">
        <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/>
      </svg>`,
  restore:`<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
     <path d="M432 64H208c-8.8 0-16 7.2-16 16V96H128V80c0-44.2 35.8-80 80-80H432c44.2 0 80 35.8 80 80V304c0 44.2-35.8 80-80 80H416V320h16c8.8 0 16-7.2 16-16V80c0-8.8-7.2-16-16-16zM0 192c0-35.3 28.7-64 64-64H320c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V192zm64 32c0 17.7 14.3 32 32 32H288c17.7 0 32-14.3 32-32s-14.3-32-32-32H96c-17.7 0-32 14.3-32 32z"/>
    </svg>`
}

function alertMsg(param, classType, text) {
  if(param) {

    let divContanier = document.querySelector('.alert-message');
    let divTextContent = document.querySelector('.alert-message-content');

    divTextContent.innerHTML = text;
    divTextContent.classList.add(`alert-${classType}`);
    divContanier.classList.remove('d-none');
    
    setTimeout(() => {
      divContanier.classList.add('d-none');
      divTextContent.classList.remove(`alert-${classType}`);
    }, 2000);

  }
}

function formatMoney(number, key) {
  
  let length = number.length;

  if (key != 'Backspace') {

    if (length == 1) {
      number = number + ',';
    } else if (length == 4) {
      number = number.replace(`${number[1]}${number[2]}`, `${number[2]}${number[1]}`);
    } else if (length == 5) {
      number = number.replace(`${number[2]}${number[3]}`, `${number[3]}${number[2]}`);
    } else if (length == 6) {
      number = number.replace(`${number[3]}${number[4]}`, `${number[4]}${number[3]}`);
    } 

  } else {

    number = number.slice(0,-1);

    if (length == 7) {
      number = number.replace(`${number[3]}${number[4]}`, `${number[4]}${number[3]}`);
    } else if (length == 6) {
      number = number.replace(`${number[2]}${number[3]}`, `${number[3]}${number[2]}`);
    } else if (length == 5) {
      number = number.replace(`${number[1]}${number[2]}`, `${number[2]}${number[1]}`);
    } else if (length == 3) {
      number = number.slice(0,-1);
    }
  }
  
  return number;
}

function createElement(element, textContent, classContent=null, idContent=null, type=null) {

  let createEl = document.createElement(element);
  (classContent) ? createEl.className = classContent : false;
  (idContent != null) ? createEl.id = idContent : false;
  (type) ? createEl.type = type : false;
  (textContent) ? createEl.innerHTML = textContent : false;

  return createEl;
}

setTimeout(()=>{
  const dropDown = document.querySelectorAll('[data-bs-drop="menu"]'); 
  dropDown.forEach(drop=> drop.addEventListener('click', dropMenu));
},1000);

function dropMenu(drop) {

  let id = drop.currentTarget.parentNode.id;
  let targetElement = drop.currentTarget.parentNode;

  let ul = createElement('ul', '', 'p-0 drop-menu-list position-absolute border border-1 rounded-2 bg-light');
  let trash = createElement('li', ICONS.trash, 'dropdown-item drop-menu-item-list-'+id, id);

  let pencil = createElement('li', ICONS.pencil, 'dropdown-item drop-menu-item-list-'+id, id);

  ul.style.zIndex = '100';
  ul.style.left = '-20px';

  ul.append(pencil, trash);

  let isContent = document.querySelector('.drop-menu-item-list-'+id);

  if (!isContent) {
    document.querySelectorAll('.drop-menu-list') ? 
      document.querySelectorAll('.drop-menu-list').forEach(drop=>drop.remove()) :
      false;

    targetElement.append(ul)
  }
}

document.body.addEventListener('click', (event) => {

  let dropClass = event.target.parentNode.className.baseVal; 
  let dropList = document.querySelectorAll('.drop-menu-list');
  
  if (dropClass) return;

  (dropList) ?
    dropList.forEach(drop=>drop.remove()) :
    false;
});

function generatePdf(title=null, html) {

  let opt = {
    margin:1,
    filename: `${title}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(html).save();

}
