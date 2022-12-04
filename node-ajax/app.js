const express = require('express');
const csv = require('csvtojson');
const cors = require('cors')


/**
 *  init
 */
// init global variables
let worldDataJson;
let properties;
let currentMaxId;

// init api
const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());


/**
 *  routes
 */
app.get('/items', (req, res) => res.json(worldDataJson));

app.get('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if(isNaN(id)) {
        res.send(`${req.params.id} is not a number!`);
        return;
    }
    let result = {};
    for(let element of worldDataJson) {
        let currentId = parseInt(element["id"]);
        if(id === currentId)
            result = element;
    }
    res.json([result]);
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

    res.json(result);
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
    if(isNaN(id)) {
        res.send(`${req.params.id} is not a number!`);
        return;
    }
    let foundElement = false;
    worldDataJson = worldDataJson.filter((element) => {
        if(id !== parseInt(element["id"])){
            return true;
        } else {
            foundElement = true;
            return false;
        }
    });
    if(foundElement)
        res.send(`Deleted item with id ${id} from json successfully!`);
    else
        res.send(`Did not find item with id ${id}!`);
});

app.get('/properties', (req, res) => {
    res.json(properties);
});

app.get('/properties/:num', (req, res) => {
    const index = parseInt(req.params.num);
    const visibility = req.headers["visible"];

    let property = properties.filter((property) => {
        if(property["index"] === index) {
            if(visibility != null)
                property["shown"] = Boolean(Number(visibility));
            return true;
        }
        return false;
    });

    if(property.length === 0) {
        res.json({});
    } else if(property.length === 1) {
        res.json(property.pop());
    } else {
        res.json({});
    }
});

csvToJson("assets/world_data_v3.csv");
app.listen(port, () => {
    console.log(`REST listening on port ${port}`)
});



/**
 *  useful functions
 */
function csvToJson(filePath) {
    csv()
        .fromFile(filePath)
        .then((jsonObj) => {
            jsonObj.map((item) => {
                // remove last three attributes (looks better when not shown)
                const keys = Object.keys(item);
                const keywords = ["gps_lat", "gps_long", "military expenditure percent of gdp"];
                for(let key of keys) {
                    if(keywords.includes(key))
                        delete item[key];
                }

                // round numbers
                for(const key in item) {
                    if(!isNaN(item[key]))
                        item[key] = Number(Number(item[key]).toFixed(3));
                }
                return item;
            })
            worldDataJson = jsonObj;
            retrieveProperties(worldDataJson[0]);
            currentMaxId = worldDataJson.length + 1;
        });
}

function retrieveProperties(exampleElement) {
    properties = [];
    let i = 0;
    const keys = Object.keys(exampleElement);
    for(let key of keys) {
        properties[i] = {
            "index": i+1,
            "name": key.replaceAll("_", " "),
            "shown": true
        };
        i++;
    }
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