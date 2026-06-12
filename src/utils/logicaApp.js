// ==========================================
// LÓGICA DE NEGÓCIO E DIRETRIZES
// ==========================================

export const atividadesIntensas = ['treino_intenso', 'treino_choque', 'treino_potencia', 'treino_lpo'];

export const formatarDataBr = (dataIso) => {
  if (!dataIso) return '';
  const [ano, mes, dia] = dataIso.split('-');
  return `${dia}/${mes}/${ano}`;
};

export const calcularDisponibilidadeNeuromuscular = (estresse, sonoAtual, sonoIdeal, motivacao) => {
  const deficitSono = sonoIdeal - sonoAtual;
  let pontuacao = 0;

  if (Number(estresse) > 7) pontuacao += 3;
  if (deficitSono > 2) pontuacao += 3;
  if (motivacao === 'baixa') pontuacao += 2;

  if (pontuacao >= 5) return { status: 'MUITO BAIXO (Risco de lesão)', treinoRecomendado: 'Descanso Ativo', cor: '#e53e3e' };
  if (pontuacao >= 3) return { status: 'MODERADO (Atenção)', treinoRecomendado: 'Treino Leve', cor: '#dd6b20' };
  return { status: 'ALTO (Pronto para treinar)', treinoRecomendado: 'Treino Completo', cor: '#3182ce' };
};

export const gerarRecomendacao = (experiencia, dorArticular, frequencia, horasTrabalho, horasEstudo, horasTransito, horasSono, energiaHoje, dorMuscular) => {
  if (dorArticular === 'sim') return "⚠️ ALERTA: É necessário consultar um médico. Foco apenas em melhorar a mobilidade, sem pegar peso. Treinos pesados estão bloqueados para sua segurança.";

  const totalOcupado = Number(horasTrabalho) + Number(horasEstudo) + Number(horasTransito);
  
  let prescricaoBase = experiencia === 'iniciante' 
    ? `✅ Início (${frequencia}): Foco total em aprender a fazer o exercício certinho, prestando atenção em cada movimento.` 
    : (experiencia === 'avancado' ? `🔥 Fase Avançada (${frequencia}): Como os movimentos já estão no automático para você, o foco agora é aumentar o desafio e o esforço.` : `⚡ Evolução (${frequencia}): Melhorar a postura e a qualidade da execução.`);

  if (horasSono < 6) prescricaoBase += " 📉 Atenção: Você dormiu muito pouco. Seu corpo e sua mente estão esgotados.";
  if (totalOcupado > 14) prescricaoBase += ` ⏱️ Alerta: Seu dia está muito corrido. Prefira treinos rápidos (no máximo 40 minutos).`;
  
  if (energiaHoje === 'baixa') prescricaoBase += " 🔋 Ajuste: Como você está com pouca energia, evite exercícios muito complicados ou que exijam muito equilíbrio hoje.";
  if (dorMuscular === 'intensa') prescricaoBase += " 🩹 Recuperação: Você está com muita dor no corpo. Treinos pesados foram retirados hoje para você descansar.";

  return prescricaoBase;
};

export const obterOpcoesDisponiveis = (experiencia, dorArticular, dorMuscular, energiaHoje, horasSono, estresse, motivacao) => {
  const opcoesRecuperativas = [
    { valor: '', rotulo: 'Selecione a atividade...' },
    { valor: 'descanso', rotulo: '💤 Descanso Total' },
    { valor: 'fisioterapia', rotulo: '🩹 Cuidados com Lesão / Fisioterapia' },
    { valor: 'mobilidade', rotulo: '🧘 Alongamento / Mobilidade' },
    { valor: 'caminhada', rotulo: '🚶 Caminhada Leve' }
  ];

  if (dorArticular === 'sim' || dorMuscular === 'intensa') return opcoesRecuperativas;

  const prontidao = calcularDisponibilidadeNeuromuscular(estresse, horasSono, 8, motivacao);
  if (prontidao.status === 'MUITO BAIXO (Risco de lesão)') return opcoesRecuperativas;

  let opcoesTreino = [ ...opcoesRecuperativas, { valor: 'treino_adaptacao', rotulo: '🏋️ Treino Leve (Aprender o movimento)' } ];

  if (prontidao.status === 'MODERADO (Atenção)' || energiaHoje === 'baixa' || horasSono < 6) return opcoesTreino;

  opcoesTreino.push({ valor: 'treino_intenso', rotulo: '🔥 Treino Pesado' });

  if (experiencia === 'avancado') {
    opcoesTreino.push(
      { valor: 'treino_choque', rotulo: '⚡ Treino até o Limite' },
      { valor: 'treino_potencia', rotulo: '🚀 Treino Explosivo (Saltos)' },
      { valor: 'treino_lpo', rotulo: '🏋️ Levantamento de Peso (Avançado)' }
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

  if (sessoesAgendadas === 0) return "Nenhuma atividade marcada na agenda ainda.";
  
  let analise = `Você tem ${sessoesAgendadas} dias de treino programados. `;
  
  if ((dorArticular === 'sim' || dorMuscular === 'intensa') && (intensos > 0 || base > 0)) {
     return "🛑 CUIDADO: Você avisou que está com dor ou lesão, mas colocou treinos de peso na agenda. Mude para descanso ou alongamento.";
  }

  if (experiencia !== 'avancado' && intensos > 0 && planner.some(s => ['treino_choque', 'treino_potencia', 'treino_lpo'].includes(s.atividade))) {
    return "⚠️ ATENÇÃO: Você agendou treinos muito avançados, mas seu nível atual é iniciante ou intermediário. Há risco de se machucar.";
  }

  if (intensos > 3 && (horasSono < 6 || (Number(horasTrabalho) + Number(horasEstudo) > 12))) {
    analise += "⚠️ RISCO DE EXAGERO: Sua rotina já gasta muita energia. Fazer tantos treinos pesados pode fazer mal para a sua saúde.";
  } else if (intensos > 0 && recuperativos === 0) {
    analise += "⚠️ FALTA DE DESCANSO: Você agendou treinos pesados, mas não tirou nenhum dia para o corpo descansar e se recuperar.";
  } else {
    analise += "✅ Sua agenda de treinos está bem equilibrada e segura.";
  }
  
  return analise;
};

export const gerarLinkAgenda = (rotuloAtividade, dataIso, horario) => {
  const titulo = encodeURIComponent(`🏋️ ${rotuloAtividade}`);
  const detalhes = encodeURIComponent(`Atividade marcada no seu Planner.`);
  const startData = dataIso.replace(/-/g, '');
  const startHora = horario.replace(':', '');
  const startTime = `${startData}T${startHora}00`;
  const [h, m] = horario.split(':');
  const endHora = String(parseInt(h) + 1).padStart(2, '0') + m;
  const endTime = `${startData}T${endHora}00`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titulo}&details=${detalhes}&dates=${startTime}/${endTime}`;
};