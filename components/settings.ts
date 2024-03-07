import storage from "./storage";



export const loadSettings = () => {
  // Return the promise chain
  return storage.load({
    key: 'settings',
  }).then(ret => {
    if (ret) {
      // Found data
      console.log('found data:', ret);
      return JSON.parse(ret); // Parse and return the settings
    } else {
      // No data found
      console.log('no data found');
      return null; // Return null or a default settings object
    }
  }).catch(err => {
    // Handle any exception, including data not found
    console.warn(err.message);
    switch (err.name) {
      case 'NotFoundError':
        // Handle not found error
        break;
      case 'ExpiredError':
        // Handle expired data error
        break;
    }
    return null; // Return null or default settings on error
  });
};

export const saveSettings = (settings: { url: string; systemPrompt: string; temperature: GLfloat}) => {
  // Save the settings to the storage
  storage.save({
    key: 'settings',
    data: JSON.stringify(settings),
  });
  console.log('settings saved:', JSON.stringify(settings));
};
