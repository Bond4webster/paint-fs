const service = require('../service/fsService');

class FsController {

    constructor(){}

    readFile = async (req, res) => {
        try {
            const result = await service.read();
            res.status(201).send(result);
        } catch (e) {
            res.status(400).send({error:e.message});
        }
    }

    writeFile = async (req, res) => {
        try {
            const result = await service.write(req.body.result);
            res.status(201).send(result);
        } catch (e) {
            res.status(400).send({error: e.message});
        }
    }

}

module.exports = FsController;