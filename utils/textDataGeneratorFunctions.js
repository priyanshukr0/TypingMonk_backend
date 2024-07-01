//percentage should be between (0.1 to 0.9) (0.1==10% 0.9 = 90%)
function lowerCase_and_punctuation_Generator(lowerText, percentage) {
    // Split the text into words
    const words = lowerText.split(/\s+/);

    // Calculate the number of words to capitalize
    const wordsToCapitalize = Math.ceil(words.length * percentage);

    // Create an array to store the modified words
    const modifiedWords = [];

    // Iterate through the words
    for (let i = 0; i < words.length; i++) {
        let word = words[i];
        // Capitalize the first letter randomly for 30% of the words
        if (i < wordsToCapitalize && Math.random() < 0.3) {
            word = word.charAt(0).toUpperCase() + word.slice(1);
        }
        // Include symbols and numbers heavily
        const symbolsAndNumbers = "!@#$%^&*()_+{}|:\"<>?-=[]\\;',./0123456789";
        for (let j = 0; j < word.length; j++) {
            if (Math.random() < 0.6) { // 60% chance of including symbols and numbers
                const randomIndex = Math.floor(Math.random() * symbolsAndNumbers.length);
                word = word.slice(0, j) + symbolsAndNumbers.charAt(randomIndex) + word.slice(j);
            }
        }
        modifiedWords.push(word);
    }
    // Join the modified words into a string
    return modifiedWords.join(" ");
}

//percentage should be between (0.1 to 0.9) (0.1==10% 0.9 = 90%)
function lowerCase_punctuation_and_numbers_Generator(text, percentage) {
    const words = text.split(/\s+/);
    const wordCount = words.length;
    const wordsToCapitalize = Math.floor(wordCount * percentage); // 20% of the words
    // Helper function to randomly select symbols and numbers
    function getRandomSymbolOrNumber() {
        const symbols = ",.?!/";
        const numbers = "0123456789";
        const characters = symbols + numbers;
        return characters.charAt(Math.floor(Math.random() * characters.length));
    }
    // Iterate over each word and apply modifications
    for (let i = 0; i < wordsToCapitalize; i++) {
        const index = Math.floor(Math.random() * wordCount);
        const word = words[index];
        // Capitalize the first letter
        words[index] = word.charAt(0).toUpperCase() + word.slice(1);
        // Randomly include symbols and numbers
        const symbolOrNumber = getRandomSymbolOrNumber();
        words[index] += symbolOrNumber;
    }
    return words.join(" ");
}

//percentage(how much number to include in the returned string)
//percentage should be between (0.1 to 0.9) (0.1==10% )
function lowerCase_And_numbers_Generator(paragraph, percentage) {
    const words = paragraph.split(/\s+/);
    noOfWords = words.length;
    const wordsWithNumbers = [];
    console.log('length of the array', words.length)

    // Determine the number of words to include numbers in
    const numWordsWithNumbers = Math.ceil(noOfWords * (percentage / 100));

    for (let i = 0; i < noOfWords; i++) {
        let word = words[i % words.length]; // Cycling through the words

        // Include numbers in 40% of the words
        if (i < numWordsWithNumbers) {
            // Randomly generate a number
            const randomNumber = Math.floor(Math.random() * 1000); // Adjust the range of random numbers as needed

            // Decide whether to include a space before the number
            const includeSpace = Math.random() < 0.5; // Adjust the probability as needed
            if (includeSpace) {
                word += ' ' + randomNumber;
            } else {
                word += randomNumber;
            }
        }
        wordsWithNumbers.push(word);
    }
    // Shuffle the words randomly
    for (let i = wordsWithNumbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [wordsWithNumbers[i], wordsWithNumbers[j]] = [wordsWithNumbers[j], wordsWithNumbers[i]];
    }
    // Return the specified number of words as a string
    return wordsWithNumbers.slice(0, noOfWords).join(" ");
}


module.exports = {
    lowerCase_punctuation_and_numbers_Generator,
    lowerCase_And_numbers_Generator,
    lowerCase_and_punctuation_Generator
}