import { useEffect, useState } from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import DriversChart from './DriversChart';
import TeamsChart from './TeamsChart';
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
          {type === 'drivers' ? (<DriversChart list={list} year={year} record={record} />) : ''}
          {type === 'team' ? (<TeamsChart list={list} year={year} record={record} />) : ''}
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
