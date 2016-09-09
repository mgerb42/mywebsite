import React from 'react';

import me from '../../../assets/images/me.jpg';

export default class AboutMe extends React.Component{
    
    render(){
        return(
            <div>
                <h2>About Me</h2>
                <img src={me}/>
                <p>
                  My name is Mitchell and I have a passion for software development. I am currently a software engineer and enjoy working on personal projects in my free time.
                </p>
        
                <p>
                  <i class="fa fa-envelope" aria-hidden="true"></i>
                  <a class="link" href="mailto:mgerb42@gmail.com"> eMail</a>
                </p>
                <p>
                  <i class="fa fa-linkedin-square" aria-hidden="true"></i>
                  <a class="link" href="https://www.linkedin.com/in/mitchell-gerber-125391b3" target="_blank"> LinkedIn</a>
                </p>
                <p>
                  <i class="fa fa-github" aria-hidden="true"></i>
                  <a class="link" href="https://github.com/mgerb" target="_blank"> GitHub</a>
                </p>
                <p>
                  <i class="fa fa-wpforms" aria-hidden="true"> </i>
                  <a href="/resume" class="link"> Resume</a>
                </p>
            </div>
            );
    }
}