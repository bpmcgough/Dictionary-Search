let fs = require('fs');
let treeObj = {};

fs.readFile('./wordsforproblem.txt', "utf-8", (err, data) => {
  if (err) throw err;
  let words = data.split("\n");
  createWordTree(words);
  findConcatenatedWords(words);
});

function Node(value, isWordEnd){
  this.value = value;
  this.children = {};
  this.isWordEnd = isWordEnd;
}

function createWordTree(words){
  // this should create an object with a-z, then for each letter,
  words.forEach(word => {
    let currentParent;
    // find if parent exists already
    if(!treeObj[word[0]]){
      if(word.length === 1){
        treeObj[word[0]] = new Node(word[0], true);
      } else {
        treeObj[word[0]] = new Node(word[0], false);
      }
    }
    currentParent = treeObj[word[0]];
    // make tree
    for(let i = 1; i < word.length; i++){
      // if the next letter is a valid child of the currentParent, move to that letter
      if(currentParent.children[word[i]]){
        currentParent = currentParent.children[word[i]];
      } else {
        // if
        if(i === word.length - 2){
          // if we're at the end of the word, flag this node as a possible ending place
          currentParent.children[word[i]] = new Node(word[i], true);
        } else {
          currentParent.children[word[i]] = new Node(word[i], false);
        }
        currentParent = currentParent.children[word[i]];
      }
    }
  });
}

function findConcatenatedWords(words){
  let concatenatedWords = [];
  let longestLength = 0;
  let longestWord;
  let secondLongestLength = 0;
  let secondLongestWord;
  words.forEach(word => {
    if(isWordConcatenated(word)){
      if(word.length > longestLength){
        longestLength = word.length;
        longestWord = word;
      } else if (word.length > secondLongestLength){
        secondLongestLength = word.length;
        secondLongestWord = word;
      }
      concatenatedWords.push(word);
    }
  });
  console.log(`Number of concatenated words: ${concatenatedWords.length}`);
  console.log(`Longest concatenated word: ${longestWord}`);
  console.log(`Second longest concatenated word: ${secondLongestWord}`);
}

function isWordConcatenated(word){
  // so this starts with 'a' as currentString
  // if the character is a word, then currentString becomes the next letter
  // if its not a word, then add another letter onto it until you find a word
  let currentString = word[0];
  let wellIsIt = true;
  let numWords = 1;
  for(let i = 1; i < word.length; i++){
    if(isStringAWord(currentString)){
      currentString = word[i];
      numWords++; // this could be simpler, because I only care if numWords >= 2
    } else {
      currentString += word[i];
      if(i === word.length - 1 && !isStringAWord(currentString)){
        wellIsIt = false;
        // so if it's looking and looking and finds nothing
        // when it gets to the end, that means that it hasn't found a word
        // that matches these last characters
      }
    }
  }
  if(numWords > 1 && wellIsIt){
    return true;
  }
  return false;
}

function isStringAWord(str, tree){
  if(str.length === 1 && treeObj[str[0]].isWordEnd){
    return true;
  }
  let parent = treeObj[str[0]];
  if(!parent) return false;
  for(let i = 1; i < str.length; i++){
    if(parent.children[str[i]] && i === str.length - 1 && parent.children[str[i]].isWordEnd){
      return true;
    } else if(parent.children[str[i]]){
      parent = parent.children[str[i]];
    } else {
      return false;
    }
  }
}
