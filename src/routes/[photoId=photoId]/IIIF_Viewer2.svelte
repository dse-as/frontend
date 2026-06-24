import 'openseadragon-iiif';

const createViewer = () => {
  viewer = new OpenSeadragon.Viewer({ ... });
  
  // Now this will work with IIIF manifests!
  if (!manifest) return;
  viewer.open(manifest); 
};