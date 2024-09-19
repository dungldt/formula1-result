import { useEffect, useState } from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import AllDriversChart from './AllDriversChart';
import { getColumnsDataTableFromResultList } from '../util';

const ResultList = ({ list, year, type, record }) => {
  const { SearchBar } = Search;
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns(getColumnsDataTableFromResultList(list))
  }, [columns.length, list]);

  return (
    <div>
      {columns.length > 0 ? (
        <>
          {type === 'drivers' && record === 'all' ? (<AllDriversChart list={list} year={year} />) : ''}
          <ToolkitProvider
            keyField="id"
            data={list}
            columns={columns}
            search
          >
            {
              props => (
                <div>
                  <div className="my-2">
                    <SearchBar {...props.searchProps} />
                  </div>
                  <BootstrapTable
                    classes="react-bootstrap-table"
                    keyField="id"
                    {...props.baseProps}
                  />
                </div>
              )
            }
          </ToolkitProvider>
        </>
      ) : 'No results are currently available'}
    </div >
  );
};

export default ResultList;
