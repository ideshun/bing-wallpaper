import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import axios from "axios";

const postsDirectory = join(process.cwd(), "_posts");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  type Items = {
    [key: string]: string;
  };

  const items: Items = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === "slug") {
      items[field] = realSlug;
    }
    if (field === "content") {
      items[field] = content;
    }

    if (typeof data[field] !== "undefined") {
      items[field] = data[field];
    }
  });

  return items;
}

export function getAllPosts(fields: string[] = []) {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

/**
 * @description: 对象中是否有对应的 key
 * @param {*} obj 对象
 * @param {*} targetKey 需要查询的 key
 * @return {*}
 */
export const findKey = (obj, targetKey) => {
  const keys = Object.keys(obj);
  if (keys.includes(targetKey)) {
    return targetKey;
  }
};

/**
 * @description: 获取必应每日壁纸
 * @return {*}
 */
export async function getBingImages({
  ind = 0,
  num = 1,
  type = "UHD",
}: {
  ind?: number;
  num?: number;
  type: string;
  }) {
    /**
     * 参数说明:
     * idx?: 请求图片截止天数: 0 今天; -1 截止至明天(预准备的); 1 截止至昨天，类推（目前最多获取到16天前的图片）
     * n: 1-8 返回请求数量，目前最多一次获取8张
     * mkt?: 地区 zh-CN(中国)
     */
    const response = await axios.get(
      `https://cn.bing.com/HPImageArchive.aspx?format=js&idx=${ind}&n=${num}&mkt=zh-CN`
    );
    return `https://cn.bing.com${response.data.images[0].urlbase}_${type}.jpg`;
  }
