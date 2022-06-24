import React, { Component } from 'react';
import { connect } from 'react-redux';
import {accountSelector} from '../store/selectors'


class Navbar extends Component{
    render(){
        return(
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <a className="navbar-brand" href="/#">FREEDOM Token</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                <ul className="navbar-nav">
                    <li className="nav-item">
                    <a className="nav-link" target="_blank" without rel="noopener noreferrer" href={`https://etherscan.io/address/${this.props.account}`}>{this.props.account}</a>
                    </li>
                </ul>
                </div>
            </nav>
        )
    }
}

function mapStateToProps(state){
    return{
        account: accountSelector(state)
    }
  }
  
export default connect(mapStateToProps)(Navbar);