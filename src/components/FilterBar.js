import { useState, useEffect } from "react";
import { getRecords } from "../util";

const FilterBar = ({
  years,
  allData,
  onFilter
}) => {
  const [types, setTypes] = useState([]);
  const [records, setRecords] = useState([]);
  const [year, setYear] = useState('2023');
  const [type, setType] = useState('races');
  const [record, setRecord] = useState('all');

  const [filters, setFilters] = useState({
    year: "",
    type: "",
    record: ""
  });

  useEffect(() => {
    const newTypes = allData[year];
    const newRecords = getRecords(allData, year, type);
    setTypes(newTypes);
    setRecords(newRecords);
  }, [year, type, allData]);
  useEffect(() => {
    onFilter(year, type, record);
  }, [year, type, record, onFilter]);


  const handleInput = (field) => (event) => {
    const { value } = event.target;

    setFilters({
      ...filters,
      [field]: value,
    });

    switch (field) {
      case "year":
        setYear(value);
        setRecord('all');
        break;
      case "type":
        setType(value);
        setRecord('all');
        break;
      case "record":
        setRecord(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="row my-5">
      <div className="col">
        <h4 className="border-bottom">Filters</h4>
      </div>
      <div className="col-sm-12 my-2">
        <label htmlFor="year">Year</label>
        <select
          className="form-control"
          id="year"
          onChange={handleInput('year')}
        >
          {years.map((year) => (
            <option value={year} key={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="col-sm-12 my-2">
        {types.map((item) => {
          return (
            <div key={item.data_type}>
              <input
                type="radio"
                value={item.data_type}
                id={item.data_type}
                name="type"
                checked={type === item.data_type}
                onChange={handleInput('type')}
              />
              <label htmlFor={item.data_type} className="mx-2">{item.name}</label>
            </div>
          );
        })}
      </div >
      <div className="col-sm-12 my-2">
        {records.map((item) => {
          return (
            <div key={item}>
              <input
                type="radio"
                value={item}
                id={item}
                name="record"
                checked={record === item}
                onChange={handleInput('record')}
              />
              <label htmlFor={item} className="mx-2">{item.replace('_', ' ')}</label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FilterBar;
