
       // Creating dynamic elements classes from its categories:
       
       var catArray = document.querySelectorAll('.w-dyn-item .categ');

       catArray.forEach( function(elem) {
         var text = elem.innerText || elem.innerContent;
         if (!text) { 
              text = 'empty';
              }
         var conv = text.replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '');
         var className = conv.replace (/ /g, "-")
                             .toLowerCase()
                             .trim();
         if (!isNaN(parseInt(className.charAt(0), 10))) {
            className = ("_" + className);
         }
         elem.closest(".mix").classList.add(className);  });
  
       // Creating a custom data-order attributes from blog titles:
       var sortArray = document.querySelectorAll('.w-dyn-item .title');

       sortArray.forEach( function(sortElem) {    
         var sortText = sortElem.innerText || sortElem.innerContent;
         sortElem.closest(".mix").setAttribute('data-order', sortText);});


      // Set the reference to the container
      var containerEl = document.querySelector('.mix-container');
 
      // Call the MixitUp plugin
      mixitup(containerEl);