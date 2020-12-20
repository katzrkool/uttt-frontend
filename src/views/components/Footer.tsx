import React from 'react';
import './Footer.css';

function Footer(): JSX.Element {
    return (
        <footer>
            <p>This project is open sourced on Github: <a href="https://github.com/katzrkool/uttt-frontend">Frontend</a> | <a href="https://github.com/katzrkool/uttt-backend">Backend</a></p>
            
            <p>We use <a href="https://sentry.io">Sentry</a> for error and bug tracking. No personally identifiable information is collected, unless you put something like your SSN in the name field. <a href="https://sentry.io/privacy/">Sentry Privacy Policy</a></p>
        </footer>
    );
}

export default Footer;