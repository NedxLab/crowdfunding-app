"use client";

import { Slider, SliderItem } from "@/components/slider/slider";
// import Slider from "react-slick";
import StyleWrapper from "@/components/slider/style";
import Campaigns from "@/components/campaigns";
import Home from "@/components/home";
import { Web3Button } from "@web3modal/react";
import Profile from "@/components/profile";
import { AiOutlineHome } from "react-icons/ai";
import { MdOutlineCleanHands } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

const HomeV5 = () => {
  const menuData = [
    <div className="flex flex-row items-baseline">
      <AiOutlineHome className="mx-1" /> Home
    </div>,
    <div className="flex flex-row items-baseline">
      <MdOutlineCleanHands className="mx-1" /> Campaigns
    </div>,
    <div className="flex flex-row items-baseline">
      <FaUserCircle className="mx-1" /> Profile
    </div>,
  ];

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
