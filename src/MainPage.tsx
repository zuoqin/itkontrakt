import * as React from "react";

import './style.css';
var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
var targetUrl = 'http://www.orienteeringorganiser.com/api/exchangeRates';

export class MainPage extends React.Component<any, any> {
  constructor(){
    super();
    this.state={ items: [], selected: null}
  }
  componentDidMount(){
  	this.fetchData();
  }

  fetchData(){


    fetch(proxyUrl + targetUrl)
    .then(response => response.json())
    .then( data => {
      this.setState({
        ...this.state,
        items: data
      })
    })
    .catch(error => {
      this.setState({
        ...this.state
    })
    })
   }


   updateSelection(id:number){
   	this.setState({...this.state, selected: id})
   }




  updateitem(newrate:number){
  	var newitems = this.state.items.map( (value:any) => {if(value.Id == this.state.selected){ value.Rate = newrate } return value});
  	this.setState({...this.state, items:  newitems})
  }

   render() {
   	   if( this.state.items.length == 0){
   	   return(
        <div className="mainPage">
            <h2>Display table of exchange rates </h2>


        </div>  
   	   )
 	   
   	   } else{

       return (
        <div className="mainPage">
            <h2>Display table of exchange rates </h2>
            <Table
            	items = {this.state.items}
            	updateSelection={this.updateSelection.bind(this)}
            />


            <button disabled={this.state.selected==null?true : false} type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal">Primary</button>


            <Dialog
            	item = {this.state.items.filter( (item:any) => item.Id == this.state.selected)[0]}
            	updateitem={this.updateitem.bind(this)}
            />

        </div>



       );
   	   }

  }
}


export default class Table extends React.Component<any, any> {
  constructor(){
    super();
    this.state={ selectedOption: null}
    this.handleOptionChange = this.handleOptionChange.bind(this);
  }

	handleOptionChange(changeEvent:any) {
	  this.setState({
	    selectedOption: changeEvent.target.value
	  });
	  this.props.updateSelection(changeEvent.target.value.substring(6))
	}

  renderPiece(value:any, index:number) {
    return (      
      <tr
        key={index}
        >
      	<th scope="row">{value.Id}</th>
      	<td>{value.Date}</td>
      	<td>{value.CurrencyPair}</td>
      	<td>{value.Rate}</td>
      	<td><input type="radio"  value={'chkbox' + value.Id} checked={this.state.selectedOption === ('chkbox' + value.Id)}  onChange={this.handleOptionChange}/></td>
      </tr>
    )
  }
  renderList() {
    let a = this
    return this.props.items.map((value:any, index:number) => {
      return a.renderPiece(value, index)
    })
  }
render(){
	return (
            <table className="table">

			  <thead>
			    <tr>
			      <th scope="col">ID</th>
			      <th scope="col">Date</th>
			      <th scope="col">Currency</th>
			      <th scope="col">Rate</th>
			      <th scope="col">Selected</th>
			    </tr>
			  </thead>
			  <tbody>
               {this.renderList()}
			  </tbody>
			</table>
	)
}
}

class Dialog extends React.Component<any, any> {

	  constructor(props:any) {
	    super(props);
	    this.state = {rate: 1.4};

	    this.handleChange = this.handleChange.bind(this);
	    this.savenewrate = this.savenewrate.bind(this);
	  }

	  handleChange(event:any) {
	    this.setState({rate: event.target.value});
	  }

		componentWillReceiveProps(nextProps:any) {
		  // You don't have to do this check first, but it can help prevent an unneeded render
		  if (nextProps.item.Rate !== this.state.rate) {
		    this.setState({ ...this.state, rate: nextProps.item.Rate });
		  }
		}

	  savenewrate(){
	  	let newitem : any = this.props.item;
	  	newitem.Rate = this.state.rate;
	  	this.props.updateitem(this.state.rate);
	    fetch(proxyUrl + targetUrl, { method: 'PUT', body: newitem,  headers: {
    		"Content-Type": "application/json"
 		} })
	  }

	render(){
		if(this.props.item === undefined)
		{
			return <div></div>
		}
		else{
		return (
			<div className="modal fade" id="exampleModal"  role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
			  <div className="modal-dialog" role="document">
			    <div className="modal-content">
			      <div className="modal-header">
			        <h5 className="modal-title" id="exampleModalLabel">Change rate</h5>
			        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
			          <span aria-hidden="true">&times;</span>
			        </button>
			      </div>
			      <div className="modal-body">

					 <div className = "row">
					 </div>
					 <div className = "row">
					 	<div className="col-md-1">
					 		<span>{this.props.item.Id}</span>
					 	</div>
					 	<div className="col-md-4">
					 		<span>{this.props.item.Date}</span>
					 	</div>
					 	<div className="col-md-3">
					 		<span>{this.props.item.CurrencyPair}</span>
					 	</div>
					 	<div className="col-md-2">
					 		<input type="number" id="rate" value={this.state.rate} onChange={this.handleChange} step="0.01"/>
					 	</div>
					 </div>
			      </div>
			      <div className="modal-footer">
			        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
			        <button type="button" className="btn btn-primary" onClick={this.savenewrate} data-dismiss="modal">Save changes</button>
			      </div>
			    </div>
			  </div>
			</div>
		)		
		}


	}
}



