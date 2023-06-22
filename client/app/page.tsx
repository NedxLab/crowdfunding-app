"use client";

import { Slider, SliderItem } from "@/components/slider/slider";
import StyleWrapper from "@/components/slider/style";
import Login from "@/components/login";
import Campaigns from "@/components/campaigns";
import Register from "@/components/register";
import CreateCampaign from "@/components/createCampaign";
import Home from "@/components/home";

const HomeV5 = () => {
  const menuData = [
    "01. Home",
    "02. About",
    "03. Campaigns",
    "04. Create Campaign",
    "05. Profile",
    "06. Extras",
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
            <Login />
          </SliderItem>
          <SliderItem>
            <Campaigns />
          </SliderItem>
          <SliderItem>
            <Register />
          </SliderItem>
          <SliderItem>
            <CreateCampaign />
          </SliderItem>
          <SliderItem>
            <Register />
          </SliderItem>
        </Slider>
      </StyleWrapper>
    </>
  );
};

export default HomeV5;
