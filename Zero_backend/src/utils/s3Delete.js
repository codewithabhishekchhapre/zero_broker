const s3 = require('./s3Config');

const deleteFromS3 = async (fileKeys = []) => {
  if (!fileKeys.length) return;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Delete: {
      Objects: fileKeys.map(Key => ({ Key })),
      Quiet: false
    }
  };

  return s3.deleteObjects(params).promise();
};

module.exports = deleteFromS3;
