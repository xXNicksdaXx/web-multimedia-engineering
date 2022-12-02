const express = require('express');
const csv = require('csvtojson');
const cors = require('cors')

const app = express();
const port = 3000;
let worldDataJson;
let currentMaxId;



app.use(express.json());
app.use(cors());

app.get('/items', (req, res) => {
    res.json(removeOverheadColumns(worldDataJson));
});

app.get('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let result = {};
    for(let element of worldDataJson) {
        let currentId = parseInt(element["id"]);
        if(id === currentId)
            result = element;
    }
    res.json(removeOverheadColumns([result]));
});

app.get('/items/:id1/:id2', (req, res) => {
    let id1 = parseInt(req.params.id1);
    let id2 = parseInt(req.params.id2);
    let reverse = false;
    if (id1 > id2) {
        let p = id1;
        id1 = id2;
        id2 = p;
        reverse = true;
    }

    const result = worldDataJson.filter((element) => {
        const currentID = parseInt(element["id"]);
        return id1 <= currentID && currentID <= id2;
    });

    if (reverse)
        result.reverse();

    res.json(removeOverheadColumns(result));
});

app.post('/items', (req, res) => {
    if(isIterable(req.body)) {
        for(let input of req.body) {
            const msg = addCountryToJson(input);
            if(msg !== 0) {
                res.send(msg);
                return;
            }
        }
        res.send("Updated json successfully!");
    } else {
        const msg = addCountryToJson(req.body);
        if(msg !== 0) {
            res.send(msg);
            return;
        }
        res.send("Updated json successfully!");
    }
});

app.delete('/items', (req, res) => {
    let length = worldDataJson.length;
    worldDataJson.splice(length-1, 1);
    res.send('Deleted last item from json successfully!');
});

app.delete('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let foundElement = false;
    worldDataJson = worldDataJson.filter((element) => {
        if(id !== parseInt(element["id"])){
            return true;
        } else {
            foundElement = true;
            return false;
        }
    });
    if(foundElement) {
        res.send(`Did not find item with id ${id}!`);
    } else {
        res.send(`Deleted item with id ${id} from json successfully!`);
    }
});

app.get('/properties', (req, res) => {
    res.json(removeOverheadColumns(worldDataJson));
});

app.get('/properties/:num', (req, res) => {
    const num = req.params.num.replaceAll("_", " ");
    const filter = worldDataJson.map((item) => {
        const keys = Object.keys(item);
        const keywords = ["id", "name", num];
        for(let key of keys) {
            if(!keywords.includes(key.replaceAll("_", " ")))
                delete item[key];
        }
        return item;
    });
    res.json(filter);
});

csvToJson("assets/world_data_v3.csv");
app.listen(port, () => {
    console.log(`REST listening on port ${port}`)
});

function csvToJson(filePath) {
    csv()
        .fromFile(filePath)
        .then((jsonObj) => {
            jsonObj.map((item) => {
                for(const key in item) {
                    if(!isNaN(item[key]))
                        item[key] = Number(Number(item[key]).toFixed(3));
                }
            })
            worldDataJson = jsonObj;
            currentMaxId = worldDataJson.length + 1;
        });
}

function removeOverheadColumns(data) {
    return data.map((item) => {
        const keys = Object.keys(item);
        const keywords = ["gps_lat", "gps_long", "military expenditure percent of gdp"];
        for(let key of keys) {
            if(keywords.includes(key))
                delete item[key];
        }
        return item;
    });
}

function isIterable(obj) {
    // checks for null and undefined
    if (obj == null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
}

function addCountryToJson(item) {
    let length = worldDataJson.length;

    let result = {
        "id": currentMaxId
    };

    // validation of input element
    // 1. valid name
    if (item["name"] == null) {
        return 'Element does not possess name!';
    } else {
        let duplicate = null;
        for(let element of worldDataJson) {
            if(item["name"] === element["name"])
                duplicate = element;
        }
        if (duplicate != null) {
            return `Element with name ${item["name"]} does already exist!`;
        }
    }

    // valid amount of keys
    if (Object.keys(item).length < 3) {
        return 'Element does not possess enough keys!';
    }

    for(const key in item) {
        if(!isNaN(item[key]))
            item[key] = Number(Number(item[key]).toFixed(3));
        result[key] = item[key];
    }

    worldDataJson[length] = result;
    currentMaxId++;
    return 0;
}