import React, { Component } from 'react';
import './search.css';

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchValue: '',
    };
  }

  componentDidMount = () => {
    let open = document.getElementById('searchField');
    open.autocomplete = 'off';
  };

  handleChange = (event) => {
    this.setState({ searchValue: event.target.value });
  };

  search = () => {
    this.props.onClick(this.state.searchValue);
    // this.setState({searchValue:''})
  };

  clearSearch = async () => {
    await this.setState({ ...this.state, searchValue: '' });
    this.search();
  };

  handleKeyDown = async (e) => {
    await this.search();
  };

  render() {
    return (
      <div className="search" style={{ height: this.props.height }}>
        <span className="send_icon">
          <i className="fas fa-search"></i>
        </span>
        <input
          className="search_field"
          type="text"
          id="searchField"
          placeholder="Search"
          name="searchValue"
          value={this.state.searchValue}
          onKeyUp={this.handleKeyDown}
          onChange={this.handleChange}
        />
        <span className="twoicon">
          <i
            className={this.state.searchValue.length > 0 ? 'fa fa-times mr-2' : 'd-none'}
            onClick={this.clearSearch}
          ></i>
        </span>
      </div>
    );
  }
}

export default Search;
