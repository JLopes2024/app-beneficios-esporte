import React from 'react';
import { formatarDataBr, gerarLinkAgenda } from '../../utils/logicaApp';
import './Planner.css';

export default function Planner({ planner, atualizarPlanner, opcoesPermitidas }) {
  return (
    <section className="section-card">
      <h2 className="section-title">📅 2. Escalonamento no Calendário</h2>
      <div className="planner-grid">
        {planner.map((sessao, index) => (
          <div key={sessao.id} className="planner-day-card">
            <span className="day-title">Sessão {index + 1}</span>
            <input 
              type="date" 
              className="input-field" 
              value={sessao.data} 
              onChange={e => atualizarPlanner(index, 'data', e.target.value)} 
            />
            
            <select 
              className="input-field" 
              value={sessao.atividade} 
              onChange={e => atualizarPlanner(index, 'atividade', e.target.value)}
            >
              {opcoesPermitidas.map(op => <option key={op.valor} value={op.valor}>{op.rotulo}</option>)}
            </select>

            {sessao.atividade && sessao.atividade !== 'descanso' && (
              <div className="time-selector">
                <span className="time-label">Hora:</span>
                <input 
                  type="time" 
                  className="input-field" 
                  value={sessao.horario} 
                  onChange={e => atualizarPlanner(index, 'horario', e.target.value)} 
                />
                <a 
                  href={gerarLinkAgenda(
                    opcoesPermitidas.find(o => o.valor === sessao.atividade)?.rotulo || 'Treino', 
                    sessao.data, 
                    sessao.horario
                  )} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn-google"
                >
                  Agenda
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}