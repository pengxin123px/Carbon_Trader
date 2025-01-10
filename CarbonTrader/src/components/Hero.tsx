import Image from "next/image";
import heroImage from "~/assets/hero.png";

export default function Hero() {
  return (
    <div className={"grid lg:grid-cols-2 place-items-center pt-16 pb-8 md:pt-12 md:pb-24"}>
      <div className="py-6 md:order-1 hidden md:block">
        <Image
          src={heroImage}
          alt="Astronaut in the air"
          width={620}
          sizes="(max-width: 800px) 100vw, 620px"
          loading="eager"
        />
      </div>
      <div>
        <h1
          className="text-5xl lg:text-6xl xl:text-7xl font-bold lg:tracking-tight xl:tracking-tighter">
          Marketing carbon credit with us
        </h1>
        <p className="text-lg mt-4 text-slate-600 max-w-xl">
          Welcome to CarbonTrader - Your Blockchain Marketplace for Carbon Credits Trading. Experience transparent transactions, seamless cross-border deals, and the power of decentralized exchange
        </p>
      </div>
    </div>
  )
}