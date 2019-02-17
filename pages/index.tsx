import * as React from 'react'
import Page from '../layouts/main'
import Navbar from '../components/Navbar'
import Fade from 'react-reveal/Fade'
import Tada from 'react-reveal/Tada'

import css from '../styles/pages/index.scss';
import artwork from '../static/index/phone_artwork.svg'
import render from '../static/index/phone_render.png'
import partySvg from '../static/index/party.svg'
import addSongGif from '../static/index/add_song.gif'

import Footer from '../components/Footer'
import routes from '../server/routes'
const { Link } = routes

const index = () => {
  // --- generate the party steps ---
  const partyStepsData = [
    {
      title: 'Create a room',
      description: 'A personalized room just for you'
    },
    {
      title: 'Share the code',
      description: 'Invite people to join your room'
    },
    {
      title: 'Add to queue',
      description: "It's as easy as that"
    }
  ]

  const partySteps = partyStepsData.map((step, i) => (
    <div key={i}>
      <Fade bottom delay={400 + 100 * i}>
        <h2 className={css.stepNumber}>
          {i + 1}
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
    <Page>
      <Navbar />
      <div className={css.topPadding}>
        {/* First Container */}
        <div className={css.responsiveFirstContainer}>
          <Fade delay={150}>
            {/* Choose one of the following images based on breakpoint */}
            <img
              className={css.artwork}
              src={artwork}
              alt=""
            />
            <img
              className={css.render}
              src={render}
              alt=""
            />
          </Fade>
          <div className={css.firstContainerSideGroup}>
            <div className={css.padding}>
              <Fade bottom>
                <h1 className={css.hero}>Spotify in sync</h1>
              </Fade>
              <Fade bottom delay={200}>
                <sub className={css.firstContainerSubtitle}>Spotsync makes multi-device listening a breeze</sub>
              </Fade>
            </div>
            <div className={css.buttonGroup}>
              <Fade bottom delay={300}>
                <Link route='/auth/login'>
                  <button className={css.getStarted} data-cypress='get-started'>
                    Get Started
                  </button>
                </Link>
              </Fade>
              <Fade bottom delay={350}>
                <sub className={css.getStartedDescription}>By logging in with Spotify</sub>
              </Fade>
            </div>
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
                In three simple steps
              </sub>
            </Fade>
            {/* Second Container Steps */}
            <div className={css.responsiveSteps}>
              {partySteps}
            </div>
          </div>
        </div>
        {/* Third Container */}
        <div className={css.thirdContainer}>
          <div>
            <Fade bottom>
              <img
                className={css.addSongGif}
                src={addSongGif}
                alt=""
              />
            </Fade>
          </div>
          <div className={css.thirdContainerText}>
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
        </div>
        {/* Fourth Container */}
        <div className={css.fourthContainer}>
          <Fade bottom delay={200}>
            <h1 className={css.convincingTitle}>
              Ready to Go?
            </h1>
          </Fade>
          <Fade bottom delay={300}>
            <Link route='/auth/login'>
              <button className={css.getStarted} data-cypress='start-a-party'>
                Start a Party
              </button>
            </Link>
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
    </Page>
  )
}

export default index
