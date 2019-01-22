import * as React from 'react'
import css from '../styles/components/footer.scss';

const Footer = () => {
  return (
    <div className={css.footerContainer}>
      <div className={css.flexContainer}>
        {/* SPOTSYNC container */}
        <div className={css.footerSubContainer}>
          <h1 className={css.spotsyncTitle}>
            SPOTSYNC
          </h1>
          <a
            className={css.footerLink}
            href="/"
          >
            Home
          </a>
          <a
            className={css.footerLink}
            href="/app"
          >
            App
          </a>
          <a
            className={css.footerLink}
            href="https://github.com/jdtzmn/spotsync"
          >
            GitHub
          </a>
        </div>
        {/* SUPPORT container */}
        <div className={css.footerSubContainer}>
          <h1 className={css.supportTitle}>
            SUPPORT
          </h1>
          <a
            className={css.footerLink}
            href="/"
          >
            Contact
          </a>
          <a
            className={css.footerLink}
            href="https://github.com/jdtzmn/spotsync/issues"
          >
            Report an issue
          </a>
        </div>
      </div>
      {/* Copyright */}
      <p className={css.copyright}>
        © 2018 Jacob Daitzman. All rights reserved.
      </p>
    </div>
  );
};

export default Footer
