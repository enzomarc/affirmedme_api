const fs = require('fs');

process.env.GOOGLE_APPLICATION_CREDENTIALS = './affirmed-94bfcc1beecc.json'


/**
 * Scan a business card and return the tex_description.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.scan = async (req, res) => {
  const data = req.body;

  if (req.files) {
    if (req.files.image) {
      let image = req.files.image;
      image.mv('./ressources/' + image.name);

      try {
        // Creates a client
        const client = new vision.ImageAnnotatorClient();

        // Performs text detection on the local file
        const [result] = await client.textDetection('./resources/' + image.name);
        const detections = result.textAnnotations;
        /*const [ text, ...others ] = detections
        console.log(`Text: ${ text.description }`);*/
        res.json({ result: detections });
        //labels.forEach(label => console.log(label.description));
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occured", error: error });
      }
    } 
  } 
}