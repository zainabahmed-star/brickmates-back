const axios = require('axios')
 
const REBRICKABLE_BASE_URL = 'https://rebrickable.com/api/v3/lego'
 
const index = async (req, res) => {
    try {
        const response = await axios.get(`${REBRICKABLE_BASE_URL}/sets/`, {
            headers: {
                Authorization: `key ${process.env.REBRICKABLE_API_KEY}`,
            },
            params: {
                page_size: 20,
            },
        })
 
        const sets = response.data.results.map((set) => ({
            setNum: set.set_num,
            name: set.name,
            year: set.year,
            numParts: set.num_parts,
            imageUrl: set.set_img_url,
        }))
 
        res.json(sets)
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}

const search = async (req, res) => {
    try {
        const { q } = req.query

        const response = await axios.get(`${REBRICKABLE_BASE_URL}/sets/`, {
            headers: {
                Authorization: `key ${process.env.REBRICKABLE_API_KEY}`,
            },
            params: {
                search: q,
                page_size: 20,
            },
        })

        const sets = response.data.results.map((set) => ({
            setNum: set.set_num,
            name: set.name,
            year: set.year,
            numParts: set.num_parts,
            imageUrl: set.set_img_url,
        }))

        res.json(sets)
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}

        module.exports ={
            index,
        }