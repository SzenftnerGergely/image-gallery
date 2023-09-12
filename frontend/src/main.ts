import "./style.css";
import Swiper from "swiper/bundle";
import axios from "axios";
import { nanoid } from 'nanoid'

const swiperWrapper = document.querySelector(".swiper-wrapper") as HTMLDivElement;
const formDOM = document.querySelector("#form") as HTMLFormElement;
const nameInputDOM = document.querySelector("#name") as HTMLInputElement;
const titleInputDOM = document.querySelector("#title") as HTMLInputElement;
const urlInputDOM = document.querySelector("#url") as HTMLInputElement;

type ImagesData = {
  name: string,
  title: string,
  url: string,
  id: string,
}

const swiper = new Swiper(".mySwiper", {
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

const getData = async () => {

    const response = await axios.get("http://localhost:3000/api/images");
    const result = response.data

    renderImages(result)
};

const renderImages = (result: any) => {
  for (let i = 0; i < result.length; i++) {

    swiperWrapper.innerHTML += `
    <div class="swiper-slide" >
      <img class="images" id=${result[i].id} src="${result[i].url}" />
    </div>
  `;
  }

  const images = document.getElementsByClassName("images") as HTMLCollectionOf<HTMLButtonElement>;
  for (let i = 0; i < images.length; i++) {
    const element = images[i];
    element.addEventListener("dblclick", deleteEvent);
  }
};

const updateImages = (result: ImagesData) => {

  swiperWrapper.innerHTML += `
  <div class="swiper-slide">
    <img class="images" id=${result.id} src="${result.url}" />
  </div>
`;

  const images = document.getElementsByClassName("images") as HTMLCollectionOf<HTMLButtonElement>;
  for (let i = 0; i < images.length; i++) {
    const element = images[i];
    element.addEventListener("dblclick", deleteEvent);
  }
};

const deleteImages = (result: any) => {
  swiperWrapper.innerHTML = ""

  for (let i = 0; i < result.length; i++) {

    swiperWrapper.innerHTML += `
    <div class="swiper-slide">
      <img class="images" id=${result[i].id} src="${result[i].url}" />
    </div>
  `;
  }

  const images = document.getElementsByClassName("images") as HTMLCollectionOf<HTMLButtonElement>;
  for (let i = 0; i < images.length; i++) {
    const element = images[i];
    element.addEventListener("dblclick", deleteEvent);
  }

};

const deleteEvent =  async (e: MouseEvent) => {
  const id = ((e.target) as HTMLDivElement).id
  try {
    await axios.delete(`http://localhost:3000/api/images/${id}`)
    .then((response) => {
      console.log(response.data);
      deleteImages(response.data)
    });
  } catch (error) {
    console.log(error)
  }
}

formDOM.addEventListener("submit", async (e) => {
  e.preventDefault()

  const uploadJSON = async (imagesData: ImagesData) => {
    try {
      await axios
        .post("http://localhost:3000/api/images", inputData)
        updateImages(imagesData)
    } catch (error) {
      console.log(error);
    }
  }

  const inputData = {
    name: nameInputDOM.value,
    title: titleInputDOM.value,
    url: urlInputDOM.value,
    id: nanoid()
  };

  uploadJSON(inputData);
});

getData()







