const nestify = (flatObject) => {
    let nested = {};
    Object.keys(flatObject).forEach((key) => {
      const keys = key.split(".");
      let current = nested;
      for (let i = 0; i < keys.length; i++) {
        if (i === keys.length - 1) {
          current[keys[i]] = flatObject[key];
        } else {
          current[keys[i]] = current[keys[i]] || {};
          current = current[keys[i]];
        }
      }
    });
    return nested;
  };
  
  module.exports = nestify;
  