import * as React from 'react'
import Head from 'next/head'
import Fade from 'react-reveal/Fade'
import Tada from 'react-reveal/Tada'

import css from '../styles/pages/index.scss';
import artwork from '../static/index/phone_artwork.svg'
import partySvg from '../static/index/party.svg'
import addSongGif from '../static/index/add_song.gif'

import Footer from '../components/Footer'

class Index extends React.Component {
  componentDidMount () {
    // scroll to the top so that every reload starts at the top (no weird fading animations)
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 20)
  }

  render () {
    // --- generate the party steps ---
    const partyStepsData = [
      {
        title: 'Share the party over sound',
        description: 'Plays a sequence of notes from one member to another'
      },
      {
        title: 'Scan a QR code',
        description: 'Scan a QR code to instantly connect'
      },
      {
        title: 'Enter a code',
        description: "It's as easy as that"
      }
    ]

    const partySteps = partyStepsData.map((step, index) => (
      <div key={index}>
        <Fade bottom delay={400}>
          <h2 className={css.stepNumber}>
            {index + 1}
          </h2>
          <h2 className={css.stepTitle}>
            {step.title}
          </h2>
          <h3 className={css.stepDescription}>
            {step.description}
          </h3>
        </Fade>
      </div>
    ))

    // --- render the component ---
    return (
      <div className={css.container}>
        <Head>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
        </Head>
        {/* First Container */}
        <Fade>
          <img
            className={css.artwork}
            src={artwork}
            alt=""
          />
        </Fade>
        <div>
          <div className={css.padding}>
            <Fade bottom>
              <h1 className={css.hero}>Spotify in sync</h1>
            </Fade>
            <Fade bottom delay={200}>
              <sub className={css.subtitle}>Spotsync makes multi-device listening a breeze</sub>
            </Fade>
          </div>
          <div className={css.buttonGroup}>
            <Fade bottom delay={300}>
              <button className={css.getStarted}>
                Get Started
              </button>
            </Fade>
            <Fade bottom delay={350}>
              <sub className={css.getStartedDescription}>By logging in with Spotify</sub>
            </Fade>
          </div>
        </div>
        {/* Second Container */}
        <div className={css.secondContainer}>
          <Fade bottom>
            <img
              className={css.partySvg}
              src={partySvg}
              alt=""
            />
          </Fade>
          <div className={css.partyGroup}>
            <Fade bottom delay={400}>
              <h1 className={css.partyTitle}>
                Get the Party Started
              </h1>
            </Fade>
            <Fade bottom delay={600}>
              <sub className={css.partySubtitle}>
                Many ways to connect to the party
              </sub>
            </Fade>
            {/* Second Container Steps */}
            {partySteps}
          </div>
        </div>
        {/* Third Container */}
        <div className={css.thirdContainer}>
          <Fade bottom>
            <img
              className={css.addSongGif}
              src={addSongGif}
              alt=""
            />
          </Fade>
          <Fade bottom delay={400}>
            <h1 className={css.whiteTitle}>
              Every person can add songs to the queue
            </h1>
          </Fade>
          <Fade bottom delay={400}>
            <sub className={css.whiteDescription}>
              The songs will keep on playing
            </sub>
          </Fade>
        </div>
        {/* Fourth Container */}
        <div className={css.fourthContainer}>
          <Fade bottom delay={200}>
            <h1 className={css.convincingTitle}>
              Ready to Go?
            </h1>
          </Fade>
          <Fade bottom delay={300}>
            <button className={css.getStarted}>
              Start a Party
            </button>
          </Fade>
          <Fade bottom delay={350}>
            <Tada delay={1000}>
              <sub className={css.getStartedDescription}>
                (It's free)
              </sub>
            </Tada>
          </Fade>
        </div>
        {/* Footer */}
        <Footer />
      </div>
    )
  }

}

export default Index
