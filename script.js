/**
 * EcoMetras - Lógica de Validação e Cálculo de CO₂
 * Inclui os modais: Bicicleta/A pé, Ônibus, Motocicleta e Carro
 * Desenvolvido em JavaScript Puro (Vanilla JS)
 */
document.addEventListener('DOMContentLoaded', () => {
  // Elementos do DOM
  const form = document.getElementById('calculatorForm');
  const distanceInput = document.getElementById('distanceInput');
  const validationAlert = document.getElementById('validationAlert');
  const validationText = document.getElementById('validationText');
  const resultCard = document.getElementById('resultCard');
  const resultBadge = document.getElementById('resultBadge');
  const metricValue = document.getElementById('metricValue');
  const monthlyProjection = document.getElementById('monthlyProjection');
  const feedbackBanner = document.getElementById('feedbackBanner');
  const feedbackIcon = document.getElementById('feedbackIcon');
  const feedbackTitle = document.getElementById('feedbackTitle');
  const feedbackMessage = document.getElementById('feedbackMessage');
  const tipText = document.getElementById('tipText');
  const btnReset = document.getElementById('btnReset');

  // Fatores de emissão médios (kg de CO₂ por km por passageiro)
  const EMISSION_FACTORS = {
    bike: 0.000,        // Zero emissão direta
    bus: 0.089,         // Média de transporte público urbano
    motorcycle: 0.095,  // Motocicleta urbana individual a combustão
    car: 0.192          // Carro de passeio individual compacto a gasolina
  };

  /**
   * Exibe alerta amigável de erro na tela
   * @param {string} message - Mensagem a ser exibida
   */
  function showError(message) {
    validationText.textContent = message;
    validationAlert.classList.remove('hidden');
    distanceInput.classList.add('input-error');
    distanceInput.focus();
    resultCard.classList.add('hidden');
  }

  /**
   * Limpa o estado de erro
   */
  function clearError() {
    validationAlert.classList.add('hidden');
    distanceInput.classList.remove('input-error');
  }

  /**
   * Formata número no padrão brasileiro (ex: 1,50)
   * @param {number} value
   * @returns {string}
   */
  function formatNumber(value) {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  /**
   * Processa o envio do formulário de cálculo
   * @param {Event} e
   */
  function handleFormSubmit(e) {
    e.preventDefault();
    clearError();

    const rawValue = distanceInput.value.trim();

    // 1. Validação: Campo vazio
    if (!rawValue) {
      showError('Por favor, informe a distância percorrida por dia.');
      return;
    }

    const distance = parseFloat(rawValue.replace(',', '.'));

    // 2. Validação: Não aceita números negativos, zero ou inválidos
    if (isNaN(distance) || distance <= 0) {
      showError('A distância precisa ser um número maior que zero.');
      return;
    }

    // 3. Captura do modal de transporte selecionado
    const selectedRadio = document.querySelector('input[name="transportMode"]:checked');
    if (!selectedRadio) {
      showError('Por favor, selecione um meio de transporte para continuar.');
      return;
    }

    const transportMode = selectedRadio.value;
    const factor = EMISSION_FACTORS[transportMode] ?? 0;

    // Cálculo das emissões: Diária e Mensal (considerando 22 dias úteis de deslocamento)
    const dailyEmission = distance * factor;
    const monthlyEmission = dailyEmission * 22;

    // Atualização dos valores métricos
    metricValue.textContent = formatNumber(dailyEmission);
    monthlyProjection.innerHTML = `Aproximadamente <strong>${formatNumber(monthlyEmission)} kg</strong> de CO₂ por mês (22 dias úteis).`;

    // Reset de classes prévias de status
    resultCard.classList.remove('status-eco', 'status-moderate', 'status-medium', 'status-high');
    resultBadge.classList.remove('eco', 'moderate', 'medium', 'high');

    // Customização do cartão de acordo com o modal selecionado
    if (transportMode === 'bike') {
      resultCard.classList.add('status-eco');
      resultBadge.classList.add('eco');
      resultBadge.textContent = 'Zero Emissão 🌱';
      feedbackBanner.style.backgroundColor = 'var(--success-bg)';
      feedbackBanner.style.borderColor = 'var(--success-border)';
      feedbackIcon.textContent = '🚲';
      feedbackTitle.textContent = 'Excelente escolha sustentável!';
      feedbackMessage.textContent = 'Seu deslocamento não gera poluentes atmosféricos e ainda contribui diretamente para a sua saúde física e condicionamento.';
      tipText.textContent = 'Mantenha pneus calibrados e use sempre equipamentos de proteção. Você inspira uma mobilidade muito mais limpa!';
    } else if (transportMode === 'bus') {
      resultCard.classList.add('status-moderate');
      resultBadge.classList.add('moderate');
      resultBadge.textContent = 'Impacto Moderado 🍃';
      feedbackBanner.style.backgroundColor = 'var(--warning-bg)';
      feedbackBanner.style.borderColor = 'var(--warning-border)';
      feedbackIcon.textContent = '🚌';
      feedbackTitle.textContent = 'Ótima opção coletiva!';
      feedbackMessage.textContent = 'O transporte público distribui as emissões entre dezenas de passageiros, emitindo consideravelmente menos por pessoa do que um veículo individual.';
      tipText.textContent = 'Se o seu trajeto for menor que 1,5 km, experimente fazer alguns trechos a pé ou de bicicleta para zerar as emissões do dia!';
    } else if (transportMode === 'motorcycle') {
      resultCard.classList.add('status-medium');
      resultBadge.classList.add('medium');
      resultBadge.textContent = 'Impacto Médio 🛵';
      feedbackBanner.style.backgroundColor = 'var(--medium-bg)';
      feedbackBanner.style.borderColor = 'var(--medium-border)';
      feedbackIcon.textContent = '🏍️';
      feedbackTitle.textContent = 'Consumo menor que o carro!';
      feedbackMessage.textContent = 'A motocicleta consome menos combustível e emite cerca de metade do CO₂ em comparação a um carro de passeio, mas ainda gera emissões individuais por combustão fóssil.';
      tipText.textContent = 'Mantenha a calibragem dos pneus e a regulagem do motor em dia para otimizar o consumo. Em trajetos curtos, considere alternativas ativas!';
    } else if (transportMode === 'car') {
      resultCard.classList.add('status-high');
      resultBadge.classList.add('high');
      resultBadge.textContent = 'Alto Impacto ⚠️';
      feedbackBanner.style.backgroundColor = 'var(--error-bg)';
      feedbackBanner.style.borderColor = 'var(--error-border)';
      feedbackIcon.textContent = '🚗';
      feedbackTitle.textContent = 'Atenção à sua pegada de carbono!';
      feedbackMessage.textContent = 'Carros individuais a combustão são os principais vilões urbanos na emissão de gases do efeito estufa em trajetos cotidianos.';
      tipText.textContent = 'Que tal organizar caronas solidárias com amigos ou migrar para o transporte coletivo/bicicleta alguns dias por semana?';
    }

    // Exibe o cartão de resultado e dispara a animação CSS suave
    resultCard.classList.remove('hidden');
    resultCard.style.animation = 'none';
    void resultCard.offsetHeight; // Força reflow no navegador
    resultCard.style.animation = 'slideUpFadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards';

    // Rolagem suave até o resultado em telas de celular
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * Reseta os campos e esconde os resultados
   */
  function handleReset() {
    form.reset();
    clearError();
    resultCard.classList.add('hidden');
    distanceInput.focus();
  }

  // Ouvintes de Eventos
  form.addEventListener('submit', handleFormSubmit);
  btnReset.addEventListener('click', handleReset);

  // Limpeza dinâmica do alerta ao digitar
  distanceInput.addEventListener('input', () => {
    if (!validationAlert.classList.contains('hidden')) {
      clearError();
    }
  });
});
