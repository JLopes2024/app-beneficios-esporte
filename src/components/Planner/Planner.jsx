import React from 'react';
import { formatarDataBr, gerarLinkAgenda } from '../../utils/logicaApp';
import './Planner.css';

export default function Planner({ planner, atualizarPlanner, opcoesPermitidas }) {
  return (
    <section className="section-card">
      <h2 className="section-title">📅 3. Plano de Ação</h2>
      <div className="planner-grid">
        {planner.map((sessao, index) => {
          // Busca o rótulo da atividade de forma segura antes de renderizar o botão
          const atividadeSelecionada = opcoesPermitidas.find(o => o.valor === sessao.atividade);
          const rotuloAtividade = atividadeSelecionada ? atividadeSelecionada.rotulo : 'Treino';

          return (
            <div key={sessao.id} className="planner-day-card">
              <span className="day-title">Sessão {index + 1}</span>
              
              <div className="form-group" style={{ marginTop: '15px', gap: '15px' }}>
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
                  {opcoesPermitidas.map(op => (
                    <option key={op.valor} value={op.valor}>{op.rotulo}</option>
                  ))}
                </select>

                {/* Exibe o horário apenas se selecionou algo e NÃO for descanso */}
                {sessao.atividade && sessao.atividade !== 'descanso' && (
                  <div className="time-selector">
                    <span className="time-label">Hora:</span>
                    <input 
                      type="time" 
                      className="input-field" 
                      value={sessao.horario} 
                      onChange={e => atualizarPlanner(index, 'horario', e.target.value)} 
                    />
                  </div>
                )}

                {/* Exibe o botão APENAS se os 3 campos (Data, Atividade, Hora) estiverem preenchidos */}
                {sessao.data && sessao.atividade && sessao.atividade !== 'descanso' && sessao.horario ? (
                  <div className="agenda-btn-container">
                    <a 
                      href={gerarLinkAgenda(rotuloAtividade, sessao.data, sessao.horario)} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="btn-google"
                    >
                      Agenda
                    </a>
                  </div>
                ) : (
                  <div className="agenda-placeholder"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}