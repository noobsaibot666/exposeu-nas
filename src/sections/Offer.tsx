import './Offer.css'

function Offer() {
  return (
    <section className="section offer" id="offer">
      <div className="content offer__grid">
        <div>
          <span className="pill">Offer</span>
          <h2>Invite visitors to take the next step.</h2>
          <p>
            Spell out what happens next. Whether it is scheduling a demo,
            grabbing a download, or joining a waitlist, this is where we point
            people toward action.
          </p>
        </div>
        <div className="offer__actions">
          <button className="btn btn-primary">Primary CTA</button>
          <button className="btn btn-ghost">Alternate CTA</button>
          <small className="offer__note">Add supporting detail or reassurance here.</small>
        </div>
      </div>
    </section>
  )
}

export default Offer
