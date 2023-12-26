/*
 * @Author: Deshun
 * @Date: 2023-12-26 17:38:20
 * @LastEditors: Please set LastEditors
 * @Description: 获取 Bing 每日壁纸图片
 * @FilePath: /bing-wallpaper/pages/img/[size].tsx
 * Copyright (c) 2023 by contact@w3h5.com, All Rights Reserved.
 */
import { useEffect } from "react";
import { useRouter } from "next/router";
import { findKey, getBingImages } from "../../lib/api";

const sizes = {
  uhd: "UHD", // Bing 每日壁纸 UHD 超高清原图
  fhd: "1920x1080", // Bing 每日壁纸 1080P 高清
  hd: "1366x768", // Bing 每日壁纸标清
  m: "1080x1920", // Bing 每日壁纸手机版 1080P 高清
  rand: "UHD", // 随机获取 Bing 历史壁纸 UHD 超高清原图
  rand_fhd: "1920x1080", // 随机获取 Bing 历史壁纸 1080P 高清
  rand_hd: "1366x768", // 随机获取 Bing 历史壁纸普清
  rand_m: "1080x1920", // 随机获取 Bing 每日壁纸手机版 1080P 高清
};

const DynamicPage = ({ imageUrl }) => {
  const router = useRouter();
  useEffect(() => {
    // 使用 replace 方法进行重定向
    if (imageUrl) router.replace(imageUrl);
  }, [imageUrl]);

  return imageUrl ? (
    <img
      src={imageUrl}
      alt="Bing Homepage Background"
      style={{ maxWidth: "100%" }}
    />
  ) : (
    <p>Error loading image</p>
  );
};

export async function getServerSideProps({ params }) {
  try {
    const { size } = params;
    let type = "UHD";
    const key = findKey(sizes, size.toLowerCase());
    if (key) type = sizes[key];
    const isRand = key.includes("rand"); // 如果是随机(含有随机字符)
    if (isRand) {
      const ind = Math.floor(Math.random() * 15); // 随机获取 15 以内的整数
      return {
        props: { imageUrl: await getBingImages({ ind, type }) },
      };
    }
    return {
      props: { imageUrl: await getBingImages({ type }) },
    };
  } catch (error) {
    console.error("Error fetching image:", error.message);
    return {
      props: { imageUrl: null },
    };
  }
}

export default DynamicPage;
