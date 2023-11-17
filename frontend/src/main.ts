import "./style.css";
import Swiper from "swiper/bundle";
import { z } from "zod"
import { nanoid } from 'nanoid'
import { htmlEventLoop } from "./utils/htmlEventLoop"
import { deleteImage, getImages, postImage } from "./utils/api";

const swiperWrapper = document.querySelector(".swiper-wrapper") as HTMLDivElement;
const formDOM = document.querySelector("#form") as HTMLFormElement;
const nameInputDOM = document.querySelector("#name") as HTMLInputElement;
const titleInputDOM = document.querySelector("#title") as HTMLInputElement;
const urlInputDOM = document.querySelector("#url") as HTMLInputElement;

const ResultImagesData = z.array(z.object({
  name: z.string(),
  title: z.string(),
  url: z.string(),
  id: z.string(),
}))

type ResultImagesData = z.infer<typeof ResultImagesData>

new Swiper(".mySwiper", {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: "auto",
  coverflowEffect: {
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true,
  },
  pagination: {
    el: ".swiper-pagination",
  },
});

const getAndRender = async () => {
  const result = await getImages()
  if(result) {
    renderImages(result)
  }
}

const renderImages = (result: ResultImagesData) => {
  for (let i = 0; i < result.length; i++) {
    swiperWrapper.innerHTML += `
    <div class="swiper-slide" >
      <img class="images" id=${result[i].id} src="${result[i].url}" />
    </div>
  `;
  }
  htmlEventLoop("images", "dblclick", deleteEvent)
};

const deleteEvent =  async (e: Event) => {
  const id = ((e.target) as HTMLDivElement).id
  const data = await deleteImage(id)
  if(data) {
    swiperWrapper.innerHTML = ""
    renderImages(data)
  }
}

formDOM.addEventListener("submit", async (e: Event) => {
  e.preventDefault()

  const inputData = {
    name: nameInputDOM.value,
    title: titleInputDOM.value,
    url: urlInputDOM.value,
    id: nanoid()
  };

  const data = await postImage(inputData);
  if(data) {
    swiperWrapper.innerHTML = ""
    renderImages(data)
  }

});

getAndRender()







