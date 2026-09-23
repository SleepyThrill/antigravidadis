/**
 * Sistema de Gerenciamento de Perifericos Corsair
 * Modulo JavaScript puro (ES6)
 * Sem frameworks adicionais, sem emojis, com comunicacao via Fetch API
 */

// Configuracao da URL base da API
const API_BASE_URL =
  window.location.port === '3000' || window.location.pathname.startsWith('/api')
    ? '/api/perifericos'
    : 'http://localhost:3000/api/perifericos';

// Elementos do DOM
const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');
const errorState = document.getElementById('errorState');
const errorMessageText = document.getElementById('errorMessageText');
const perifericosGrid = document.getElementById('perifericosGrid');
const itemsCounter = document.getElementById('itemsCounter');

// Botoes principais
const btnNovoPeriferico = document.getElementById('btnNovoPeriferico');
const btnEmptyNovoPeriferico = document.getElementById('btnEmptyNovoPeriferico');
const btnTentarNovamente = document.getElementById('btnTentarNovamente');

// Modal de Formulario
const formModal = document.getElementById('formModal');
const perifericoForm = document.getElementById('perifericoForm');
const modalTitle = document.getElementById('modalTitle');
const btnCloseModal = document.getElementById('btnCloseModal');
const btnCancelModal = document.getElementById('btnCancelModal');
const btnSalvarModal = document.getElementById('btnSalvarModal');

// Campos do Formulario
const perifericoId = document.getElementById('perifericoId');
const inputMarca = document.getElementById('inputMarca');
const inputModelo = document.getElementById('inputModelo');
const inputPreco = document.getElementById('inputPreco');
const inputFoto = document.getElementById('inputFoto');
const feedbackModelo = document.getElementById('feedbackModelo');
const feedbackPreco = document.getElementById('feedbackPreco');
const feedbackFoto = document.getElementById('feedbackFoto');

// Previa de Imagem
const imagePreview = document.getElementById('imagePreview');
const previewPlaceholder = document.getElementById('previewPlaceholder');

// Modal de Exclusao
const deleteModal = document.getElementById('deleteModal');
const deleteTargetName = document.getElementById('deleteTargetName');
const btnCloseDeleteModal = document.getElementById('btnCloseDeleteModal');
const btnCancelDeleteModal = document.getElementById('btnCancelDeleteModal');
const btnConfirmDeleteModal = document.getElementById('btnConfirmDeleteModal');

// Toasts Container
const toastContainer = document.getElementById('toastContainer');

// Variaveis de Estado
let idParaExcluir = null;
let listaPerifericosCache = [];

// Formatador de Moeda Brasileira (R$)
const formatadorMoeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

// ==========================================================================
// FUNCOES DE NOTIFICACAO (TOASTS)
// ==========================================================================
function mostrarToast(mensagem, tipo = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${tipo}`;

  const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  iconSvg.setAttribute('class', 'toast-icon');

  const useElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  useElement.setAttribute('href', tipo === 'success' ? '#icon-check' : '#icon-alert');
  iconSvg.appendChild(useElement);

  const textSpan = document.createElement('span');
  textSpan.className = 'toast-message';
  textSpan.textContent = mensagem;

  toast.appendChild(iconSvg);
  toast.appendChild(textSpan);
  toastContainer.appendChild(toast);

  // Auto remocao apos 4 segundos
  setTimeout(() => {
    toast.style.animation = 'fadeOutRight 0.3s ease forwards';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 4000);
}

// ==========================================================================
// VALIDACAO DE FORMULARIO
// ==========================================================================
function validarUrl(str) {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

function atualizarPreviaImagem(url) {
  if (url && validarUrl(url.trim())) {
    imagePreview.src = url.trim();
    imagePreview.style.display = 'block';
    previewPlaceholder.style.display = 'none';

    imagePreview.onerror = () => {
      imagePreview.style.display = 'none';
      previewPlaceholder.style.display = 'block';
      previewPlaceholder.textContent = 'Nao foi possivel carregar a imagem';
    };

    imagePreview.onload = () => {
      previewPlaceholder.style.display = 'none';
    };
  } else {
    imagePreview.style.display = 'none';
    previewPlaceholder.style.display = 'block';
    previewPlaceholder.textContent = 'A previa da foto aparecera aqui';
  }
}

inputFoto.addEventListener('input', (e) => {
  atualizarPreviaImagem(e.target.value);
});

function limparValidacoes() {
  feedbackModelo.classList.remove('visible');
  feedbackPreco.classList.remove('visible');
  feedbackFoto.classList.remove('visible');
}

function validarCampos() {
  limparValidacoes();
  let valido = true;

  const modeloValor = inputModelo.value.trim();
  if (!modeloValor) {
    feedbackModelo.classList.add('visible');
    valido = false;
  }

  const precoValor = inputPreco.value.trim();
  const precoNum = Number(precoValor);
  if (precoValor === '' || isNaN(precoNum) || precoNum < 0) {
    feedbackPreco.classList.add('visible');
    valido = false;
  }

  const fotoValor = inputFoto.value.trim();
  if (!fotoValor || !validarUrl(fotoValor)) {
    feedbackFoto.classList.add('visible');
    valido = false;
  }

  return valido;
}

// ==========================================================================
// CONTROLE DE MODAIS
// ==========================================================================
function abrirModalCriacao() {
  perifericoId.value = '';
  modalTitle.textContent = 'Cadastrar Periférico';
  btnSalvarModal.textContent = 'Salvar Periférico';
  inputMarca.value = 'Corsair';
  inputModelo.value = '';
  inputPreco.value = '';
  inputFoto.value = '';
  atualizarPreviaImagem('');
  limparValidacoes();
  formModal.classList.add('active');
  inputModelo.focus();
}

function abrirModalEdicao(id) {
  const periferico = listaPerifericosCache.find((p) => p._id === id);
  if (!periferico) return;

  perifericoId.value = periferico._id;
  modalTitle.textContent = 'Editar Periférico';
  btnSalvarModal.textContent = 'Salvar Alterações';
  inputMarca.value = 'Corsair';
  inputModelo.value = periferico.modelo;
  inputPreco.value = periferico.preco;
  inputFoto.value = periferico.foto;
  atualizarPreviaImagem(periferico.foto);
  limparValidacoes();
  formModal.classList.add('active');
  inputModelo.focus();
}

function fecharModalForm() {
  formModal.classList.remove('active');
  limparValidacoes();
}

function abrirModalExclusao(id, nomeModelo) {
  idParaExcluir = id;
  deleteTargetName.textContent = `"${nomeModelo}"`;
  deleteModal.classList.add('active');
}

function fecharModalExclusao() {
  idParaExcluir = null;
  deleteModal.classList.remove('active');
}

// Fechamento de modais com clique fora ou teclado Escape
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    fecharModalForm();
    fecharModalExclusao();
  }
});

formModal.addEventListener('click', (e) => {
  if (e.target === formModal) fecharModalForm();
});

deleteModal.addEventListener('click', (e) => {
  if (e.target === deleteModal) fecharModalExclusao();
});

btnCloseModal.addEventListener('click', fecharModalForm);
btnCancelModal.addEventListener('click', fecharModalForm);
btnCloseDeleteModal.addEventListener('click', fecharModalExclusao);
btnCancelDeleteModal.addEventListener('click', fecharModalExclusao);

btnNovoPeriferico.addEventListener('click', abrirModalCriacao);
btnEmptyNovoPeriferico.addEventListener('click', abrirModalCriacao);
btnTentarNovamente.addEventListener('click', carregarPerifericos);

// ==========================================================================
// RENDERIZACAO DE CARDS SEGURA (SEM XSS)
// ==========================================================================
function criarCardPeriferico(item) {
  const card = document.createElement('div');
  card.className = 'card';
  card.setAttribute('data-id', item._id);

  // Midia / Imagem
  const mediaContainer = document.createElement('div');
  mediaContainer.className = 'card-media';

  const img = document.createElement('img');
  img.className = 'card-image';
  img.alt = item.modelo;
  img.src = item.foto;
  img.loading = 'lazy';

  const fallbackDiv = document.createElement('div');
  fallbackDiv.className = 'card-image-fallback';

  const fallbackIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const fallbackUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  fallbackUse.setAttribute('href', '#icon-image-off');
  fallbackIcon.appendChild(fallbackUse);

  const fallbackText = document.createElement('span');
  fallbackText.textContent = 'Imagem indisponível';

  fallbackDiv.appendChild(fallbackIcon);
  fallbackDiv.appendChild(fallbackText);

  // Tratamento seguro para fotos quebradas
  img.onerror = () => {
    img.style.display = 'none';
    fallbackDiv.style.display = 'flex';
  };

  mediaContainer.appendChild(img);
  mediaContainer.appendChild(fallbackDiv);

  // Conteudo de Texto
  const contentContainer = document.createElement('div');
  contentContainer.className = 'card-content';

  const brandTag = document.createElement('span');
  brandTag.className = 'card-brand-tag';
  brandTag.textContent = item.marca || 'CORSAIR';

  const modelHeading = document.createElement('h3');
  modelHeading.className = 'card-model';
  modelHeading.textContent = item.modelo;

  const priceContainer = document.createElement('div');
  priceContainer.className = 'card-price-container';

  const priceLabel = document.createElement('span');
  priceLabel.className = 'card-price-label';
  priceLabel.textContent = 'Preço';

  const priceValue = document.createElement('span');
  priceValue.className = 'card-price-value';
  priceValue.textContent = formatadorMoeda.format(item.preco);

  priceContainer.appendChild(priceLabel);
  priceContainer.appendChild(priceValue);

  contentContainer.appendChild(brandTag);
  contentContainer.appendChild(modelHeading);
  contentContainer.appendChild(priceContainer);

  // Acoes
  const actionsContainer = document.createElement('div');
  actionsContainer.className = 'card-actions';

  const btnEditar = document.createElement('button');
  btnEditar.className = 'btn btn-secondary btn-sm';
  btnEditar.setAttribute('aria-label', `Editar ${item.modelo}`);

  const editIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  editIcon.setAttribute('class', 'btn-icon');
  const editUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  editUse.setAttribute('href', '#icon-edit');
  editIcon.appendChild(editUse);

  btnEditar.appendChild(editIcon);
  btnEditar.appendChild(document.createTextNode('Editar'));
  btnEditar.addEventListener('click', () => abrirModalEdicao(item._id));

  const btnExcluir = document.createElement('button');
  btnExcluir.className = 'btn btn-danger btn-sm';
  btnExcluir.setAttribute('aria-label', `Excluir ${item.modelo}`);

  const trashIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  trashIcon.setAttribute('class', 'btn-icon');
  const trashUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  trashUse.setAttribute('href', '#icon-trash');
  trashIcon.appendChild(trashUse);

  btnExcluir.appendChild(trashIcon);
  btnExcluir.appendChild(document.createTextNode('Excluir'));
  btnExcluir.addEventListener('click', () => abrirModalExclusao(item._id, item.modelo));

  actionsContainer.appendChild(btnEditar);
  actionsContainer.appendChild(btnExcluir);

  // Montagem do Card
  card.appendChild(mediaContainer);
  card.appendChild(contentContainer);
  card.appendChild(actionsContainer);

  return card;
}

// ==========================================================================
// CONSUMO DA API VIA FETCH
// ==========================================================================

// 1. Listagem de Perifericos
async function carregarPerifericos() {
  loadingState.style.display = 'grid';
  emptyState.style.display = 'none';
  errorState.style.display = 'none';
  perifericosGrid.style.display = 'none';
  perifericosGrid.innerHTML = '';

  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error(`Status de erro ${response.status}`);
    }

    const json = await response.json();
    const dados = json.data || [];
    listaPerifericosCache = dados;

    loadingState.style.display = 'none';

    if (dados.length === 0) {
      emptyState.style.display = 'flex';
      itemsCounter.textContent = '0 periféricos cadastrados';
      return;
    }

    itemsCounter.textContent = `${dados.length} ${
      dados.length === 1 ? 'periférico cadastrado' : 'periféricos cadastrados'
    }`;

    // Renderiza cada card de forma segura
    dados.forEach((item) => {
      const card = criarCardPeriferico(item);
      perifericosGrid.appendChild(card);
    });

    perifericosGrid.style.display = 'grid';
  } catch (error) {
    console.error('Erro ao buscar periféricos da API:', error);
    loadingState.style.display = 'none';
    errorMessageText.textContent =
      'Não foi possível conectar ao servidor para carregar os periféricos. Tente novamente.';
    errorState.style.display = 'flex';
  }
}

// 2. Salvar (Criar ou Atualizar) Periferico
perifericoForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validarCampos()) {
    return;
  }

  const id = perifericoId.value;
  const payload = {
    marca: 'Corsair',
    modelo: inputModelo.value.trim(),
    preco: Number(inputPreco.value.trim()),
    foto: inputFoto.value.trim(),
  };

  btnSalvarModal.disabled = true;
  btnSalvarModal.textContent = 'Salvando...';

  try {
    const isEdit = Boolean(id);
    const url = isEdit ? `${API_BASE_URL}/${id}` : API_BASE_URL;
    const method = isEdit ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Falha ao salvar periférico');
    }

    fecharModalForm();
    mostrarToast(
      isEdit ? 'Periférico atualizado com sucesso.' : 'Periférico cadastrado com sucesso.',
      'success'
    );
    await carregarPerifericos();
  } catch (error) {
    console.error('Erro na operacao de salvar:', error);
    mostrarToast(
      error.message && !error.message.includes('Fetch')
        ? error.message
        : 'Não foi possível salvar as alterações. Tente novamente.',
      'error'
    );
  } finally {
    btnSalvarModal.disabled = false;
    btnSalvarModal.textContent = id ? 'Salvar Alterações' : 'Salvar Periférico';
  }
});

// 3. Excluir Periferico
btnConfirmDeleteModal.addEventListener('click', async () => {
  if (!idParaExcluir) return;

  btnConfirmDeleteModal.disabled = true;
  btnConfirmDeleteModal.textContent = 'Excluindo...';

  try {
    const response = await fetch(`${API_BASE_URL}/${idParaExcluir}`, {
      method: 'DELETE',
    });

    if (!response.ok && response.status !== 204) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Falha ao excluir periférico');
    }

    fecharModalExclusao();
    mostrarToast('Periférico excluído com sucesso.', 'success');
    await carregarPerifericos();
  } catch (error) {
    console.error('Erro ao excluir periférico:', error);
    mostrarToast('Não foi possível excluir o periférico. Tente novamente.', 'error');
  } finally {
    btnConfirmDeleteModal.disabled = false;
    btnConfirmDeleteModal.textContent = 'Excluir Periférico';
  }
});

// Inicializacao
document.addEventListener('DOMContentLoaded', () => {
  carregarPerifericos();
});
