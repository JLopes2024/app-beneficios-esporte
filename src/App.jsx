import { useState } from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Planner from './components/Planner/Planner';
import Anamnese from './Anamnese';
import { gerarRecomendacao, obterOpcoesDisponiveis, gerarBriefing, calcularDisponibilidadeNeuromuscular } from './utils/logicaApp';
import './styles/App.css';

// Importações do Firebase
import { auth, provider } from './firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

function App() {
  // Novo estado para controlar o usuário logado
  const [usuario, setUsuario] = useState(null);

  const [experiencia, setExperiencia] = useState('iniciante');
  const [dorArticular, setDorArticular] = useState('nao');
  const [horasTrabalho, setHorasTrabalho] = useState(8);
  const [horasEstudo, setHorasEstudo] = useState(4);
  const [horasTransito, setHorasTransito] = useState(2);
  const [horasSono, setHorasSono] = useState(7);
  const [energiaHoje, setEnergiaHoje] = useState('alta');
  const [dorMuscular, setDorMuscular] = useState('nao');
  const [planner, setPlanner] = useState(Array.from({ length: 7 }, (_, i) => ({ id: i, data: '', atividade: '', horario: '' })));
  
  const [estresse, setEstresse] = useState(5);
  const [motivacao, setMotivacao] = useState('alta');

  const totalHoras = Number(horasTrabalho) + Number(horasEstudo) + Number(horasTransito) + Number(horasSono);
  const tempoLivre = 24 - totalHoras;
  const estaEstourado = totalHoras > 24;

  const prontidao = calcularDisponibilidadeNeuromuscular(estresse, horasSono, 8, motivacao);

  const atualizarPlanner = (index, campo, valor) => {
    const novoPlanner = [...planner];
    novoPlanner[index][campo] = valor;
    setPlanner(novoPlanner);
  };

  // Funções de Autenticação
  const fazerLogin = async () => {
    try {
      const resultado = await signInWithPopup(auth, provider);
      setUsuario(resultado.user);
    } catch (erro) {
      console.error("Erro ao fazer login:", erro);
      alert("Houve um erro ao tentar fazer login. Tente novamente.");
    }
  };

  const fazerLogout = () => {
    signOut(auth).then(() => {
      setUsuario(null);
    });
  };

  return (
    <div className="app-container">
      <Header />
      
      {/* O Hero pode receber o nome do usuário como prop no futuro, se quiser */}
      <Hero onStart={() => document.getElementById('main')?.scrollIntoView({ behavior: 'smooth' })} />

      {/* ÁREA DE LOGIN OU CONTEÚDO */}
      {!usuario ? (
        <section style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h2 style={{ color: 'var(--ps-black)', marginBottom: '20px' }}>Pronto para começar?</h2>
          <p style={{ color: '#6B7280', marginBottom: '30px' }}>Faça login para salvar suas configurações e personalizar sua experiência.</p>
          <button 
            onClick={fazerLogin} 
            className="btn-google"
            style={{ cursor: 'pointer', border: 'none' }}
          >
            Entrar com o Google
          </button>
        </section>
      ) : (
        <main id="main">
          {/* Saudação Personalizada */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: 'var(--ps-blue)' }}>
              Olá, {usuario.displayName.split(' ')[0]}! 👋
            </h3>
            <button 
              onClick={fazerLogout} 
              style={{ background: 'transparent', border: 'none', color: '#e53e3e', textDecoration: 'underline', cursor: 'pointer' }}
            >
              Sair da conta
            </button>
          </div>

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
            <h3>💡 Recomendação para {usuario.displayName.split(' ')[0]}:</h3>
            <p style={{ color: prontidao.cor, fontWeight: 'bold' }}>Sua Energia para Treinar: {prontidao.status}</p>
            <p>{gerarRecomendacao(experiencia, dorArticular, '3 dias', horasTrabalho, horasEstudo, horasTransito, horasSono, energiaHoje, dorMuscular)}</p>
          </section>

          <Planner 
            planner={planner} 
            atualizarPlanner={atualizarPlanner} 
            opcoesPermitidas={obterOpcoesDisponiveis(experiencia, dorArticular, dorMuscular, energiaHoje, horasSono, estresse, motivacao)} 
            statusNeuromuscular={prontidao.status}
          />

          <section className="briefing-card">
            <h2>📊 Resumo da Sua Agenda</h2>
            <p className="briefing-text">{gerarBriefing(planner, experiencia, dorArticular, dorMuscular, horasSono, horasTrabalho, horasEstudo)}</p>
          </section>
        </main>
      )}

      <p className="disclaimer">Este é um aplicativo apenas para fins educacionais e não substitui a orientação de um profissional de saúde.</p>
    </div>
  );
}

export default App;