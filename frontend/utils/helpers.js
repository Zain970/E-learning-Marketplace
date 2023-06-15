
function currencyFormatter(data) {
    console.log("Data : ", data);
    const result = (data.amount * 100 / 100).toLocaleString(data.currency, {
        style: "currency",
        currency: data.currency
    })

    console.log("Result : ", result);

    return result;
}

export default currencyFormatter