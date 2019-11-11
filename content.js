$(document).ready(function() {
  // Configuration of the observer
  let actions = []
  let initialEvent = true
  let first = true
  let rank = []
  var config = { 
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true
  };

  let checkArray = (array, item) => {
    for (let i = 0; i < array.length; i ++) {
      if (array[i].name === item.name) {
        positionCheck(array[i], item)
        fireCheck(array[i], item)
        array[i] = item
        return
      }
    }
    array.push(item)
  }

  let fireCheck = (previous, current) => {
    if (previous.fire >= 6 && current.fire < 6) {
      // alert(`${current.name} just lost their streak of ${previous.fire}`)
      // actionQue()
    }
    else if (previous.fire < 6 && current.fire == 6) {
      createImage(chrome.extension.getURL("images/startingDB.gif"))
    }
    else if (previous.fire < 12 && current.fire == 12) {
      createImage(chrome.extension.getURL("images/strongDB.gif"))
    }
    else if (previous.fire < 18 && current.fire == 18) {
      actionQue(
        1,
        1,
        createAudio(new Audio(chrome.runtime.getURL("./sounds/gokutrans2.mp3"))),
        createImage(chrome.extension.getURL("images/ultimateDB.gif")))
    }
    else if (previous.fire < 24 && current.fire == 24) {
      // alert(`${current.name} fire 24`)
      // actionQue()
    }
    else if (previous.fire < 30 && current.fire == 30) {
      // alert(`${current.name} fire 30`)
      // actionQue()
    }
  }

  let positionCheck = (previous, current) => {
    if (previous.rank == 1 && current.rank > 1) {
      actionQue(
        1,
        1,
        createAudio(new Audio(chrome.runtime.getURL("./sounds/doh.mp3"))),
        createImage(chrome.extension.getURL("images/swordFight.gif")))
    }
    else if (previous.rank > 1 && current.rank == 1) {
      actionQue(
        1,
        1,
        createAudio(new Audio(chrome.runtime.getURL("./sounds/austin_yeah.mp3"))),
        createImage(chrome.extension.getURL("images/swordFight.gif")))
    }
  }

  let createImage = (url) => {
    return () => {
      var div = document.createElement("DIV")
      div.id = "fire-image"
      var img = document.createElement("IMG")
      img.src = url
      div.appendChild(img)
      document.body.appendChild(div)
    }
  }

  let createAudio = (myAudio) => {
    myAudio.onended = () => {
      if (actions.length == 0) {
        initialEvent = true
        let elem = document.getElementById('fire-image');
        elem.parentNode.removeChild(elem);
      }
      else {
        let elem = document.getElementById('fire-image');
        elem.parentNode.removeChild(elem);
        let action = actions.shift()
        action.audioAction.play()
        action.imageAction()
      }
    }
    return myAudio
  }

  let actionQue = (type, code, audioAction, imageAction) => {
     actions.push({audioAction, imageAction})
    if (initialEvent) {
      actions.shift()
      audioAction.play()
      imageAction()
      initialEvent = false
    }
  }

  // Create an observer instance
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        // Get the Twitter modal window replies count
        if (mutation.target.className == "report-player" && first) {
          first = false
          checkArray(rank, {
            name: mutation.target.children[2].innerText,
            rank: mutation.target.children[0].children[1].innerText,
            fire: mutation.target.children[3].children[0].children[1].innerText
          })
          // console.log(rank)
        }
        else {
          first = true
        }
      });
    });

  // Select the target node (tweet modal)
  setTimeout(function(){
    var target = document.getElementsByClassName("report-players").item(0)
    // console.log(target)
    observer.observe(target, config);
  }, 10000);
});
