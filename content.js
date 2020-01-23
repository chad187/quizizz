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
      actionQue(
        createAudio(new Audio(chrome.runtime.getURL("./sounds/fail.mp3"))),
        createImage(chrome.extension.getURL("images/fail.gif"), `${current.name} lost a fire of ${previous.fire}`)
      )
    }
    else if (previous.fire < 6 && current.fire == 6) {
      actionQue(
        createAudio(new Audio(chrome.runtime.getURL("./sounds/powerup1.mp3"))),
        createImage(chrome.extension.getURL("images/startingDB.gif"), `${current.name} has a fire of ${current.fire}`)
      )
    }
    else if (previous.fire < 12 && current.fire == 12) {
      actionQue(
        createAudio(new Audio(chrome.runtime.getURL("./sounds/gokutrans2.mp3"))),
        createImage(chrome.extension.getURL("images/startingDB.gif"), `${current.name} has a fire of ${current.fire}`)
      )
    }
    else if (previous.fire < 18 && current.fire == 18) {
      actionQue(
        createAudio(new Audio(chrome.runtime.getURL("./sounds/turn_down_for_what.mp3"))),
        createImage(chrome.extension.getURL("images/ultimateDB.gif"), `${current.name} has a fire of ${current.fire}`)
      )
    }
    else if (previous.fire < 24 && current.fire == 24) {
      // alert(`${current.name} fire 24`)
      // actionQue()
    }
     else if (previous.fire < 27 && current.fire == 27) {
      actionQue(
        createAudio(new Audio(chrome.runtime.getURL("./sounds/it's_over_nine_thousand.mp3"))),
        createImage(chrome.extension.getURL("images/Calculator.jpg"), `${current.name} has a fire of ${current.fire}`)
      )
    }
    else if (previous.fire < 30 && current.fire == 30) {
      // alert(`${current.name} fire 30`)
      // actionQue()
    }
    else if (previous.fire < 36 && current.fire == 36) {
      actionQue(
        createAudio(new Audio(chrome.runtime.getURL("./sounds/best.mp3"))),
        createImage(chrome.extension.getURL("images/pirate.jpg"), `${current.name} has a fire of ${current.fire}`)
      )
    }
  let positionCheck = (previous, current) => {
    if (previous.rank == 1 && current.rank > 1) {
      // actionQue(
      //   createAudio(new Audio(chrome.runtime.getURL("./sounds/doh.mp3"))),
      //   createImage(chrome.extension.getURL("images/swordFight.gif"))
      // )
    }
    else if (previous.rank > 1 && current.rank == 1) {
      actionQue(
        createAudio(new Audio(chrome.runtime.getURL("./sounds/austin_yeah.mp3"))),
        createImage(chrome.extension.getURL("images/swordFight.gif"), `${current.name} is battling for the lead!`)
      )
    }
  }

  let createImage = (url, message) => {
    return () => {
      let div = document.createElement("DIV")
      div.id = "fire-image"
      let img = document.createElement("IMG")
      img.src = url
      div.appendChild(img)
      let h1 = document.createElement("H1")
      h1.innerHTML = message
      div.appendChild(h1)
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

  let actionQue = (audioAction, imageAction) => {
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
