const cloudinary = require('../config/cloudinary');
const Build = require('../models/build');

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
    const ownerId = req.user._id;

    let image = {};

    if (req.file) {
      const mediaType = req.file.mimetype.split("/")[0];
      const result = await uploadMedia(req.file.buffer, mediaType);

      image.type = mediaType;
      image.url = result.secure_url;
      image.publicId = result.public_id;
    }

    const newBuildData = {
      owner: ownerId,
      image: image,
      isMOC: req.body.isMOC,
      status: req.body.status,
      caption: req.body.caption,
      timeTaken: req.body.timeTaken,
      set: req.body.setId,
    };

    const build = await (await Build.create(newBuildData)).populate('owner');

    res.status(201).json(build);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const index = async (req, res) => {
  try {
    const builds = await Build.find().populate("owner").sort({ createdAt: -1 });

    res.status(200).json(builds);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const show = async (req, res) => {
  try {
    const build = await Build.findById(req.params.buildId).populate('owner').populate('comment.author');

    if (!build) {
      return res.status(404).json({ err: 'Build not found' });
    }

    res.status(200).json(build);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const update = async (req, res) => {
  try {
    const build = await Build.findById(req.params.buildId);

    if (!build) {
      return res.status(404).json({ err: 'Build not found' });
    }

    if (!build.owner.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }

    const { isMOC, status, caption, timeTaken } = req.body;
    const updateData = { isMOC, status, caption, timeTaken };

    if (req.file) {
      if (build.image && build.image.publicId) {
        await cloudinary.uploader.destroy(build.image.publicId);
      }

      const mediaType = req.file.mimetype.split("/")[0];
      const result = await uploadMedia(req.file.buffer, mediaType);

      updateData.image = {
        type: mediaType,
        url: result.secure_url,
        publicId: result.public_id,
      };
    }

    const updatedBuild = await Build.findByIdAndUpdate(
      req.params.buildId,
      updateData,
      { new: true, returnDocument: 'after' }
    );

    updatedBuild._doc.owner = req.user;

    res.status(200).json(updatedBuild);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const deleteBuild = async (req, res) => {
  try {
    const build = await Build.findById(req.params.buildId);

    if (!build) {
      return res.status(404).json({ err: 'Build not found' });
    }

    if (!build.owner.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }

    if (build.image && build.image.publicId) {
      await cloudinary.uploader.destroy(build.image.publicId);
    }

    const deletedBuild = await Build.findByIdAndDelete(req.params.buildId);
    res.status(200).json(deletedBuild);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
const likeToggle = async (req, res) => {
  try {
    const build = await Build.findById(req.params.buildId);

    if (!build) {
      return res.status(404).json({ err: 'Build not found.' });
    }

    if (!build.like) {
      build.like = [];
    }

    const isLiked = build.like.includes(req.user._id);

    if (isLiked) {
      build.like.pull(req.user._id);
    } else {
      build.like.push(req.user._id);
    }

    await build.save();
    await build.populate('owner');
    res.json(build);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
};
module.exports = {
  create,
  index,
  show,
  update,
  deleteBuild,
  likeToggle,
};