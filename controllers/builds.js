const cloudinary = require('../config/cloudinary');
const Build = require('../models/build');
const axios = require('axios');

const uploadMedia = (fileBuffer, resourceType) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "brickMates",
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

const create = async (req, res) => {
  try {
    const ownerId = req.user_id    

    const set = await axios.get(`https://rebrickable.com/api/v3/lego/sets/${req.body.setNum}/`, {
    headers: { Authorization: `key ${process.env.REBRICKABLE_API_KEY}` }
    })
    
    let image = {}

    if (req.file) {
      const mediaType = req.file.mimetype.split("/")[0]
      const result = await uploadMedia(req.file.buffer, mediaType)

      image.type = mediaType
      image.url = result.secure_url
      image.publicId = result.public_id
    }

    const newBuildData = {
      owner: ownerId,
      image: image,
      isMOC: req.body.isMOC,
      status: req.body.status,
      caption: req.body.caption,
      timeTaken: req.body.timeTaken,
      set: {
    setNum: set.data.set_num,
    name: set.data.name,
    year: set.data.year,
    pieceCount: set.data.num_parts,
    image: set.data.set_img_url,
    },
    }

    const build = await (await Build.create(newBuildData)).populate('owner')

    res.status(201).json(build)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
}

const index = async (req, res) => {
  try {
    const build = await Build.find().populate("owner").sort({ createdAt: -1 })
    
    res.status(200).json(build)
  } catch (error) {
    res.status(500).json({ err: error.message })
  }
}


const show = async (req, res) => {
  try {
    const build = await Build.findById(req.params.buildId).populate('owner')

    if (!build) {
      return res.status(404).json({ err: 'Build not found' })
    }

    res.status(200).json(build)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
}

module.exports ={
    create,
    index,
    show,
}