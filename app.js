const imagesArea = document.querySelector('.images');
const detailsView = document.getElementById('detailsView')
const noresult = document.getElementById('noresult');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const msg = document.getElementById('msg');
const loading = document.getElementById('loading');
const showfoundResult = document.getElementById('showfoundResult');
const tags = document.getElementById('tags');
// selected image 
let sliders = [];
let tagsArray = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  detailsView.innerHTML = "";
  tags.innerHTML = "";

  const lenImg = images.hits.length;
  images.hits.map((items,index)=>{
    images.hits[index] ? tagsArray.push(images.hits[index].tags.split(",")) : "";
  })
 
  function tagsShow(index) {
    const tagsName = tagsArray[index];
    let div = document.createElement('div');
    div.style = "display:inline";
    div.innerHTML = `
       
       <button onclick=searchTags("${tagsName[0]}")   class="btn btn-outline-secondary tagsBtn m-1" type="submit">#${tagsName[0]}</button> 
      
      `
    tags.appendChild(div)



  }

  images.hits.map((item,index)=>{
    images.hits[index] ? tagsShow(index) : "";
  })
 
  console.log(tagsArray)
  showfoundResult.innerHTML = `<h3 class="bg-info bordered text-white p-2 text-left"> Total Found Result${lenImg}</h3>`
  lenImg > 0 ? imagesArea.style.display = 'block' : imagesArea.style.display = 'none';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.hits.forEach((image, index, array) => {
    console.log(image)
    window.imagearray = array;
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = `<img ondblclick=showDetails("${index}") class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div)
  })

}
function searchTags(value) {

  loading.classList.remove('d-none');
  console.log('search')
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  getImages(value)
  sliders.length = 0;
}

function showDetails(index) {
  const imgItems = imagearray[index];
  imagesArea.style = "display: none";
  detailsView.style = "display:block";
  detailsView.innerHTML = `<div onclick=returnMain() class="col-md-8 offset-md-2 card">
   <button class="btn btn-success m-3">Return</button>
   <img  class="img-fluid img-thumbnail w-75" src="${imgItems.webformatURL}" alt="${imgItems.tags}">
   <h2 class="m-3">Details</h2>
   <ul>
   <li>comments:${imgItems.comments}</li>
   <li>downloads:${imgItems.downloads}</li>
   <li>favorites:${imgItems.favorites}</li>
   <li>imageHeight:${imgItems.imageHeight}</li>
   <li>imageSize:${imgItems.imageSize}</li>
   <li>imageWidth:${imgItems.imageWidth}</li>
   <li>likes:${imgItems.likes}</li>
   <li>views:${imgItems.views}</li>
   </ul>
   </div>`
}

function returnMain() {
  detailsView.style = "display:none";
  imagesArea.style = "display:block";
}
const getImages = async (query) => {
  try {

    const res = await fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    const mealArray = res ? await res.json() : null;
    showImages(mealArray)
    setTimeout(() => {
      loading.classList.add('d-none')
    }, 1000);
  }


  catch (err) {
    console.error(err);
  }

}




let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.add('added');

  let item = sliders.indexOf(img);
  console.log(item)
  if (item === -1) {
    sliders.push(img);
    console.log(sliders)
  } else {
    element.classList.remove('added');
    sliders.shift(item);
    console.log(sliders)

  }
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  const duration = document.getElementById('duration').value || 1000;
  if (duration < 0) {
    msg.innerHTML = `<div class="alert alert-warning alert-dismissible fade show" role="alert">
     <strong>You have to user possitive number for slider deuration!! </strong>  
     <button type="button" class="close" data-dismiss="alert" aria-label="Close">
       <span aria-hidden="true">&times;</span>
     </button>
   </div>`
  } else {
    sliders.forEach(slide => {
      let item = document.createElement('div')
      item.className = "slider-item";
      item.innerHTML = `<img class="w-100"
      src="${slide}"
      alt="">`;
      sliderContainer.appendChild(item)
    })
    changeSlide(0)
    timer = setInterval(function () {
      slideIndex++;
      changeSlide(slideIndex);
    }, duration);
  }
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}


function searchFnc(id, onpress) {
  id.addEventListener(onpress, function () {
    loading.classList.remove('d-none');
    console.log('search')
    document.querySelector('.main').style.display = 'none';
    clearInterval(timer);
    const search = document.getElementById('search');
    getImages(search.value)
    sliders.length = 0;
  })
}
searchFnc(searchInput, 'keypress');
searchFnc(searchBtn, 'click');

sliderBtn.addEventListener('click', function () {
  createSlider()
})
