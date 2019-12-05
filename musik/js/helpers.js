function hideElement(element) {
  element.style.display = "none";
}

function showElement(element, blockType = "inline-block"){
  element.style.display = blockType;
}

function clearElement(element) {
  element.innerHTML = ""
}
