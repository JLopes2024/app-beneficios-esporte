// ==========================================
// LÓGICA DE NEGÓCIO E DIRETRIZES
// ==========================================

export const atividadesIntensas = ['treino_intenso', 'treino_choque', 'treino_potencia', 'treino_lpo'];

export const formatarDataBr = (dataIso) => {
  if (!dataIso) return '';
  const [ano, mes, dia] = dataIso.split('-');
  return `${dia}/${mes}/${ano}`;
};

export const gerarRecomendacao = (experiencia, dorArticular, frequencia, horasTrabalho, horasEstudo, horasTransito, horasSono, energiaHoje, dorMuscular) => {
  if (dorArticular === 'sim') return "⚠️ ALERTA CLÍNICO: Necessária liberação médica prévia. O foco deve ser estritamente em estabilidade articular. Treinos com carga bloqueados no planner.";

  const totalOcupado = Number(horasTrabalho) + Number(horasEstudo) + Number(horasTransito);
  
  let prescricaoBase = experiencia === 'iniciante' 
    ? `✅ Adaptação Anatômica (${frequencia}): Foco na visuoconstrução e praxia (controle consciente).` 
    : (experiencia === 'avancado' ? `🔥 Alta Intensidade (${frequencia}): Repertório automatizado na memória não declarativa. Novas modalidades avançadas desbloqueadas no planner.` : `⚡ Transição (${frequencia}): Refinamento biomecânico.`);

  if (horasSono < 6) prescricaoBase += " 📉 Atenção: Privação severa de sono detectada. Sistema nervoso central sobrecarregado.";
  if (totalOcupado > 14) prescricaoBase += ` ⏱️ Alerta: Use treinos Express (máx 40 min) devido à alta ocupação de tempo.`;
  
  if (energiaHoje === 'baixa') prescricaoBase += " 🔋 Ajuste: Reduza a complexidade motora hoje devido à baixa energia.";
  if (dorMuscular === 'intensa') prescricaoBase += " 🩹 Recuperação: Dor muscular limitante. Sessões intensas bloqueadas temporariamente.";

  return prescricaoBase;
};

export const obterOpcoesDisponiveis = (experiencia, dorArticular, dorMuscular, energiaHoje, horasSono) => {
  const opcoesRecuperativas = [
    { valor: '', rotulo: 'Selecione a atividade...' },
    { valor: 'descanso', rotulo: '💤 Descanso Absoluto' },
    { valor: 'fisioterapia', rotulo: '🩹 Fisioterapia / Reabilitação' },
    { valor: 'mobilidade', rotulo: '🧘 Mobilidade / Alongamento' },
    { valor: 'caminhada', rotulo: '🚶 Caminhada Leve' }
  ];

  if (dorArticular === 'sim' || dorMuscular === 'intensa') return opcoesRecuperativas;

  let opcoesTreino = [ ...opcoesRecuperativas, { valor: 'treino_adaptacao', rotulo: '🏋️ Treino Base (Controle Motor)' } ];

  if (energiaHoje === 'baixa' || horasSono < 6) return opcoesTreino;

  opcoesTreino.push({ valor: 'treino_intenso', rotulo: '🔥 Alta Intensidade Tradicional' });

  if (experiencia === 'avancado') {
    opcoesTreino.push(
      { valor: 'treino_choque', rotulo: '⚡ Método de Choque / Falha' },
      { valor: 'treino_potencia', rotulo: '🚀 Potência e Pliometria' },
      { valor: 'treino_lpo', rotulo: '🏋️ LPO / Levantamento Olímpico' }
    );
  }
  return opcoesTreino;
};

export const gerarBriefing = (planner, experiencia, dorArticular, dorMuscular, horasSono, horasTrabalho, horasEstudo) => {
  let intensos = 0, base = 0, recuperativos = 0, sessoesAgendadas = 0;
  
  planner.forEach(sessao => {
    if (sessao.atividade && sessao.data) sessoesAgendadas++;
    if (atividadesIntensas.includes(sessao.atividade)) intensos++;
    if (sessao.atividade === 'treino_adaptacao') base++;
    if (['descanso', 'fisioterapia', 'mobilidade'].includes(sessao.atividade)) recuperativos++;
  });

  if (sessoesAgendadas === 0) return "Nenhuma sessão com data planejada ainda.";
  
  let analise = `Sistema configurado para ${sessoesAgendadas} sessões agendadas. `;
  
  if ((dorArticular === 'sim' || dorMuscular === 'intensa') && (intensos > 0 || base > 0)) {
     return "🛑 CONFLITO GRAVE: Restrição física ativa mapeada, mas existem treinos de carga agendados.";
  }

  if (experiencia !== 'avancado' && intensos > 0 && planner.some(s => ['treino_choque', 'treino_potencia', 'treino_lpo'].includes(s.atividade))) {
    return "⚠️ NÍVEL INCOMPATÍVEL: Treinos avançados (LPO/Pliometria) agendados sem perfil avançado.";
  }

  if (intensos > 3 && (horasSono < 6 || (Number(horasTrabalho) + Number(horasEstudo) > 12))) {
    analise += "⚠️ RISCO DE OVERTRAINING: Sua rotina consome muita energia mental e física.";
  } else if (intensos > 0 && recuperativos === 0) {
    analise += "⚠️ DÉFICIT DE RECUPERAÇÃO detectado.";
  } else {
    analise += "✅ Protocolo seguro e validado para exportação.";
  }
  
  return analise;
};

export const gerarLinkAgenda = (rotuloAtividade, dataIso, horario) => {
  const titulo = encodeURIComponent(`🏋️ ${rotuloAtividade}`);
  const detalhes = encodeURIComponent(`Sessão prescrita pelo app.`);
  const startData = dataIso.replace(/-/g, '');
  const startHora = horario.replace(':', '');
  const startTime = `${startData}T${startHora}00`;
  const [h, m] = horario.split(':');
  const endHora = String(parseInt(h) + 1).padStart(2, '0') + m;
  const endTime = `${startData}T${endHora}00`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titulo}&details=${detalhes}&dates=${startTime}/${endTime}`;
};
export const calcularDisponibilidadeNeuromuscular = (estresse, sonoAtual, sonoIdeal, motivacao) => {
  const deficitSono = sonoIdeal - sonoAtual;
  let pontuacao = 0;

  // Pontuação de Risco
  if (estresse > 7) pontuacao += 3;
  if (deficitSono > 2) pontuacao += 3;
  if (motivacao === 'baixa') pontuacao += 2;

  if (pontuacao >= 5) return { status: 'CRÍTICO', treinoRecomendado: 'Recuperação Ativa', cor: '#e53e3e' };
  if (pontuacao >= 3) return { status: 'ATENÇÃO', treinoRecomendado: 'Volume Moderado', cor: '#dd6b20' };
  return { status: 'NORMAL', treinoRecomendado: 'Carga Total', cor: '#3182ce' };
};
