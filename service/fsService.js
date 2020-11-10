const fs = require('fs')

const read = async ()=>{
    let result = await fs.readFileSync('./txt/input.txt', "utf8");
    return result
}

const write = async (req)=>{
    await fs.writeFileSync("txt/output.txt", req)
    return 'File created'
}

module.exports = {
    read,
    write
}