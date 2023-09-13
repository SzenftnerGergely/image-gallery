import "./style.css";
import Swiper from "swiper/bundle";
import axios from "axios";
import { z } from "zod"
import { nanoid } from 'nanoid'
import { htmlEventLoop } from "./utils/htmlEventLoop"

const swiperWrapper = document.querySelector(".swiper-wrapper") as HTMLDivElement;
const formDOM = document.querySelector("#form") as HTMLFormElement;
const nameInputDOM = document.querySelector("#name") as HTMLInputElement;
const titleInputDOM = document.querySelector("#title") as HTMLInputElement;
const urlInputDOM = document.querySelector("#url") as HTMLInputElement;

const FormImagesData = z.object({
  name: z.string(),
  title: z.string(),
  url: z.string(),
  id: z.string(),
})

const ResultImagesData = z.array(z.object({
  name: z.string(),
  title: z.string(),
  url: z.string(),
  id: z.string(),
}))

type FormImagesData = z.infer<typeof FormImagesData>
type ResultImagesData = z.infer<typeof ResultImagesData>

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

  try {
    const response = await axios.get("http://localhost:3000/api/images");
    const result = ResultImagesData.parse(response.data)
    renderImages(result)
  } catch (error) {
    console.log(error)
  }

};

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
  try {
    await axios
    .delete(`http://localhost:3000/api/images/${id}`)
    .then((response) => {
      swiperWrapper.innerHTML = ""
      renderImages(response.data)
    });
  } catch (error) {
    console.log(error)
  }
}

formDOM.addEventListener("submit", async (e: Event) => {
  e.preventDefault()

  const uploadJSON = async (inputData: FormImagesData) => {
    try {
      await axios
        .post("http://localhost:3000/api/images", inputData)
        .then((response) => {
          swiperWrapper.innerHTML = ""
          renderImages(response.data)
        });
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







