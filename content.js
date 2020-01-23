$(document).ready(function() {
  // Configuration of the observer
  const cutOff = 50
  let actions = []
  let initialEvent = true
  let first = true
  let rank = []
  let warned = []
  var config = { 
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true
  };

  let bootCheck = (player) => {
    let total = parseFloat(player.correct) + parseFloat(player.incorrect)
    let remaining = 100 - total
    let current  = (parseFloat(player.correct) / total) * 100
    if ((current + remaining) < cutOff) {
      bootPlayer(player)
    }
    else if ((current + remaining) < cutOff * 1.22) {
      bootWarning(player)
    }
  }

  let bootWarning = (player) => {
    for(var i = 0; i < warned.length; i++) {
      if (warned[i].name == player.name) {
        return
      }
    }
    warned.push(player)
    actionQue(
      createAudio(new Audio(chrome.runtime.getURL("./sounds/slowDown.mp3"))),
      createImage(chrome.extension.getURL("images/slowDown.gif"), `${player.name} slow down, be excelent!`)
    )
  }

  let bootPlayer = (player) => {
    player.bootButton.click()
    document.getElementsByClassName("yes-btn").item(0).click()
    setTimeout(function(){
      document.getElementsByClassName("yes-btn").item(0).click()
    }, 300)

    for(var i = 0; i < warned.length; i++) {
      if (warned[i].name == player.name) {
        warned.splice(i, 1)
      }
    }
  }

  let checkArray = (array, item) => {
    for (let i = 0; i < array.length; i ++) {
      if (array[i].name === item.name) {
        positionCheck(array[i], item)
        fireCheck(array[i], item)
        bootCheck(item)
        array[i] = item
        return
      }
    }
    array.push(item)
  }

  let fireCheck = (previous, current) => {
    if (previous.fire >= 12 && current.fire < 12) {
      actionQue(
        createAudio(new Audio(chrome.runtime.getURL("./sounds/shutdown.mp3"))),
        createImage(chrome.extension.getURL("images/dumb.gif"), `${current.name} lost a fire of ${previous.fire}`)
      )
    }
    else if (previous.fire >= 6 && current.fire < 6) {
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
    else if (previous.fire < 25 && current.fire == 25) {
      actionQue(
        createAudio(new Audio(chrome.runtime.getURL("./sounds/Nuke.mp3"))),
        createImage(chrome.extension.getURL("images/nuke.gif"), `${current.name} is blastin yall with a fire of ${current.fire}`)
      )
    }
    else if (previous.fire < 30 && current.fire == 30) {
      // alert(`${current.name} fire 30`)
      // actionQue()
    }
  }
  else if (previous.fire < 27 && current.fire == 27) {
      actionQue(
        createAudio(new Audio(chrome.runtime.getURL("./sounds/it's_over_nine_thousand.mp3"))),
        createImage(chrome.extension.getURL("images/image.jpg"), `${current.name} has a fire of ${current.fire}`)
      )
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
            fire: mutation.target.children[3].children[0].children[1].innerText,
            correct: mutation.target.children[3].children[0].children[0].children[0].style.cssText.split(" ")[1].split("%")[0],
            incorrect: mutation.target.children[3].children[0].children[0].children[1].style.cssText.split(" ")[1].split("%")[0],
            bootButton: mutation.target.children[5].children[0]
          })
        }
        else {
          first = true
        }
      });
    });

  // Select the target node (tweet modal)
  setTimeout(function(){
    var target = document.getElementsByClassName("report-players").item(0)
    observer.observe(target, config);
    //for testing
    // let p = {fire: 24}
    // let c = {fire: 0, name: 'Jade'}
    // fireCheck(p, c)
    // bootWarning({correct: 0, incorrect: 90, name: 'Jade'})
  }, 10000);
});
