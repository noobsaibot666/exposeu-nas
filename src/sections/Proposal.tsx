import './Proposal.css'

function Proposal() {
  return (
    <section className="section proposal" id="proposal">
      <div className="content">
        <div className="proposal__header">
          <span className="pill">Proposal</span>
          <h2>Frame the offer and why it matters.</h2>
          <p>
            Lay out the essential promise behind the product or service. This is
            where we set expectations and point visitors toward the proof.
          </p>
        </div>
        <div className="proposal__grid">
          {['Benefit one', 'Benefit two', 'Benefit three'].map((label) => (
            <article className="proposal__card" key={label}>
              <div className="proposal__icon" aria-hidden>
                •
              </div>
              <div>
                <h3>{label}</h3>
                <p>
                  Replace this copy with a concise description of the value or
                  capability you want to emphasize.
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Proposal
