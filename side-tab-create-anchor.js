document.addEventListener("DOMContentLoaded", () => {
    const signupSection = document.querySelector('.section-subscribe');
    
    //Check if signup section is found and return the result to the console
    if (signupSection) {
        console.log('Found signup section');

        //Create the div element
        const anchorDiv = document.createElement('div');
        anchorDiv.id = 'signup-anchor';

        //Insert the new div above the signup section
        signupSection.insertAdjacentElement('beforebegin', anchorDiv);
    } else {
        console.log('Did not find subscribe section');
    }
});
