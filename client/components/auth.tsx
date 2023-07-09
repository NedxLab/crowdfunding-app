"use client";

import { SliderItem } from "@/components/slider/slider";
import React, { useRef } from "react";
import { AuthStyle } from "./slider/style";
import Login from "./login";
import Register from "./register";
import Slider from "react-slick";

const Auth = () => {
  const menuData = ["Login", "Register"];

  // To access underlying DOM object for the slider
  const sliderRef: any = useRef();

  // Trigger next method to show the next slides
  const next = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  // Trigger previous method to show the previous slides
  const previous = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

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
        <Slider ref={(slider) => (sliderRef.current = slider)} {...settings}>
          <SliderItem>
            <Login next={next} />
          </SliderItem>
          <SliderItem>
            <Register previous={previous} />
          </SliderItem>
        </Slider>
      </AuthStyle>
    </>
  );
};

export default Auth;
