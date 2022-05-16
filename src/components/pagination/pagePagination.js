import React, { Component } from 'react';
import Pagination from 'react-js-pagination';

import './style.css';

class pagePagination extends Component {
  constructor(props) {
    super();
    this.state = {
      total: 1,
    };
  }

  render() {
    return (
      <>
        <Pagination
          itemClass="page-item" // add it for bootstrap 4
          linkClass="page-link" // add it for bootstrap 4
          activePage={this.props.activePage}
          itemsCountPerPage={this.props.itemsPerPage}
          totalItemsCount={this.props.totalItems ? this.props.totalItems : this.state.total}
          pageRangeDisplayed={this.props.pageRange}
          onChange={this.props.onChange}
          hideFirstLastPages={true}
        />
      </>
    );
  }
}

export default pagePagination;
