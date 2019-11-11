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
      // alert(`${current.name} fire 6`)
      // actionQue()
    }
    else if (previous.fire < 12 && current.fire == 12) {
      // alert(`${current.name} fire 12`)
      // actionQue()
    }
    else if (previous.fire < 18 && current.fire == 18) {
      // alert(`${current.name} fire 18`)
      // actionQue()
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
      actionQue(1, 1, createAudio(new Audio(chrome.runtime.getURL("./sounds/Freedom.mp3"))))
    }
    else if (previous.rank > 1 && current.rank == 1) {
      // alert(`${current.name} just took the top spot!!`)
      // actionQue()
    }
  }

  let createAudio = (myAudio) => {
    myAudio.onloadedmetadata = () => {
      myAudio.play();
      setTimeout(() => {
        if (actions.length == 1 && initialEvent) {
          initialEvent = false
          actions.shift()
        }
        else if (actions.length > 0) {
          actions.shift().preload
        }
      }, Math.round(myAudio.duration * 1000));
    }
    return myAudio
  }

  let actionQue = (type, code, action = null) => {
     actions.push(action)
    if (actions.length == 1) {
      initialEvent = true
      action.preload
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
