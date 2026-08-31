const Listing = require('../models/listing')
const cloudinary = require('../config/cloudinary')

const uploadImage = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'brickmates-listing',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      }
    )
    uploadStream.end(fileBuffer)
  })
}

const index = async (req, res) => {
    try {
        const listings = await Listing.find({ status: 'available' })
        .populate('owner', "username avatar")

        res.status(200).json(listings)
    } catch (error) {
        res.status(500).json({ err: error.message })
    }
}

const show = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.listingId)
            .populate('owner', 'username avatar')
        if (!listing) {
            return res.status(404).json({ err: 'Listing not found.' })
        }
        res.json(listing)
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}

const create = async (req, res) => {
    try {
        const listingData = {
            owner: req.user._id,
            setNum: req.body.setNum,
            setName: req.body.setName,
            condition: req.body.condition,
            price: req.body.price,
            description: req.body.description,
            theme: req.body.theme,
        }
 
        if (req.files && req.files.length > 0) {
            const uploadedPhotos = await Promise.all(
                req.files.map((file) => uploadImage(file.buffer))
            )
            listingData.photos = uploadedPhotos.map((photo) => ({
                url: photo.secure_url,
                publicId: photo.public_id,
            }))
        }
 
        const listing = await Listing.create(listingData)
        res.status(201).json(listing)
    } catch (err) {
        res.status(400).json({ err: err.message })
    }
}

const update = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.listingId)
        if (!listing) {
            return res.status(404).json({ err: 'Listing not found.' })
        }
        if (listing.owner.toString() !== req.user._id) {
            return res.status(403).json({ err: 'Unauthorized.' })
        }
 
        const updateData = {
            price: req.body.price,
            description: req.body.description,
            condition: req.body.condition,
            status: req.body.status,
        }
 
        if (req.files && req.files.length > 0) {
            const uploadedPhotos = await Promise.all(
                req.files.map((file) => uploadImage(file.buffer))
            )
            updateData.photos = uploadedPhotos.map((photo) => ({
                url: photo.secure_url,
                publicId: photo.public_id,
            }))
        }
 
        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.listingId,
            updateData,
            { new: true }
        )
        res.json(updatedListing)
    } catch (err) {
        res.status(400).json({ err: err.message })
    }
}

const deleteListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.listingId)
        if (!listing) {
            return res.status(404).json({ err: 'Listing not found.' })
        }
        if (listing.owner.toString() !== req.user._id) {
            return res.status(403).json({ err: 'Unauthorized.' })
        }
 
        await Listing.findByIdAndDelete(req.params.listingId)
        res.json({ message: 'Listing deleted successfully.' })
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}

module.exports = {
    index,
    show,
    create,
    update,
    deleteListing
}