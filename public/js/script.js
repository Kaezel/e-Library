let addUlasansBtn = document.getElementById('addUlasansBtn');
let ulasanList = document.querySelector('.ulasanList');
let ulasanDiv = document.querySelectorAll('.ulasanDiv')[0];

addUlasansBtn.addEventListener('click', function(){
  let newUlasans = ulasanDiv.cloneNode(true);
  let input = newUlasans.getElementsByTagName('input')[0];
  input.value = '';
  ulasanList.appendChild(newUlasans);

  let ulasans = ulasanList.getElementsByTagName('div');
  if (ulasans.length > 1) {
    removeUlasansBtn.disabled = false;
  }
});

removeUlasansBtn.addEventListener('click', function(){
  let ulasans = ulasanList.getElementsByTagName('div');
  if (ulasans.length > 1) {
    ulasanList.removeChild(ulasans[ulasans.length - 1]);
  }
  
  ulasans = ulasanList.getElementsByTagName('div');
  if (ulasans.length === 1) {
    removeUlasansBtn.disabled = true;
  } else {

  }
})

document.addEventListener('DOMContentLoaded', function(){
  let ulasans = ulasanList.getElementsByTagName('div');
  if (ulasans.length === 1) {
    removeUlasansBtn.disabled = true;
  }
});
