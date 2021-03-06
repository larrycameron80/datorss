import React, { Component } from 'react';
import 'normalize.css'
import 'sanitize.css'
import './App.css';
import axios from 'axios';
import SearchForm from './Components/SearchForm';
import EntryList from './Components/EntryList';
import ReactPaginate from 'react-paginate';
import strictUriEncode from 'strict-uri-encode';
import queryString from 'query-string'

export default class App extends Component {
  
  constructor() {
    super();
    this.state = {
      entries: [],
      loading: true,
      total: 0,
      perPage: 0,
      currentPage: 0
    };
  }

  componentDidMount() {
    this.performSearch();
  }
  
  performSearch = (query = '', page = null) => {
    const parsed = queryString.parse(window.location.search);
    page = parsed.page ? parsed.page : 1

    if (query) {
      window.location.search = "?q=" + strictUriEncode(query) + "&page=" + 1;
    }
   
    query = parsed.q
   
    if (query) {
      axios.get(`https://static.86.148.203.116.clients.your-server.de/search/entries?q=${query}&page=${page}`)
        .then(response => {
          
          this.setState({
            query: query,
            entries: response.data.data,
            total: response.headers['total'],
            perPage: response.headers['per-page'],
            currentPage: response.headers['current-page'],
            loading: false
          });
        })
        .catch(error => {
          console.log('Error fetching and parsing data', error);
          this.setState({ loading: false , entries: [], query: query });
        });    
    } else {
      this.setState({ loading: false , entries: [], query: '' })
    }
  }

  handlePageClick = data => {
    let selected = data.selected;

    window.location.search = "?q=" + strictUriEncode(this.state.query) + "&page=" + (selected + 1);
  };
  
  render() { 
    return (
      <div>
        
        <div className="main-header">
        <div className="inner">
          <h2>DatoRSS</h2>
            <SearchForm onSearch={this.performSearch} query={this.state.query} />      
          </div>   
          <div className="main-info">
         
            <div className="jumbotron jumbotron-fluid">
              <div className="btn-group" role="group">
                <button type="button" className="btn btn-sm btn-dark">
                  <a href="/"><i className="fas fa-home"></i></a> <span className="badge badge-primary"></span>
                </button>
                <button type="button" className="btn btn-sm btn-dark">
                  q <span className="badge badge-light">{this.state.query ? this.state.query : 'blank'}</span>
                </button>
                <button type="button" className="btn btn-sm btn-dark">
                  tot <span className="badge badge-light">{this.state.total}</span>
                </button>
                <button type="button" className="btn btn-sm btn-dark">
                  per page <span className="badge badge-light">{this.state.perPage}</span>
                </button>
                <button type="button" className="btn btn-sm btn-dark">
                  current page <span className="badge badge-light">{this.state.currentPage}</span>
                </button>             
             
              </div>
            </div>
          </div>
        </div>
      
        <div className="main-content">
          
          {
            (this.state.loading)
             ? <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
              </div>
             : <div>
              
              <EntryList data={this.state.entries} query={this.state.query}/>

              { this.state.entries.length > 0 && 
                <div className="btn-group" role="group">
                  <ReactPaginate
                      previousLabel={'prev'}
                      nextLabel={'next'}
                      breakLabel={'...'}
                      forcePage={this.state.currentPage - 1}
                      pageClassName={'page-item'}
                      pageLinkClassName={'page-link'}
                      breakClassName={'break-me'}
                      pageCount={this.state.total / this.state.perPage}
                      marginPagesDisplayed={2}
                      onPageChange={this.handlePageClick}
                      pageRangeDisplayed={2}
                      containerClassName={'pagination pagination-sm'}
                      subContainerClassName={'pages pagination'}
                      activeClassName={'active'}
                      previousClassName={'page-item'}
                      nextClassName={'page-item'}
                      previousLinkClassName={'page-link'}
                      nextLinkClassName={'page-link'}
                    /> 
                </div>
              }
              </div>
          }     
        </div>
        { this.state.entries.length > 0 && 
          <div className="main-content main-author">
            Made by <a href="https://davidesantangelo.com">Davide Santangelo</a>. Source on <a href="https://github.com/davidesantangelo/datorss">github <i className="fab fa-github"></i></a>, support on bmc <a href="https://www.buymeacoffee.com/582rhJH" target="_BLANK" rel="noopener noreferrer">buy me a coffee <i className="fas fa-coffee"></i></a>.
          </div>
        }

        { !this.state.loading && this.state.entries.length == 0 && 
          <div className="main-content main-footer">
            Made by <a href="https://davidesantangelo.com" target="_BLANK">Davide Santangelo</a>.
          </div>
        } 
      </div>
    );
  }
}
