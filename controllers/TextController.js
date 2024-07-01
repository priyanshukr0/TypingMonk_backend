//importing text Data
const { lowerCaseOnly,
  lowerCase_with_numbers,
  lowerCase_and_punctuation,
  lowerCase_punctuation_and_numbers, } = require('../utils/data/textData');

// shufflerFunction 
function shuffleTextData(textData, noOfWords) {
  const words = textData.split(/\s+/);
  // Shuffle the words randomly
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
  }
  // Return the specified number of words
  return words.slice(0, noOfWords).join(" ");
}



async function fetchTextData(req, res) {
  try {
    const { testMode, testName, punctuation, number } = req.body;
    // console.log(testMode, testName, punctuation, number, 'in backend')

    if (!(testMode && testName)) {

      return res.status(400).json({ success: false, message: "Some parameters are missing in the req.body" })
    }
    if (testMode === "word") {
      let textData = '';
      if (punctuation && number) {
        textData = shuffleTextData(lowerCase_punctuation_and_numbers, testName);
      }
      else if (number) {
        textData = shuffleTextData(lowerCase_with_numbers, testName);
      }
      else if (punctuation) {
        textData = shuffleTextData(lowerCase_and_punctuation, testName);
      }
      if (!textData) {
        textData = shuffleTextData(lowerCaseOnly, testName);
      }
      return res.status(200).json({ success: true, textData, message: 'textData fetched successfully' })

    }

    else if (testMode == "time") {
      let textData = '';
      if (punctuation && number) {
        textData = shuffleTextData(lowerCase_punctuation_and_numbers, testName * 6);
      }
      else if (number) {
        textData = shuffleTextData(lowerCase_with_numbers, testName * 6);
      }
      else if (punctuation) {
        textData = shuffleTextData(lowerCase_and_punctuation, testName * 6);
      }
      if (!textData) {
        textData = shuffleTextData(lowerCaseOnly, testName * 6);
      }
      return res.status(200).json({ success: true, textData, message: 'textData fetched successfully' })
    }
    else {
      return res(400).json({ success: false, message: 'invalid testMode' });
    }

  } catch (error) {
    console.log("error occured while fetching text", error);
    return res.status(500).json({ success: false, message: 'internal server error' });
  }
}

module.exports = { fetchTextData }; 