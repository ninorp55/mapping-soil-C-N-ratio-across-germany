// ------------------------------------------------------------
// NDVI Composite from Landsat 8 (2012–2014)
// Germany Bounding Box
// Cloud masked, high-quality pixels only
// Export in EPSG:4326 to Google Drive
// ------------------------------------------------------------

// 1. Define Germany bounding box (EPSG:4326)
var germany = ee.Geometry.Rectangle([
  5.85249, 47.27112,   // xmin, ymin
  15.02206, 55.06533   // xmax, ymax
], null, false);

// 2. Load Landsat 8 Collection 2 Level 2 Surface Reflectance
var landsat = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
  .filterBounds(germany)
  .filterDate('2013-04-01', '2015-11-01')
  .filter(ee.Filter.calendarRange(5, 9, 'month'))  // May–September (growing season)
  ;

// 3. Function to mask clouds and poor quality pixels
function maskL8sr(image) {

  // QA_PIXEL band bit flags (Collection 2 documentation)
  var qa = image.select('QA_PIXEL');

  var cloudShadowBitMask = (1 << 4);
  var cloudsBitMask      = (1 << 3);
  var cirrusBitMask      = (1 << 2);
  var snowBitMask        = (1 << 5);

  // Mask clouds, cloud shadows, cirrus, snow
  var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
    .and(qa.bitwiseAnd(cloudsBitMask).eq(0))
    .and(qa.bitwiseAnd(cirrusBitMask).eq(0))
    .and(qa.bitwiseAnd(snowBitMask).eq(0));

  // Apply radiometric scaling factors (Collection 2)
  var opticalBands = image.select(['SR_B4', 'SR_B5'])
    .multiply(0.0000275)
    .add(-0.2);

  return image.addBands(opticalBands, null, true)
              .updateMask(mask)
              .copyProperties(image, image.propertyNames());
}

// 4. Apply cloud mask
var cleanCollection = landsat.map(maskL8sr);

// 5. Calculate NDVI (Band 5 = NIR, Band 4 = Red)
var ndviCollection = cleanCollection.map(function(image) {
  var ndvi = image.normalizedDifference(['SR_B5', 'SR_B4'])
                  .rename('NDVI');
  return ndvi.copyProperties(image, image.propertyNames());
});

// 6. Create 3-year median composite
var ndviMedian = ndviCollection.median()
  .clip(germany)
  .reproject({
    crs: 'EPSG:3035',
    scale: 250
  });

// 7. Display
Map.centerObject(germany, 6);
Map.addLayer(ndviMedian,
  {min: 0, max: 0.8, palette: ['white', 'yellow', 'green']},
  'NDVI 2013-2015 Growing Season Median');

// 8. Export to Google Drive
Export.image.toDrive({
  image: ndviMedian,
  description: 'NDVI_Germany_2013_2015_Median',
  folder: 'GEE_exports',
  fileNamePrefix: 'NDVI_Germany_2013_2015',
  region: germany,
  crs: 'EPSG:3035',
  scale: 250,
  maxPixels: 1e13
});
