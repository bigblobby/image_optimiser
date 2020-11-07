import React from 'react';
import { NavLink } from "react-router-dom";

export default class Navigation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            navOpen: false
        }
    }

    toggleNav = () => {
        if(window.innerWidth < 576){
            this.setState(prevState => ({
                navOpen: !prevState.navOpen
            }));
        }
    };

    render(){
        return (
            <>
                <div className={"burger-menu " + (this.state.navOpen ? 'open' : '')} onClick={this.toggleNav}>
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                </div>
                <nav className={"navigation " + (this.state.navOpen ? 'open' : '')}>
                    <ul>
                        <li onClick={this.toggleNav}>
                            <NavLink to={'/optimise'}>Optimise</NavLink>
                        </li>
                        <li onClick={this.toggleNav}>
                            <NavLink to={'/convert'}>Convert</NavLink>
                        </li>
                        <li onClick={this.toggleNav}>
                            <NavLink to={'/encode'}>Encode</NavLink>
                        </li>
                        <li onClick={this.toggleNav}>
                            <NavLink to={'/site-check'}>Site Checker</NavLink>
                        </li>
                    </ul>
                </nav>
            </>
        )
    }
}
