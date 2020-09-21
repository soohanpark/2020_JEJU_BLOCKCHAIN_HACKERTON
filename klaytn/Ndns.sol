// Klaytn IDE uses solidity 0.4.24, 0.5.6 versions.
pragma solidity >=0.5.6; // <=0.5.6;

contract Ndns {
    address public owner;
    
    
    constructor () public {
        owner = msg.sender;
    }
    
    
    function setData(string memory _data) public {
        require(owner == msg.sender);  // 관리자 계정으로만 데이터 등록
    }
    
    
    function deposit() public payable {
        require(owner == msg.sender);  // 관리자 계정으로만 컨트랙트 내 잔고 송금 가능
    }


    function reward(address payable _receiver, uint _value) public payable returns (bool) {
        require(getBalance() >= _value);
        _receiver.transfer(_value);
        return true;
    }


    // Contract 내 잔액 조회
    function getBalance() private view returns (uint) {
        return address(this).balance;
    }
}