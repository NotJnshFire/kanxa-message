const ProfanityWord = require('../models/ProfanityWord');

class ProfanityFilter {
  constructor() {
    this.words = [];
    this.loadProfanityWords();
  }

  async loadProfanityWords() {
    try {
      const words = await ProfanityWord.find({ isActive: true });
      this.words = words.reduce((acc, word) => {
        acc[word.word] = word.severity;
        return acc;
      }, {});
    } catch (error) {
      console.error('Error loading profanity words:', error);
    }
  }

  check(text) {
    const lowerText = text.toLowerCase();
    let hasProfanity = false;
    let severity = 'low';

    for (const [word, wordSeverity] of Object.entries(this.words)) {
      if (lowerText.includes(word)) {
        hasProfanity = true;
        if (wordSeverity === 'high' || (wordSeverity === 'medium' && severity !== 'high')) {
          severity = wordSeverity;
        }
      }
    }

    return { hasProfanity, severity };
  }

  filter(text) {
    let filtered = text;
    for (const word of Object.keys(this.words)) {
      const regex = new RegExp(word, 'gi');
      filtered = filtered.replace(regex, '*'.repeat(word.length));
    }
    return filtered;
  }

  addWord(word, severity = 'medium') {
    this.words[word.toLowerCase()] = severity;
  }

  removeWord(word) {
    delete this.words[word.toLowerCase()];
  }
}

module.exports = new ProfanityFilter();
