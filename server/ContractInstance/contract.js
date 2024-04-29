const { ethers } = require('hardhat');

class ContractInstance{
    owner;
    manufacture;
    check1;
    check2;
    check3; 
    check4;
    Token;
    hardhatToken;

    async createAccount(){
        let [_owner, _manufacture, _check1, _check2, _check3, _check4] = await ethers.getSigners();
        this.owner = _owner;
        this.manufacture = _manufacture;
        this.check1 = _check1;
        this.check2 = _check2;
        this.check3 = _check3;
        this.check4 = _check4;
        this.Token = await ethers.getContractFactory("MyContract");
        this.hardhatToken = await this.Token.deploy();
        await this.hardhatToken.settingManufacturer(this.manufacture.address);
        await this.hardhatToken.settingCheckPoint([this.check1.address, this.check2.address, this.check3.address, this.check4.address]);
    }
    
    constructor(){
        
    }


}

let SingletonObject = new  ContractInstance();

module.exports ={SingletonObject};