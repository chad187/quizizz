$(document).ready(function() {
  // Select the target node (tweet modal)
  setTimeout(function(){
    var target = document.getElementsByClassName("report-players").item(0)
    var children = target.childNodes;
    var array = Array.from(children);
    for (item of array) { 
      console.log(item);
    }
    
    // Create an observer instance
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        // Get the Twitter modal window replies count
        console.log(mutation.target.firstChild.nodeValue)
      });
    });

    // Configuration of the observer
    var config = { 
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    };

    // Pass in the target node, as well as the observer options
    observer.observe(target, config);
  }, 10000);
});
