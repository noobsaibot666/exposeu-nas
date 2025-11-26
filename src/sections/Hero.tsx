import './Hero.css'

function Hero() {
  return (
    <section className="section hero" id="hero">
      <div className="content hero__grid">
        <div className="hero__copy">
          <span className="pill">Hero section</span>
          <h1>Lead with a statement that sets the tone.</h1>
          <p className="hero__lede">
            Introduce the core idea for the homepage. Keep this tight and
            aspirational so we can refine the words later.
          </p>
          <div className="hero__actions">
            <button className="btn btn-primary">Primary action</button>
            <button className="btn btn-ghost">Secondary action</button>
          </div>
        </div>
        <div className="hero__card">
          <div className="hero__card-body">
            <p className="hero__label">Placeholder visual</p>
            <p className="hero__hint">
              Drop in imagery, a mock dashboard, or anything that quickly
              explains what you do.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
