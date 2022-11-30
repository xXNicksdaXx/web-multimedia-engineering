const express = require('express');
const csv = require('csvtojson');
const cors = require('cors')

const app = express();
const port = 3000;
let worldDataJson;

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
    let temporaryJSON = worldDataJson;
    let length = temporaryJSON.length;

    for(let input of req.body) {
        // validation of input element
        // 1. valid id
        if (input["id"] == null) {
            res.send('Element does not possess id!');
            return;
        } else {
            let duplicate = null;
            let inputId = parseInt(input["id"]);
            for(let element of temporaryJSON) {
                let currentId = parseInt(element["id"]);
                if(inputId === currentId)
                    duplicate = element;
            }
            if (duplicate != null) {
                res.send(`Element with id ${inputId} does already exist!`);
                return;
            }
        }
        // valid amount of keys
        if (Object.keys(input).length < 3) {
            res.send('Element does not possess enough keys!');
            return;
        }

        temporaryJSON[length] = input;
        length++;
    }

    worldDataJson = temporaryJSON;
    res.send('Updated json successfully!');
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