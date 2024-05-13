import axios from "axios";

const API_KEY = "43856805-9e28da98db3e5412004cb4106";

const apiUrl = `https://pixabay.com/api/?key=${API_KEY}`;

// below includes the page number, categories..etc like that
const formateUrl = (params) => {
  let url = apiUrl + "&per_page=25&safesearch=true&editors_choice=true";
  if (!params) return url;
  let paramsKeys = Object.keys(params);
  paramsKeys.map((key) => {
    let value = key == "q" ? encodeURIComponent(params[key]) : params[key];
    url += `&${key}=${value}`;
  });

  return url;
};

export const apiCall = async (params) => {
  try {
    const res = await axios.get(formateUrl(params));

    const { data } = res;
    return { success: true, data };
  } catch (er) {
    return er;
  }
};
