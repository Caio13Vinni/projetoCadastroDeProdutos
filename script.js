const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('tbody');
const sNome = document.querySelector('#m-nome');
const sDescricao = document.querySelector('#m-descricao');
const sValor = document.querySelector('#m-valorProduto');
const btnSalvar = document.querySelector('#botaoSalvar');

let itens = [];
let id;

function openModal(edit = false, index = 0) {
    modal.classList.add('active');

    modal.onclick = e => {
        if (e.target.className.indexOf('modal-container') !== -1) {
            modal.classList.remove('active');
        }
    };

    if (edit) {
        sNome.value = itens[index].nome;
        sDescricao.value = itens[index].descricao;
        sValor.value = itens[index].valor;
        id = index;
    } else {
        sNome.value = '';
        sDescricao.value = '';
        sValor.value = '';
    }
}

function editItem(index) {
    openModal(true, index);
}

function deleteItem(index) {
    itens.splice(index, 1);
    setItensBD();
    loadItens();
}

function toggleDisponibilidade(index) {
    itens[index].disponivel = !itens[index].disponivel;
    setItensBD();
    loadItens();
}

function insertItem(item, index) {
    let tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${item.nome}</td>
      <td>${item.descricao}</td>
      <td>R$ ${item.valor}</td>
      <td>
        <button onclick="toggleDisponibilidade(${index})">${item.disponivel ? 'Sim' : 'Não'}</button>
      </td>
      <td class="acao">
        <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>
      </td>
      <td class="acao">
        <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
      </td>`;

    tbody.appendChild(tr);
}

btnSalvar.onclick = e => {
    e.preventDefault();

    if (sNome.value === '' || sDescricao.value === '' || sValor.value === '') {
        return;
    }

    if (id !== undefined) {
        itens[id].nome = sNome.value;
        itens[id].descricao = sDescricao.value;
        itens[id].valor = sValor.value;
    } else {
        itens.push({
            nome: sNome.value,
            descricao: sDescricao.value,
            valor: sValor.value,
            disponivel: true
        });
    }

    setItensBD();

    modal.classList.remove('active');
    loadItens();
    id = undefined;
};

function loadItens() {
    itens = getItensBD();

    itens.sort((a, b) => parseFloat(a.valor) - parseFloat(b.valor));

    tbody.innerHTML = '';
    itens.forEach((item, index) => {
        insertItem(item, index);
    });
}

const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? [];
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens));

loadItens();
