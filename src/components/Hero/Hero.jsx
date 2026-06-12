import './Hero.css';
export default function Hero({ onStart }) {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">BENEFÍCIOS DO ESPORTE NA MINHA VIDA</h1>
        <p className="hero-subtitle">"Cuidar de si e se conectar aos outros."</p>
        <button onClick={onStart} className="btn-hero">INICIAR JORNADA</button>
      </div>
    </section>
  );
}