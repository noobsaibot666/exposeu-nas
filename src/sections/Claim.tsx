import './Claim.css'

function Claim() {
  return (
    <section className="section claim" id="claim">
      <div className="content">
        <div className="claim__panel">
          <div>
            <span className="pill">Claim</span>
            <h2>State the promise you want visitors to remember.</h2>
            <p>
              Use this space to make a bold, singular claim about the impact you
              deliver. Support it with a short line of evidence or a metric.
            </p>
          </div>
          <div className="claim__stat">
            <p className="claim__stat-label">Placeholder metric</p>
            <p className="claim__stat-value">+00%</p>
            <p className="claim__stat-note">
              Swap in a real proof point, testimonial, or data-driven result.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Claim
