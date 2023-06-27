"use client";

import Image from "next/image";
import hero from "../public/hero.jpg";
import Auth from "./auth";
import { useEffect, useState } from "react";
import CampaignForm from "./campaignForm";

export default function Home() {
  const [user, setUser] = useState<string | null>();
  const [modal, setModal] = useState(false);

  if (typeof window !== "undefined") {
    const userEmail = localStorage.getItem("email");

    useEffect(() => {
      // check for changes
      window.addEventListener("storage", (event) => {
        console.log("Storage changed");

        const userEmail = localStorage.getItem("email");
        setUser(userEmail);
      });
    }, [user]);
    return (
      <>
        {" "}
        {user || userEmail ? (
          modal ? (
            <CampaignForm setModal={setModal} />
          ) : (
            <div>
              <div className="-z-50 opacity-50 w-screen h-screen min-w-[100vw] min-h-[100vh] absolute top-0">
                <Image
                  src={hero}
                  alt="logo"
                  className="-z-50 opacity-50 w-screen h-screen min-w-[100vw] min-h-[100vh] absolute top-0"
                />
              </div>
              <main className="flex  w-screen h-screen min-w-[100vw] min-h-[100vh] flex-col items-center justify-center ">
                <div className="">
                  <div className="text-[9vh] text-center col-start-1 col-end-7 mxs:text-[4vh] msm:col-end-13">
                    The WEB3 CrowdFunding App of the Decade.
                  </div>
                  <h1 className=" opacity-70 uppercase text-center py-4">
                    Raise funds for your crypto Projects.
                  </h1>
                </div>
                <button
                  onClick={() => setModal(true)}
                  className="uppercase bg-blue-600 text-white text-center rounded-md px-5 py-2.5 text-xs"
                >
                  Create Campaign
                </button>
              </main>
            </div>
          )
        ) : (
          <Auth />
        )}
      </>
    );
  } else {
    return;
  }
}
