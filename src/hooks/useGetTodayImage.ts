import { useEffect, useState } from 'react';
import HttpRequest from '@/config/request';
import { IdiomApi } from '@/api/index';
import defaultTopImage from '@/assets/images/defaultTop.jpg';

let todayImage = '';
const useGetTodayImage = () => {
  const [image, setImage] = useState<string | null>(todayImage);

  useEffect(() => {
    if (image) return;

    HttpRequest({
      url: IdiomApi.getTodayImage,
    })
      .then((res) => {
        todayImage = res as string;
        setImage(res as string);
      })
      .catch((err) => {
        setImage(defaultTopImage);
        console.log(err);
      });
  }, []);

  return image;
};

export default useGetTodayImage;
