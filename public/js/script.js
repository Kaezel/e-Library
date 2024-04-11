let addUlasansBtn = document.getElementById('addUlasansBtn');
let ulasanList = document.querySelector('.ulasanList');
let ulasanDiv = document.querySelectorAll('.ulasanDiv')[0];

addUlasansBtn.addEventListener('click', function(){
  let newUlasans = ulasanDiv.cloneNode(true);
  let input = newUlasans.getElementsByTagName('input')[0];
  input.value = '';
  ulasanList.appendChild(newUlasans);
});