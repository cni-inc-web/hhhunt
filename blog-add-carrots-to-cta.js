function addArrowCTA() {
    ctatext1 = document.getElementById("ctabutton1").innerHTML;
    document.getElementById("ctabutton1").innerHTML = (ctatext1 + ' ' + '»');
    ctatext2 = document.getElementById("ctabutton2").innerHTML;
    document.getElementById("ctabutton2").innerHTML = (ctatext2 + ' ' + '»');
    ctatext3 = document.getElementById("ctabutton3").innerHTML;
    document.getElementById("ctabutton3").innerHTML = (ctatext3 + ' ' + '»');
}
window.onload = addArrowCTA;
