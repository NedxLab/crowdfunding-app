"use client";

import { Slider, SliderItem } from "@/components/slider/slider";
import React from "react";
import { AuthStyle } from "./slider/style";
import Login from "./login";
import Register from "./register";

const Auth = () => {
  const menuData = ["Login", "Register"];

  const settings = {
    swipe: false,
    dots: true,
    arrows: false,
    autoplay: false,
    speed: 500,
    autoplaySpeed: 500,
    centerMode: true,
    centerPadding: "0px",
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    customPaging: (i: number) => <span>{menuData[i]}</span>,
  };

  return (
    <>
      <AuthStyle>
        <Slider {...settings}>
          <SliderItem>
            <Login />
          </SliderItem>
          <SliderItem>
            <Register />
          </SliderItem>
        </Slider>
      </AuthStyle>
    </>
  );
};

export default Auth;
