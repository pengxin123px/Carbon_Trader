// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

error CarbonTrader__NotOwner();
error CarbonTrader__NotEnoughDeposit();
error CarbonTrader__TradeNotExist();
error CarbonTrader__TransferFailed();
error CarbonTrader__RefundFailed();
error CarbonTrader__ParamsError();
error CarbonTrader__FinalizeAuctionFailed();

contract CarbonTrader {
    event NewTrade(
        address indexed seller,
        uint256 amount,
        uint256 startTimeStamp,
        uint256 endTimeStamp,
        uint256 minimumBidAmount,
        uint256 initPriceOfUint
    );

    event Deposit(address indexed buyer, string tradeID, uint256 amount);

    event RefundDeposit(address indexed buyer, string tradeID, uint256 amount);

    event FinalizeAuctionAndTransferCarbon(
        address indexed buyer,
        string tradeID,
        uint256 allowanceAmount,
        uint256 additionalAmountToPay
    );

    event WithdrawAuctionAmount(address indexed user, uint256 amount);

    // 定义交易结构体
    struct trade {
        address seller; // 卖家地址
        uint256 sellAmount; // 卖出的碳额度
        uint256 startTimeStamp; // 拍卖开始时间
        uint256 endTimeStamp; // 拍卖结束时间
        uint256 minimumBidAmount; // 最低竞拍数量
        uint256 initPriceOfUint; // 单位起拍价格
        mapping(address => uint256) deposits; // 买家支付的保证金
        mapping(address => string) bidInfos; // 买家的竞拍信息
        mapping(address => string) bidSecrets; // 买家的竞拍秘密信息
    }

    // 定义状态变量
    mapping(address => uint256) private s_addressToAllowances; // 用户的碳额度
    mapping(address => uint256) private s_frozenAllowances; // 用户冻结的碳额度
    mapping(string => uint256) private s_deposit; // 交易ID对应的保证金
    mapping(string => trade) private s_trades; // 交易ID对应的交易信息
    mapping(address => uint256) private s_auctionAmount; // 卖家拍卖所得的金额


    // 定义不可变变量
    address private immutable i_owner; // 合约所有者地址
    IERC20 private immutable i_usdtToken; // USDT 代币合约地址

    constructor(address usdtTokenAddress) {
        i_owner = msg.sender;
        i_usdtToken = IERC20(usdtTokenAddress);
    }

    modifier onlyOwner() {
        // require(msg.sender == i_owner, "Sender is not owner!");
        if (msg.sender != i_owner) {
            revert CarbonTrader__NotOwner();
        }
        _;
    }

    function getAllownance(address user) public view returns (uint256) {
        return s_addressToAllowances[user];
    }

    //分配碳额度
    function issueAllowance(address user, uint256 allowance) public onlyOwner {
        s_addressToAllowances[user] += allowance;
    }

    //冻结用户的碳额度
    function freezeAllowance(
        address user,
        uint256 freezedAmount
    ) public onlyOwner {
        s_addressToAllowances[user] -= freezedAmount;
        s_frozenAllowances[user] += freezedAmount;
    }

    function getFrozenAllowance(address user) public view returns (uint256) {
        return s_frozenAllowances[user];
    }

    function unfreezeAllowance(
        address user,
        uint256 unfreezedAmount
    ) public onlyOwner {
        s_addressToAllowances[user] += unfreezedAmount;
        s_frozenAllowances[user] -= unfreezedAmount;
    }

    function destoryAllowance(
        address user,
        uint256 destoryAmount
    ) public onlyOwner {
        s_addressToAllowances[user] -= destoryAmount;
    }

    function destoryAllAllowance(address user) public onlyOwner {
        s_addressToAllowances[user] = 0;
        s_frozenAllowances[user] = 0;
    }

    function startTrade(
        string memory tradeID,
        uint256 amount,
        uint256 startTimeStamp,
        uint256 endTimeStamp,
        uint256 minimumBidAmount,
        uint256 initPriceOfUint
    ) public {
        if (
            amount <= 0 ||
            startTimeStamp >= endTimeStamp ||
            minimumBidAmount <= 0 ||
            initPriceOfUint <= 0 ||
            minimumBidAmount > amount
        ) revert CarbonTrader__ParamsError();
        trade storage newTrade = s_trades[tradeID];
        newTrade.seller = msg.sender;
        newTrade.sellAmount = amount;
        newTrade.startTimeStamp = startTimeStamp;
        newTrade.endTimeStamp = endTimeStamp;
        newTrade.minimumBidAmount = minimumBidAmount;
        newTrade.initPriceOfUint = initPriceOfUint;

        s_addressToAllowances[msg.sender] -= amount;
        s_frozenAllowances[msg.sender] += amount;

        emit NewTrade(
            msg.sender,
            amount,
            startTimeStamp,
            endTimeStamp,
            minimumBidAmount,
            initPriceOfUint
        );
    }

    function getTrade(
        string memory tradeID
    )
        public
        view
        returns (address, uint256, uint256, uint256, uint256, uint256)
    {
        trade storage currentTrade = s_trades[tradeID];
        return (
            currentTrade.seller,
            currentTrade.sellAmount,
            currentTrade.startTimeStamp,
            currentTrade.endTimeStamp,
            currentTrade.minimumBidAmount,
            currentTrade.initPriceOfUint
        );
    }

    //用户支付保证金参与竞拍，并提交竞拍信息。保证金以 USDT 支付
    function deposit(
        string memory tradeID,
        uint256 amount,
        string memory info
    ) public {
        trade storage currentTrade = s_trades[tradeID];
        if (currentTrade.seller == address(0))
            revert CarbonTrader__TradeNotExist();
        if (amount < currentTrade.initPriceOfUint)
            revert CarbonTrader__NotEnoughDeposit();

        bool success = i_usdtToken.transferFrom(
            msg.sender,
            address(this),
            amount
        );
        if (!success) revert CarbonTrader__TransferFailed();

        currentTrade.deposits[msg.sender] = amount;
        emit Deposit(msg.sender, tradeID, amount);

        setBidInfo(tradeID, info);
    }

    function refundDeposit(string memory tradeID) public {
        trade storage currentTrade = s_trades[tradeID];
        uint256 depositAmount = currentTrade.deposits[msg.sender];
        currentTrade.deposits[msg.sender] = 0;

        bool success = i_usdtToken.transfer(msg.sender, depositAmount);
        if (!success) {
            currentTrade.deposits[msg.sender] = depositAmount;
            revert CarbonTrader__TransferFailed();
        }
        emit RefundDeposit(msg.sender, tradeID, depositAmount);
    }

    function setBidInfo(string memory tradeID, string memory info) public {
        trade storage currentTrade = s_trades[tradeID];
        currentTrade.bidInfos[msg.sender] = info;
    }

    function setBidSecret(string memory tradeID, string memory secret) public {
        trade storage currentTrade = s_trades[tradeID];
        currentTrade.bidSecrets[msg.sender] = secret;
    }

    function getBidInfo(
        string memory tradeID
    ) public view returns (string memory) {
        trade storage currentTrade = s_trades[tradeID];
        return currentTrade.bidInfos[msg.sender];
    }

    function getBidSecret(
        string memory tradeID
    ) public view returns (string memory) {
        trade storage currentTrade = s_trades[tradeID];
        return currentTrade.bidSecrets[msg.sender];
    }

    function getTradeDeposit(
        string memory tradeID
    ) public view returns (uint256) {
        return s_trades[tradeID].deposits[msg.sender];
    }

    function getAuctionAmount() public view returns (uint256) {
        return s_auctionAmount[msg.sender];
    }

    // 完成拍卖并转移碳额度
    function finalizeAuctionAndTransferCarbon(
        string memory tradeID,
        uint256 allowanceAmount,
        uint256 additionalAmountToPay
    ) public {
        // 获取保证金
        uint256 depositAmount = s_trades[tradeID].deposits[msg.sender];
        s_trades[tradeID].deposits[msg.sender] = 0;
        // 把保证金和追加金额单独记录给卖家
        address seller = s_trades[tradeID].seller;
        s_auctionAmount[seller] += (depositAmount + additionalAmountToPay);
        // 扣除卖家的冻结碳额度
        s_frozenAllowances[seller] -= allowanceAmount;
        // 增加买家的碳额度
        s_addressToAllowances[msg.sender] += allowanceAmount;

        bool success = i_usdtToken.transferFrom(
            msg.sender,
            address(this),
            additionalAmountToPay
        );
        if (!success) revert CarbonTrader__FinalizeAuctionFailed();
    }

    function withdrawAuctionAmount() public {
        uint256 auctionAmount = s_auctionAmount[msg.sender];
        s_auctionAmount[msg.sender] = 0;
        bool success = i_usdtToken.transfer(msg.sender, auctionAmount);
        if (!success) revert CarbonTrader__RefundFailed();
        emit WithdrawAuctionAmount(msg.sender, auctionAmount);
    }
}
