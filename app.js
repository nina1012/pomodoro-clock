// variables
const breakLength = document.getElementById('break-length');
const sessionLength = document.getElementById('session-length');

// handle the click on the buttons that change the length of break or session
document.addEventListener('click', e => {
  if (e.target.nodeName === 'BUTTON') {
    let [name, operator] = e.target.id.split('-');
    let breakNum = +breakLength.innerHTML;
    let sessionNum = +sessionLength.innerHTML;
  }
});
