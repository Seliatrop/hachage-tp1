import {createBlock, findBlocks} from "./blockchainStorage.js";
import {json} from "node:stream/consumers"

export async function liste(req, res, url) {
    return findBlocks()
}

export async function create(req, res) {
    try {
        const content = await json(req);
        return createBlock(content);
    } catch (error) {
        console.error("Error parsing JSON:", error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ error: 'Invalid JSON format' }));
        res.end();
    }
}


