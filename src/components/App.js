import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import './App.css';
import Web3 from 'web3';
import { connect } from 'react-redux';
import { loadWeb3, loadAccount, loadToken, loadExchange } from '../store/interactions';
import Navbar from './Navbar';
import Content from './Content';
import {contractsLoadedSelector} from '../store/selectors'



class App extends Component{
  componentWillMount() {
    this.loadBlockchainData(this.props.dispatch);
  }

  async loadBlockchainData(dispatch){
    const web3 = loadWeb3(dispatch)
    const network = await web3.eth.net.getNetworkType()
    const networkId = await web3.eth.net.getId()
    console.log("networkID", networkId)
    const accounts = await loadAccount(web3, dispatch)
    const token = await loadToken(web3, networkId, dispatch)
    if(!token){
      window.alert('Token smart contract not detected n the current network. Please select another network with Metamask.')
      return
    }
    const exchange = await loadExchange(web3, networkId, dispatch)
    if(!exchange){
      window.alert('Exchange smart contract not detected n the current network. Please select another network with Metamask.')
      return
    }

    // console.log("accounts", accounts)
    // console.log("token", token )

    // const totalSupply = await token.methods.totalSupply().call()
    // console.log("totalSupply", totalSupply)
  }



  render(){

  return (
      <div>
        <Navbar />
        { this.props.contractsLoaded ? <Content /> : <div className='content'></div> }
      </div>
  );
  }

}

function mapStateToProps(state){
  // console.log("contractsLoaded", contractsLoadedSelector(state))
  return{
    contractsLoaded: contractsLoadedSelector(state)
  }
}

export default connect(mapStateToProps)(App);
