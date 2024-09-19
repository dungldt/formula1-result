export const getRecords = (allData, year, type) => {
    let dataOfYear = allData[year];
    if (!dataOfYear) {
        return [];
    }
    let result = [];
    dataOfYear.every((item) => {
        if (item.data_type === type) {
            result = Object.keys(item.values);
            return false;
        }
        return true;
    });

    return result;
};

export const filter = (allData, year, type, record) => {
    let dataOfYear = allData[year];
    if (!dataOfYear) {
        return [];
    }
    let dataOfType = [];
    dataOfYear.every((item) => {
        if (item.data_type === type) {
            dataOfType = item.values;
            return false;
        }
        return true;
    });
    let result = [];
    if (dataOfType[record] !== undefined) {
        let data = dataOfType[record];
        result = data.hasOwnProperty('values') ? data['values'] : data;
    }

    return result;
};

export const getColumnsDataTableFromResultList = (dataList) => {
    if (dataList.length < 1) {
        return [];
    }
    let keys = Object.keys(dataList[0]);
    let columns = keys.map(k => {
        return {
            text: k.replace('_', ' '),
            dataField: k,
            sort: true,
            hidden: k === 'id'
        };
    });

    return columns;
}
