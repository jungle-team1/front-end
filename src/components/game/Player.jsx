import './Player.css'

const Player = () => {
  return (
    <>
      <code className="code-container">
        <div className="glow-container">
          <div className="augs" data-augmented-ui></div>
        </div>
        <section className="augs bg" data-augmented-ui>
          <button className="dots" onClick="changeMode(this)" title="(click to change) Current Mode: css"></button>
          <div className="code highcontrast-dark">

          </div>
        </section>
      </code>
    </>

  )
}

export default Player;