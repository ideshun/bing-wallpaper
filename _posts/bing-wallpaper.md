---
title: 'Bing 每日壁纸'
excerpt: '获取 Bing 每日壁纸，支持随机获取和多张。'
coverImage: '/assets/blog/bing-wallpaper/cover.jpg'
date: '2023-12-26T18:35:07.322Z'
author:
  name: DDD
  picture: '/assets/blog/authors/jj.jpeg'
ogImage:
  url: '/assets/blog/bing-wallpaper/cover.jpg'
---

## 简介

Bing首页每日更新一张来自世界各地的精美图片。通过提供的API链接可以简单、快速地获取栩栩如生的每日壁纸，每日自动更新，作为网站背景和电脑壁纸都非常不错……

## 项目主页

您可以在浏览器中输入[https://bz.w3h5.com](https://bz.w3h5.com/)来访问本项目主页。

## 代码开源

开源，是一种互联网精神。本着取之于民用之于民的原则，本人将代码开源在Github上。链接：

[https://github.com/ideshun/bing-wallpaper](https://github.com/ideshun/bing-wallpaper)

将 Github 代码克隆一份到你自己的主机（服务器）上，绑定好域名，即可访问。

不想自己部署代码的，可以直接使用 bz.w3h5.com 提供的 API 服务。

## 使用方法

本API接口的链接，可以直接把它当做一个图片url链接来用，插入如下代码：

### 输出图片

```
<img src="https://bz.w3h5.com/img/uhd" alt="Bing 每日壁纸 UHD超清" />

<img src="https://bz.w3h5.com/img/fhd" alt="Bing 每日壁纸 1080P高清" />

<img src="https://bz.w3h5.com/img/hd" alt="Bing 每日图片 1366×768" />

<img src="https://bz.w3h5.com/img/m" alt="Bing 每日壁纸 手机超高清" />
```

### 随机输出图片

```
<img src="https://bz.w3h5.com/img/rand" alt="Bing 每日壁纸 UHD超清 随机" />

<img src="https://bz.w3h5.com/img/rand_fhd" alt="Bing 每日壁纸 1080P高清 随机" />

<img src="https://bz.w3h5.com/img/rand_hd" alt="Bing 每日图片 1366×768 随机" />

<img src="https://bz.w3h5.com/img/rand_m" alt="Bing 每日壁纸 手机超高清 随机" />
```


## 文件说明

在需要引用图片的地方插入url即可。不同参数url说明如下：

[https://bz.w3h5.com/img/uhd](https://bz.w3h5.com/img/uhd) 链接直接输出 UHD超清图片。

[https://bz.w3h5.com/img/fhd](https://bz.w3h5.com/img/fhd) 链接直接输出 1920×1080 分辨率图片。

[https://bz.w3h5.com/img/hd](https://bz.w3h5.com/img/hd) 链接直接输出 1366×768 分辨率图片。

[https://bz.w3h5.com/img/m](https://bz.w3h5.com/img/m) 链接直接输出 1080×1920 分辨率竖版图片。

[https://bz.w3h5.com/img/rand](https://bz.w3h5.com/img/rand) 链接随机输出 UHD超清图片。

[https://bz.w3h5.com/img/rand_fhd](https://bz.w3h5.com/img/rand_fhd) 链接随机输出 1920×1080 分辨率图片。

[https://bz.w3h5.com/img/rand_hd](https://bz.w3h5.com/img/rand_hd) 链接随机输出 1366×768 分辨率图片。

[https://bz.w3h5.com/img/rand_m](https://bz.w3h5.com/img/rand_m) 链接随机输出 1080×1920 分辨率竖版图片。

## 版本更新

2023年12月26日，初版1.0.0版本发布。