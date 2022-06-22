import Web3 from "web3"
import {
    web3Loaded,
    web3AccountLoaded,
    tokenLoaded,
    exchangeLoaded,
    cancelledOrdersLoaded,
    filledOrdersLoaded,
    allOrdersLoaded,
    orderCancelling,
    orderCancelled,
    orderFilling
} from "./actions"
import Token from '../abis/Token.json'
import Exchange from '../abis/Exchange.json'


export const loadWeb3 = (dispatch) => {
    const web3 = new Web3(window.ethereum)
    dispatch(web3Loaded(web3))
    return web3
}

export const loadAccount = async (web3, dispatch) => {
    const accounts = await web3.eth.getAccounts()
    const account = accounts[0]
    dispatch(web3AccountLoaded(account))
    return account
}

export const loadToken = async (web3, networkID, dispatch) => {
   try{
       const token = new web3.eth.Contract(Token.abi, Token.networks[networkID].address)
       dispatch(tokenLoaded(token))
       return token
   }catch(error){
        console.log('Contract not deployed to the current network. Please select another network in Metamask.')
        return null
   }
}

export const loadExchange = async (web3, networkID, dispatch) => {
   try{
       const exchange = new web3.eth.Contract(Exchange.abi, Exchange.networks[networkID].address)
       dispatch(exchangeLoaded(exchange))
       return exchange
   }catch(error){
        console.log('Contract not deployed to the current network. Please select another network in Metamask.')
        return null
   }
}

export const loadAllOrders = async (exchange, dispatch) => {
    // Fetch cancelled orders with the "Cancel" event stream
    const cancelStream = await exchange.getPastEvents('Cancel', { fromBlock: 0, toBlock: 'latest'})
    // Format cancelled orders
    const cancelledOrders = cancelStream.map((event) => event.returnValues)
    
    // Add to redux store
    dispatch(cancelledOrdersLoaded(cancelledOrders))
    
    // Format filled orders
    const tradeStream = await exchange.getPastEvents('Trade', { fromBlock: 0, toBlock: 'latest'})
    const filledOrders = tradeStream.map((event) => event.returnValues)
    dispatch(filledOrdersLoaded(filledOrders))
    
    // Format filled orders
    const orderStream = await exchange.getPastEvents('Order', { fromBlock: 0, toBlock: 'latest'})
    const allOrders = orderStream.map((event) => event.returnValues)
    dispatch(allOrdersLoaded(allOrders))


    // Fetch filled orders with the "Trade" event stream
    
    // Fetch all orders with the "Order" event stream
}



export const cancelOrder = (dispatch, exchange, order, account) => {
    exchange.methods.cancelOrder(order.id).send({ from: account })
    .on('transactionHash', (hash) => {
        dispatch(orderCancelling())
    })
    .on('error', (error) => {
        console.log(error)
        window.alert("There was an error")
    })
}


export const fillOrder = (dispatch, exchange, order, account) => {
    exchange.methods.cancelOrder(order.id).send({ from: account })
    .on('transactionHash', (hash) => {
        dispatch(orderFilling())
    })
    .on('error', (error) => {
        console.log(error)
        window.alert("There was an error")
    })
}


export const subscribeToEvents = async (exchange, dispatch) =>{
    exchange.events.Cancel({}, (error, event) => {
        dispatch(orderCancelled(event.returnValues))
    })
}