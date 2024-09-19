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
    console.log(year, type, record);
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
    if (dataOfType[record] !== undefined) {
        return dataOfType[record];
    }

    return [];
};
