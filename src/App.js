import React, { Component } from 'react';
import io from 'socket.io-client';

export default class App extends Component {
  state={
      isConnected: false,
      id:null,
      peeps:[],
      messages: [],
      name:"Abdulkader",
      text:"",
    }
  
  socket=null

  componentDidMount(){
    this.socket = io('https://codi-server.herokuapp.com');

    this.socket.on('connect',()=>{
      this.setState({isConnected:true});
    });

    this.socket.on('pong',(additionalStuff)=>{
      this.setState({
        ping:additionalStuff
      })
    })

    this.socket.on('youare',(answer)=>{
      this.setState({
        id:answer.id
      });
    });

    this.socket.on('diconnect',()=>{
      this.setState({isConnected:false});
    });
    this.socket.emit('whoami',(answer)=>{
      this.setState({id:answer.id});
    });

    this.socket.on('peeps',(peeps)=>{
      this.setState({peeps:peeps});
      console.log(peeps.length);
    });

    this.socket.on('new connection',(newPeep)=>{
      this.setState({peeps:[...this.state.peeps,newPeep]});
    });

    this.socket.on('new disconnection',(removedPeep)=>{
      const indexOfElementToRemove = this.state.peeps.indexOf(removedPeep,0);
      const peepsCopy = [...this.state.peeps];
      peepsCopy.splice(indexOfElementToRemove);
      this.setState({peeps:[...peepsCopy]});
    });

    // this.socket.on('next',(message_from_server)=>console.log(message_from_server))

      this.socket.on('disconnect', () => {
    this.setState({isConnected:false})
    })
      /** this will be useful way, way later **/
    this.socket.on('room', old_messages => {
      this.setState({ messages: old_messages });
})

  }

componentWillUnmount(){
this.socket.close()
this.socket = null
}


list() {
  return this.state.messages.map((data, i) => {
   return (
     <div key={i}>
       <li key={i}>{data.name} {data.text}</li>
     </div>
   )
 })
}
  render(){
  return (
    <div className="App">
      <header className="App-header">
      <div>status: {this.state.isConnected ? 'connected' : 'disconnected'}</div>
      {/* <button onClick={()=>this.socket.emit('whoami')}>Who am I?</button> */}
      {/* <button onClick={()=>this.socket.emit('next')}>next</button> */}
<input type="text" id="myMessage"></input>
      <button className="sendButt" onClick={() => {
          let text = document.getElementById("myMessage").value;
          return this.socket.emit('message', { 'text': text, 'id': this.state.id, 'name': this.state.name });
}}>send</button>

<div>{this.list()}</div>

      </header>
    </div>
  )
}
}

