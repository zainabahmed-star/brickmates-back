const axios = require('axios')

const REBRICKABLE_BASE_URL = 'https://rebrickable.com/api/v3/lego'

const mapSet = (set) => ({
  setNum: set.set_num,
  name: set.name,
  year: set.year,
  pieceCount: set.num_parts,
  image: set.set_img_url,
})

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

    const sets = response.data.results.map(mapSet)

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

    const sets = response.data.results.map(mapSet)

    res.json(sets)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
}

const show = async (req, res) => {
  try {
    const response = await axios.get(
      `${REBRICKABLE_BASE_URL}/sets/${req.params.setId}/`,
      {
        headers: {
          Authorization: `key ${process.env.REBRICKABLE_API_KEY}`,
        },
      }
    )

    res.status(200).json(mapSet(response.data))
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ err: 'Set not found' })
    }
    console.error(err)
    res.status(500).json({ err: err.message })
  }
}

module.exports = {
  index,
  search,
  show,
}