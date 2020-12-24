async function quickstart() {
  // Imports the Google Cloud client library
  const vision = require('@google-cloud/vision');

  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  // Performs label detection on the image file
  const [result] = await client.textDetection('./ressources/preview-xl.jpg');
  console.log(result)
  const labels = result.textAnnotations;
  console.log('Labels: ');
  labels.forEach(label => console.log(label.description));
}
quickstart();