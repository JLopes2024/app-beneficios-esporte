import './Anamnese.css';

export default function Anamnese({ 
  experiencia, setExperiencia, dorArticular, setDorArticular, 
  horasTrabalho, setHorasTrabalho, horasEstudo, setHorasEstudo, 
  horasTransito, setHorasTransito, horasRedesSociais, setHorasRedesSociais, horasSono, setHorasSono,
  estresse, setEstresse, motivacao, setMotivacao,
  totalHoras, estaEstourado, tempoLivre 
}) {

  // NOVA TRAVA DE 24 HORAS
  const handleTempoChange = (novoValor, valorAtual, setter) => {
    let num = parseInt(novoValor) || 0;
    if (num < 0) num = 0;

    // Calcula o máximo de horas que este campo pode ter sem passar de 24h
    // (Pega as 24h e subtrai a soma de todos os OUTROS campos)
    const horasDisponiveis = 24 - (totalHoras - valorAtual);

    if (num > horasDisponiveis) {
      alert("⚠️ O dia só tem 24 horas!\n\nPara aumentar o tempo nesta atividade, você precisa reduzir o tempo de outra primeiro.");
      setter(horasDisponiveis); // Trava no número máximo exato que sobrou
    } else {
      setter(num);
    }
  };

  const getSonoStatus = (horas) => {
    if (horas < 4) return { tipo: 'ERRO', msg: '⚠️ Perigoso: Muito pouco sono para o corpo descansar!' };
    if (horas >= 4 && horas <= 6) return { tipo: 'ALERTA', msg: '⚠️ Atenção: Seu corpo não vai se recuperar 100% com esse tempo de sono.' };
    return { tipo: 'OK', msg: '✅ Sono ótimo para ter energia.' };
  };

  const statusSono = getSonoStatus(horasSono);

  return (
    <section id="avaliacao-section" className="section-card">
      <h2 className="section-title">📝 1. Como está sua rotina?</h2>
      
      <div className="grid-2-col">
        <div className="form-group">
          <h4>Seu Perfil</h4>
          <div className="input-wrapper">
            <label className="input-label">Você já treina há muito tempo?</label>
            <select className="input-field" value={experiencia} onChange={e => setExperiencia(e.target.value)}>
              <option value="iniciante">Sou Iniciante</option>
              <option value="intermediario">Já treino (Intermediário)</option>
              <option value="avancado">Sou Avançado</option>
            </select>
          </div>
          <div className="input-wrapper">
            <label className="input-label">Tem alguma lesão ou dor nas juntas?</label>
            <select className="input-field" value={dorArticular} onChange={e => setDorArticular(e.target.value)}>
              <option value="nao">Não, estou 100%</option>
              <option value="sim">Sim, sinto dor ou tenho lesão</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <h4>Como você divide seu dia (Horas)</h4>
          <div className="grid-2-col" style={{ gap: '10px' }}>
            <div className="input-wrapper">
              <label className="input-label">Trabalho:</label>
              <input 
                type="number" min="0" max="24" className="input-field" 
                value={horasTrabalho} 
                onChange={e => handleTempoChange(e.target.value, horasTrabalho, setHorasTrabalho)} 
              />
            </div>
            <div className="input-wrapper">
              <label className="input-label">Estudo:</label>
              <input 
                type="number" min="0" max="24" className="input-field" 
                value={horasEstudo} 
                onChange={e => handleTempoChange(e.target.value, horasEstudo, setHorasEstudo)} 
              />
            </div>
            <div className="input-wrapper">
              <label className="input-label">Trânsito:</label>
              <input 
                type="number" min="0" max="24" className="input-field" 
                value={horasTransito} 
                onChange={e => handleTempoChange(e.target.value, horasTransito, setHorasTransito)} 
              />
            </div>
            <div className="input-wrapper">
              <label className="input-label">Redes Sociais:</label>
              <input 
                type="number" min="0" max="24" className="input-field" 
                value={horasRedesSociais} 
                onChange={e => handleTempoChange(e.target.value, horasRedesSociais, setHorasRedesSociais)} 
              />
            </div>
            <div className="input-wrapper" style={{ gridColumn: '1 / -1' }}>
              <label className="input-label">Sono:</label>
              <input 
                type="number" min="0" max="24" 
                className={`input-field ${statusSono.tipo === 'ERRO' ? 'input-error' : ''}`} 
                value={horasSono} 
                onChange={e => handleTempoChange(e.target.value, horasSono, setHorasSono)} 
              />
              <small style={{ 
                color: statusSono.tipo === 'ERRO' ? '#e53e3e' : statusSono.tipo === 'ALERTA' ? '#dd6b20' : '#3182ce',
                fontWeight: 'bold',
                display: 'block',
                marginTop: '5px'
              }}>
                {statusSono.msg}
              </small>
            </div>
          </div>
        </div>

        <div className="form-group">
          <h4>Como você está se sentindo hoje?</h4>
          <div className="input-wrapper">
            <label className="input-label">Estresse (1 a 10): {estresse}</label>
            <input type="range" min="1" max="10" className="input-field" value={estresse} onChange={e => setEstresse(e.target.value)} />
          </div>
          <div className="input-wrapper">
            <label className="input-label">Vontade de treinar (Motivação):</label>
            <select className="input-field" value={motivacao} onChange={e => setMotivacao(e.target.value)}>
              <option value="alta">Alta (Estou animado!)</option>
              <option value="baixa">Baixa (Estou desanimado...)</option>
            </select>
          </div>
        </div>
        
      </div>
      
      {/* Barra de Tempo */}
      <div className="status-bar-container">
        <div className="status-header">
          <span>Tempo Gasto no Dia: {totalHoras}h / 24h</span>
          <span className={estaEstourado ? 'status-error' : 'status-ok'}>
            {estaEstourado ? '⚠️ Passou de 24h!' : '✅ Tudo certo'}
          </span>
        </div>
        <div className="progress-bg">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${Math.min((totalHoras / 24) * 100, 100)}%`, 
              background: estaEstourado ? '#e53e3e' : '#00439C' 
            }} 
          />
        </div>
      </div>

      {/* Tempo Livre */}
      <div className="tempo-livre-card">
        <span className="label-livre">Seu Tempo Livre:</span>
        <span className={tempoLivre < 0 ? 'valor-erro' : 'valor-ok'}>
          {tempoLivre >= 0 ? `${tempoLivre} horas` : '⚠️ Rotina impossível (reveja os horários)'}
        </span>
      </div>
    </section>
  );
}