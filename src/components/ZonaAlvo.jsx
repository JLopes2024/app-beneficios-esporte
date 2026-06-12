import React, { useState } from 'react';
import './ZonaAlvo.css';

export default function ZonaAlvo() {
  const [idade, setIdade] = useState(25);
  const [fcRepouso, setFcRepouso] = useState(70);

  // Cálculos Fisiológicos (Tanaka + Karvonen)
  const fcMax = Math.round(208 - (0.7 * idade));
  const fcReserva = fcMax - fcRepouso;

  const calcularZona = (percentualMin, percentualMax) => {
    const min = Math.round((fcReserva * percentualMin) + Number(fcRepouso));
    const max = Math.round((fcReserva * percentualMax) + Number(fcRepouso));
    return `${min} a ${max} BPM`;
  };

  // Trava de Segurança Fisiológica
  const alertaRepousoAlto = fcRepouso >= 80;

  return (
    <section className="section-card">
      <h2 className="section-title">❤️ 1. Suas Zonas de Treinamento</h2>
      
      <div className="grid-2-col" style={{ marginBottom: '30px' }}>
        <div className="input-wrapper">
          <label className="input-label">Sua Idade:</label>
          <input 
            type="number" 
            min="10" max="100" 
            className="input-field" 
            value={idade} 
            onChange={e => setIdade(e.target.value)} 
          />
        </div>
        <div className="input-wrapper">
          <label className="input-label">Batimentos em Repouso (BPM):</label>
          <input 
            type="number" 
            min="40" max="120" 
            className="input-field" 
            value={fcRepouso} 
            onChange={e => setFcRepouso(e.target.value)} 
          />
          <small style={{ color: '#6B7280', marginTop: '5px' }}>
            Meça ao acordar ou após 5 minutos sentado.
          </small>
        </div>
      </div>

      {alertaRepousoAlto && (
        <div style={{ backgroundColor: '#FEF2F2', borderLeft: '6px solid #EF4444', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <strong style={{ color: '#B91C1C', display: 'block', marginBottom: '5px' }}>⚠️ ALERTA DE SEGURANÇA:</strong>
          <span style={{ color: '#991B1B', fontSize: '0.9rem' }}>
            Seus batimentos de repouso indicam que você está construindo sua base de condicionamento. Treinos nas Zonas 4 e 5 foram bloqueados por segurança. Foco total nas Zonas 1 a 3.
          </span>
        </div>
      )}

      <div className="zonas-container">
        <div className="zona-card zona-1">
          <div className="zona-header">
            <span className="zona-nome">Z1 - Recuperação (50-60%)</span>
            <span className="zona-bpm">{calcularZona(0.50, 0.60)}</span>
          </div>
          <p>Esforço muito leve. Ideal para aquecimento ou descanso ativo.</p>
        </div>

        <div className="zona-card zona-2">
          <div className="zona-header">
            <span className="zona-nome">Z2 - Aeróbico Leve (60-70%)</span>
            <span className="zona-bpm">{calcularZona(0.60, 0.70)}</span>
          </div>
          <p>Ritmo confortável. Melhora o condicionamento base e metabolismo de gordura.</p>
        </div>

        <div className="zona-card zona-3">
          <div className="zona-header">
            <span className="zona-nome">Z3 - Aeróbico Moderado (70-80%)</span>
            <span className="zona-bpm">{calcularZona(0.70, 0.80)}</span>
          </div>
          <p>Treino cardiovascular efetivo. Respiração mais profunda, mas ainda controlada.</p>
        </div>

        {/* ZONAS 4 E 5 COM CONDICIONAL DE ESTILO */}
        <div className={`zona-card zona-4 ${alertaRepousoAlto ? 'zona-bloqueada' : ''}`}>
          <div className="zona-header">
            <span className="zona-nome">Z4 - Limiar Anaeróbico (80-90%)</span>
            <span className="zona-bpm">{alertaRepousoAlto ? 'BLOQUEADO' : calcularZona(0.80, 0.90)}</span>
          </div>
          <p>Esforço intenso. Melhora a tolerância ao lactato. Difícil manter longas conversas.</p>
        </div>

        <div className={`zona-card zona-5 ${alertaRepousoAlto ? 'zona-bloqueada' : ''}`}>
          <div className="zona-header">
            <span className="zona-nome">Z5 - Esforço Máximo (90-100%)</span>
            <span className="zona-bpm">{alertaRepousoAlto ? 'BLOQUEADO' : calcularZona(0.90, 1.00)}</span>
          </div>
          <p>Sprints e potência máxima. Suportável apenas por curtos períodos de tempo.</p>
        </div>
      </div>
    </section>
  );
}