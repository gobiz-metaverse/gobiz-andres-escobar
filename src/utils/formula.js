data = {
    'K-HN': {
        '0': 12000,
        '6': 13000,
        '11': 13000,
        '15': 13000,
    },
    'S-SG': {
        '0': 13000,
        '1': 13000,
        '2': 13000,
    },
};

function transformData(data) {
    let transformed = {};
    for (let warehouse in data) {
        for (let key in data[warehouse]) {
            if (!transformed.hasOwnProperty(key)) {
                transformed[key] = {};
            }

            transformed[key][warehouse] = data[warehouse][key]
        }
    }
    return transformed
}

function quantityFormula(data) {
    return 'actualWeight'
}

function priceFormula(data) {
    let transformed = transformData(data);
    let keys = Object.keys(transformed);

    let pricing = pricingByWH(transformed[keys[0]]);

    for (let ii =1; ii < keys.length; ii++) {
        let wh = pricingByWH(transformed[keys[ii]]);
        pricing = `(handlingTime["READY_FOR_DELIVERY"] >= ${keys[ii]} ? ${wh} : ${pricing})`
    }
    console.info(pricing)
}

function pricingByWH(data) {
    let pricing = '0.00';
    let keys = Object.keys(data);
    for (let ii =0; ii < keys.length; ii++) {
        let wh = data[keys[ii]];
        pricing = `(deliveryWarehouse == '${keys[ii]}' ? ${wh} : ${pricing})`
    }
    return pricing
}

quantityFormula(data);
priceFormula(data);