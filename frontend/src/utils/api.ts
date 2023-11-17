import axios from "axios";
import { z } from "zod";

const FormImagesData = z.object({
    name: z.string(),
    title: z.string(),
    url: z.string(),
    id: z.string(),
  })

const ResultImagesData = z.array(
  z.object({
    name: z.string(),
    title: z.string(),
    url: z.string(),
    id: z.string(),
  })
);

type FormImagesData = z.infer<typeof FormImagesData>

export const getImages = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/images");
    const result = ResultImagesData.parse(response.data);
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteImage = async (id: string) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/images/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  export const postImage = async (inputData: FormImagesData) => {
    try {
    const response = await axios.post("http://localhost:3000/api/images", inputData)
        return response.data
    } catch (error) {
      console.log(error);
    }
  }
