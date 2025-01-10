import React, { useState, useEffect } from 'react';

// 假设 Icon 类型已经被定义
interface Icon {
    name: string;
    color: string;
    icon: string;
}

const icons = [
    {
        name: 'Bitcoin',
        color: '#f5921a',
        icon: 'https://leapwhale-1258830694.cos.ap-guangzhou.myqcloud.com/Bitcoin.svg.webp'
    },
    {
        name: 'OKX',
        color: '#fdfdfd',
        icon: 'https://leapwhale-1258830694.cos.ap-guangzhou.myqcloud.com/OKX_Logo.svg.png'
    },
    {
        name: 'Solana',
        color: '#000000',
        icon: 'https://leapwhale-1258830694.cos.ap-guangzhou.myqcloud.com/Solana_logo.png'
    },
    {
        name: 'Solidity',
        color: '#fff',
        icon: 'https://leapwhale-1258830694.cos.ap-guangzhou.myqcloud.com/Solidity-Logo.wine.png'
    },
    {
        name: 'Binance',
        color: '#eeb80b',
        icon: 'https://leapwhale-1258830694.cos.ap-guangzhou.myqcloud.com/binance-coin-bnb-logo-CD94CC6D31-seeklogo.com.png'
    },
    {
        name: 'Chainlink',
        color: '#fdfdfd',
        icon: 'https://leapwhale-1258830694.cos.ap-guangzhou.myqcloud.com/chainlink-link-logo.png'
    },
    {
        name: 'Ethereum',
        color: '#fdfdfd',
        icon: 'https://leapwhale-1258830694.cos.ap-guangzhou.myqcloud.com/ethereum-eth-logo.png'
    },
    {
        name: 'Optimism',
        color: '#fd0420',
        icon: 'https://leapwhale-1258830694.cos.ap-guangzhou.myqcloud.com/optimism-ethereum-op-logo.png'
    },
    {
        name: 'Tether',
        color: '#4fae94',
        icon: 'https://leapwhale-1258830694.cos.ap-guangzhou.myqcloud.com/tether-usdt-logo.png'
    },
    {
        name: 'Uniswap',
        color: '#fdfdfd',
        icon: 'https://leapwhale-1258830694.cos.ap-guangzhou.myqcloud.com/uniswap-uni-logo.png'
    }]

const LogoSlider = () => {
    const [logos, setLogos] = useState<Icon[]>([]);
    const [logos2, setLogos2] = useState<Icon[]>([]);

    useEffect(() => {
        // 首先将 icons 数组分为两部分
        const middle = Math.floor(icons.length / 2);
        setLogos(icons.slice(0, middle));
        setLogos2(icons.slice(middle));

        // 然后复制数组到自身末尾，实现无缝滚动效果
        setLogos(prevLogos => [...prevLogos, ...icons.slice(0, middle)]);
        setLogos2(prevLogos2 => [...prevLogos2, ...icons.slice(middle)]);
    }, []); // 空依赖数组意味着这个 effect 只会在组件挂载时运行一次

    return (
        <div className="container ml-24 mt-44" style={{transform: 'rotate(-40deg)'}}>
            <div className="scroller flex flex-wrap justify-center">
                {logos.map((logo, index) => (
                    <div
                        key={index}
                        style={{backgroundColor: logo.color}}
                        className="scroller-inner bg-cover bg-center flex items-center justify-center rounded-3xl"
                    >
                        <img src={logo.icon} alt={logo.name} className={"h-12 mx-2"}/>
                    </div>
                ))}
            </div>
            <div className="scroller">
                {logos2.map((logo, index) => (
                    <div
                        key={index}
                        style={{backgroundColor: logo.color}}
                        className="scroller-inner bg-cover bg-center flex items-center justify-center rounded-3xl"
                    >
                        <img src={logo.icon} alt={logo.name} className={"h-12 mx-2"}/>
                    </div>
                ))}
            </div>
            <style jsx>{`
                .scroller {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 60rem;
                    height: 6rem;
                    overflow: hidden;
                }

                .scroller-inner {
                    width: 5rem;
                    height: 5rem;
                    margin: 0.5rem;
                    flex-wrap: nowrap;
                    animation: scroll 15s linear infinite;
                }

                @keyframes scroll {
                    to {
                        transform: translateX(-30rem);
                    }
                }
            `}</style>
        </div>
    );
};

export default LogoSlider;
