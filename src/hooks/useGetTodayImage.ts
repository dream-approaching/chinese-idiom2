import { useEffect, useState } from 'react';
import HttpRequest from '@/config/request';
import { IdiomApi } from '@/api/index';
import defaultTopImage from '@/assets/images/defaultTop.jpg';

let todayImage = '';
const useGetTodayImage = () => {
  const [image, setImage] = useState<string | null>(todayImage);
  const [imgLoading, setImgLoading] = useState(false);

  useEffect(() => {
    if (image) return;

    getImageAction({});
  }, []);

  const refreshImage = () => {
    getImageAction({ withTimeStamp: true });
  };

  const getImageAction = (data) => {
    setImgLoading(true);
    HttpRequest({
      url: IdiomApi.getTodayImage,
      data,
    })
      .then((res) => {
        todayImage = res as string;
        setImage(res as string);
        setImgLoading(false);
      })
      .catch((err) => {
        setImage(defaultTopImage);
        setImgLoading(false);
        console.log(err);
      });
  };

  return { image, refreshImage, imgLoading };
};

export default useGetTodayImage;
