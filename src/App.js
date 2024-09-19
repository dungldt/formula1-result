import { useState } from "react";
import './App.css';
import FilterBar from "./components/FilterBar";
import ResultList from "./components/ResultList";
import data from "./data/data.json";
import { filter } from "./util";

function App() {
  const [filteredData, setFilteredData] = useState([]);
  const [year, setYear] = useState('');
  const [type, setType] = useState('');
  const [record, setRecord] = useState('');

  const handleFilter = (year, type, record) => {
    const result = filter(data, year, type, record);
    setFilteredData(result);
    setYear(year);
    setType(type);
    setRecord(record);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-3">
          <FilterBar
            years={Object.keys(data).sort((a, b) => a < b ? 1 : -1)}
            allData={data}
            onFilter={handleFilter}
          />
        </div>
        <div className="col-sm-9">
          <div className="row mt-5">
            <ResultList list={filteredData} year={year} type={type} record={record} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
