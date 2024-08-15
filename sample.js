const editSpeciality = async (req, res) => {
  try {
    const id = req.body.id;
    const editedName = req.body.edit;
    const photo = req.body.photo;

    if (!id || !editedName) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    const existing = await Speciality.findOne({
      speciality: { $regex: new RegExp("^" + editedName + "$", "i") },
    });

    if (existing) {
      if (photo) {
        const photoResult = await cloudinary.uploader.upload(photo, {
          folder: "specialitysvg",
        });
        photoUrl = photoResult.secure_url;
      }
      return res.status(400).json({ message: "Speciality already exists" });
    }

    let photoUrl;

    if (photo) {
      const photoResult = await cloudinary.uploader.upload(photo, {
        folder: "specialitysvg",
      });
      photoUrl = photoResult.secure_url;
    }

    const data = await Speciality.findOneAndUpdate(
      { _id: id },
      { speciality: editedName, ...(photoUrl && { photo: photoUrl }) },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Speciality updated successfully",
      data,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};