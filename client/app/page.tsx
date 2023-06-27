"use client";

import { Slider, SliderItem } from "@/components/slider/slider";
import StyleWrapper from "@/components/slider/style";
import Campaigns from "@/components/campaigns";
import Home from "@/components/home";
import { Web3Button } from "@web3modal/react";
import Profile from "@/components/profile";

const HomeV5 = () => {
  const menuData = ["01. Home", "02. Campaigns", "03. Profile"];

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
      <StyleWrapper>
        <Slider {...settings}>
          <SliderItem>
            <Home />
          </SliderItem>
          <SliderItem>
            <Campaigns />
          </SliderItem>
          <SliderItem>
            <Profile />
          </SliderItem>
        </Slider>
      </StyleWrapper>
      <div className="fixed right-0 bottom-0 px-3 py-5">
        <Web3Button />
      </div>
    </>
  );
};

export default HomeV5;
