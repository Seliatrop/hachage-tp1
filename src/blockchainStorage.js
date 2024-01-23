import {readFile, writeFile} from 'node:fs/promises'
import {getDate, monSecret} from "./divers.js";
import {NotFoundError} from "./errors.js";
import {createHash} from 'node:crypto'
import {v4 as uuidv4} from 'uuid';

/* Chemin de stockage des blocks */
const path = '../data/blockchain.json'

/**
 * Mes définitions
 * @typedef { id: string, nom: string, don: number, date: string,hash: string} Block
 * @property {string} id
 * @property {string} nom
 * @property {number} don
 * @property {string} date
 * @property {string} string
 *
 */


/**
 * Renvoie un tableau json de tous les blocks
 * @return {Promise<any>}
 */
export async function findBlocks() {
    try {
        const data = await readFile(path)
        return JSON.parse(data)
    } catch (e) {
        return []
    }
}

/**
 * Trouve un block à partir de son id
 * @param partialBlock
 * @return {Promise<Block[]>}
 */
export async function findBlock(partialBlock) {
    const blocks = await findBlocks()
    const block = blocks.find(block => block.id === partialBlock.id)
    if (!block) {
        throw new NotFoundError()
    }
    return block
}

/**
 * Trouve le dernier block de la chaine
 * @return {Promise<Block|null>}
 */
export async function findLastBlock() {
    const blocks = await findBlocks()
    return blocks[blocks.length - 1] || null
}

/**
 * Creation d'un block depuis le contenu json
 * @param contenu
 * @return {Promise<Block[]>}
 */
export async function createBlock(contenu) {
    const currentDate = getDate();
    const id = uuidv4();
    const lastBlock = await findLastBlock();

    const previousBlockString = JSON.stringify(lastBlock);
    const previousBlockHash = createHash('sha256').update(previousBlockString).digest('hex');

    const block = {
        id: id,
        nom: contenu.nom,
        don: contenu.don,
        date: currentDate,
        hash: createHash('sha256').update(previousBlockHash + id + contenu.nom + contenu.don + currentDate).digest('hex')
    };

    const blocks = await findBlocks();
    blocks.push(block);
    await writeFile(path, JSON.stringify(blocks));
    return block;
}



