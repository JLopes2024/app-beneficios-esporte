import { useState } from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Planner from './components/Planner/Planner';
import Anamnese from './components/Anamnese/Anamnese';

// Adicionei calcularDisponibilidadeNeuromuscular aqui
import { gerarRecomendacao, obterOpcoesDisponiveis, gerarBriefing, calcularDisponibilidadeNeuromuscular } from './utils/logicaApp';
import './styles/App.css';

function App() {
  const [experiencia, setExperiencia] = useState('iniciante');
  const [dorArticular, setDorArticular] = useState('nao');
  const [horasTrabalho, setHorasTrabalho] = useState(8);
  const [horasEstudo, setHorasEstudo] = useState(4);
  const [horasTransito, setHorasTransito] = useState(2);
  const [horasSono, setHorasSono] = useState(7);
  const [energiaHoje, setEnergiaHoje] = useState('alta');
  const [dorMuscular, setDorMuscular] = useState('nao');
  const [planner, setPlanner] = useState(Array.from({ length: 7 }, (_, i) => ({ id: i, data: '', atividade: '', horario: '' })));
  
  // Novos Estados
  const [estresse, setEstresse] = useState(5);
  const [sonoAtual, setSonoAtual] = useState(7);
  const [motivacao, setMotivacao] = useState('alta');

  // Cálculos
  const totalHoras = Number(horasTrabalho) + Number(horasEstudo) + Number(horasTransito) + Number(horasSono);
  const tempoLivre = 24 - totalHoras;
  const estaEstourado = totalHoras > 24;

  // Função de decisão (usando o sonoAtual para comparar com o sono ideal)
  const prontidao = calcularDisponibilidadeNeuromuscular(estresse, sonoAtual, 8, motivacao);

  const atualizarPlanner = (index, campo, valor) => {
    const novoPlanner = [...planner];
    novoPlanner[index][campo] = valor;
    setPlanner(novoPlanner);
  };

  return (
    <div className="app-container">
      <Header />
      <Hero onStart={() => document.getElementById('main').scrollIntoView({ behavior: 'smooth' })} />

      <main id="main">
        <Anamnese 
          experiencia={experiencia} setExperiencia={setExperiencia}
          dorArticular={dorArticular} setDorArticular={setDorArticular}
          horasTrabalho={horasTrabalho} setHorasTrabalho={setHorasTrabalho}
          horasEstudo={horasEstudo} setHorasEstudo={setHorasEstudo}
          horasTransito={horasTransito} setHorasTransito={setHorasTransito}
          horasSono={horasSono} setHorasSono={setHorasSono}
          estresse={estresse} setEstresse={setEstresse}
          motivacao={motivacao} setMotivacao={setMotivacao}
          totalHoras={totalHoras} estaEstourado={estaEstourado} tempoLivre={tempoLivre}
        />

        <section className="alert-box">
          <h3>💡 Diretriz Operacional:</h3>
          {/* Adicionei o feedback visual da prontidão aqui */}
          <p style={{ color: prontidao.cor, fontWeight: 'bold' }}>Status Neuromuscular: {prontidao.status}</p>
          <p>{gerarRecomendacao(experiencia, dorArticular, '3 dias', horasTrabalho, horasEstudo, horasTransito, horasSono, energiaHoje, dorMuscular)}</p>
        </section>

        <Planner planner={planner} atualizarPlanner={atualizarPlanner} opcoesPermitidas={obterOpcoesDisponiveis(experiencia, dorArticular, dorMuscular, energiaHoje, horasSono)} />

        <section className="briefing-card">
          <h2>📊 Balanço Geral</h2>
          <p className="briefing-text">{gerarBriefing(planner, experiencia, dorArticular, dorMuscular, horasSono, horasTrabalho, horasEstudo)}</p>
        </section>
      </main>
    </div>
  );
}

export default App;