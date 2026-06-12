import './Anamnese.css';

export default function Anamnese({ 
  experiencia, setExperiencia, dorArticular, setDorArticular, 
  horasTrabalho, setHorasTrabalho, horasEstudo, setHorasEstudo, 
  horasTransito, setHorasTransito, horasSono, setHorasSono,
  estresse, setEstresse, motivacao, setMotivacao,
  totalHoras, estaEstourado, tempoLivre 
}) {

  // Função para validar intervalos (0-24)
  const handleTempoChange = (valor, setter) => {
    const num = parseInt(valor) || 0;
    if (num < 0) setter(0);
    else if (num > 24) setter(24);
    else setter(num);
  };

  return (
    <section id="avaliacao-section" className="section-card">
      <h2 className="section-title">📝 1. Anamnese e Rotina</h2>
      
      {/* Barra de Tempo */}
      <div className="status-bar-container">
        <div className="status-header">
          <span>Carga Horária: {totalHoras}h / 24h</span>
          <span className={estaEstourado ? 'status-error' : 'status-ok'}>
            {estaEstourado ? '⚠️ Excedeu 24h!' : '✅ Dentro do limite'}
          </span>
        </div>
        <div className="progress-bg">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${Math.min((totalHoras / 24) * 100, 100)}%`, 
              background: estaEstourado ? '#e53e3e' : '#0070D1' 
            }} 
          />
        </div>
      </div>

      {/* Tempo Livre */}
      <div className="tempo-livre-card">
        <span className="label-livre">Tempo Livre:</span>
        <span className={tempoLivre < 0 ? 'valor-erro' : 'valor-ok'}>
          {tempoLivre >= 0 ? `${tempoLivre} horas` : '⚠️ Rotina impossível'}
        </span>
      </div>

      <div className="grid-2-col">
        <div className="form-group">
          <h4>Perfil Físico</h4>
          <div className="input-wrapper">
            <label className="input-label">Nível de Experiência:</label>
            <select className="input-field" value={experiencia} onChange={e => setExperiencia(e.target.value)}>
              <option value="iniciante">Iniciante</option>
              <option value="intermediario">Intermediário</option>
              <option value="avancado">Avançado</option>
            </select>
          </div>
          <div className="input-wrapper">
            <label className="input-label">Restrição Articular?</label>
            <select className="input-field" value={dorArticular} onChange={e => setDorArticular(e.target.value)}>
              <option value="nao">Não, livre de restrições</option>
              <option value="sim">Sim, possuo limitações ativas</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <h4>Alocação de Tempo (Horas)</h4>
          <div className="grid-2-col" style={{ gap: '10px' }}>
            <div className="input-wrapper">
              <label className="input-label">Trabalho:</label>
              <input type="number" min="0" max="24" className="input-field" value={horasTrabalho} onChange={e => handleTempoChange(e.target.value, setHorasTrabalho)} />
            </div>
            <div className="input-wrapper">
              <label className="input-label">Estudo:</label>
              <input type="number" min="0" max="24" className="input-field" value={horasEstudo} onChange={e => handleTempoChange(e.target.value, setHorasEstudo)} />
            </div>
            <div className="input-wrapper">
              <label className="input-label">Trânsito:</label>
              <input type="number" min="0" max="24" className="input-field" value={horasTransito} onChange={e => handleTempoChange(e.target.value, setHorasTransito)} />
            </div>
            <div className="input-wrapper">
              <label className="input-label">Sono:</label>
              <input type="number" min="0" max="24" className="input-field" value={horasSono} onChange={e => handleTempoChange(e.target.value, setHorasSono)} />
            </div>
          </div>
        </div>

        <div className="form-group">
          <h4>Como está seu nível de estresse hoje?</h4>
          <div className="input-wrapper">
            <label className="input-label">Estresse (1-10): {estresse}</label>
            <input type="range" min="1" max="10" className="input-field" value={estresse} onChange={e => setEstresse(e.target.value)} />
          </div>
          <div className="input-wrapper">
            <label className="input-label">Motivação hoje:</label>
            <select className="input-field" value={motivacao} onChange={e => setMotivacao(e.target.value)}>
              <option value="alta">Alta</option>
              <option value="baixa">Baixa</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}