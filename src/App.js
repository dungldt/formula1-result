import { useState } from "react";
import './App.css';
import FilterBar from "./components/FilterBar";
import ResultList from "./components/ResultList";
import data from "./data/data.json";
import { filter } from "./util";

function App() {
  const [filteredData, setFilteredData] = useState([]);

  const handleFilter = (year, type, record) => {
    const result = filter(data, year, type, record);
    setFilteredData(result);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-3">
          <FilterBar
            years={Object.keys(data)}
            allData={data}
            onFilter={handleFilter}
          />
        </div>
        <div className="col-sm-9">
          <div className="row mt-5">
            <ResultList list={filteredData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
