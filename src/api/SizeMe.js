
class ItemMap {
    addItem = (key, value) => {
        this[key] = value;
        return this;
    };

    addItems (...items) {
        if (items.length % 2 !== 0) {
            throw new Error(
                "Arguments must be 'tuples' (example: (key1, value1, key2, value2, ...)"
            );
        }

        let item;
        while ((item = items.shift())) {
            this.addItem(item, items.shift());
        }
        return this;
    }

    static fromObject (obj) {
        let map = new ItemMap();
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                map.addItem(key, obj[key]);
            }
        }
        return map;
    }
}

class FitRequest {
    constructor (subject, item) {
        if (typeof subject === "string") {
            this.profileId = subject;
        } else {
            this.measurements = subject;
        }

        if (typeof item === "string") {
            this.sku = item;
        } else {
            this.item = item;
        }
    }
}

class Item {
    constructor (itemType, itemLayer = 0,
                 itemThickness = 0, itemStretch = 0,
                 fitRecommendation = 0) {
        this.itemType = itemType;
        this.itemLayer = itemLayer;
        this.itemThickness = itemThickness;
        this.itemStretch = itemStretch;
        this.fitRecommendation = fitRecommendation;
        this.measurements = new ItemMap();
    }

    addOption (label, measurements) {
        this.measurements.addItem(label, measurements);
        return this;
    }
}

/*const fitRanges = {
    too_small: {
        start: 0,
        end: 1000
    },
    slim: {
        start: 1000,
        end: 1050
    },
    regular: {
        start: 1050,
        end: 1110
    },
    loose: {
        start: 1110,
        end: 1170
    },
    too_big: {
        start: 1170,
        end: 99990
    }
};*/

export {
    ItemMap,
    FitRequest,
    Item
};
