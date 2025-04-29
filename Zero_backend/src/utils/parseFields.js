const parseJSON = (data, defaultValue) => {
  try {
    // ✅ Ensure correct array parsing
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) return parsed;
    return defaultValue;
  } catch (error) {
    return defaultValue;
  }
};

const parseFields = (body, files) => {
  const parsedData = { ...body };

  parsedData.other_amenities = parseJSON(body.other_amenities, []);
  parsedData.features_amenities = parseJSON(body.features_amenities, []);
  parsedData.nearby_buildings = parseJSON(body.nearby_buildings, []);  // ✅ FIXED
  parsedData.tags = parseJSON(body.tags, []);

  parsedData.building_information = body.building_information || {};
  parsedData.details = body.details || {};
  parsedData.location = body.location || {};

  const images = files?.images?.map(file => file.filename) || [];
  const videos = files?.videos?.map(file => file.filename) || [];
  const baseUrl = `${process.env.DOMAIN}`;

  const imageUrls = images.map(filename => `${baseUrl}/uploads/images/${filename}`);
  const videoUrls = videos.map(filename => `${baseUrl}/uploads/videos/${filename}`);

  parsedData.developer_notes = {
    images: imageUrls,
    videos: videoUrls,
    image_count: imageUrls.length,
    video_count: videoUrls.length,
    video_available: videoUrls.length > 0,
    virtual_tour_available: body.virtual_tour_available || false,
    contact_options: parsedData.contact_options,
    tags: parsedData.tags
  };

  return parsedData;
};

module.exports = parseFields;


