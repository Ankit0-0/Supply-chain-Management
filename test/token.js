import { expect } from "chai";

// describe("Token-Contract", ()=>{
    
//     //
//     //we have to make it block for everyfunction we are testing
//     it("We are testing deployment of token contract", async()=>{
//         //through ethers we can access the contract
//         //by calling the getSigners() function we are creating wallet for the owner
//         const [owner] = await ethers.getSigners();
//         console.log(owner.address)

//         //creating instance of token contract
//         const Token = await ethers.getContractFactory("Token");
//         //deploying the token contract on the network (hardhat)
//         const hardhatToken = await Token.deploy();
        
//         //we converted ownerBalance to string because it is in BigNumber format 
//         const ownerBalance = await hardhatToken.balanceOf(owner.address).toString();
//         let totalSupply = await hardhatToken.totalSupply();

//         console.log("Owner address ", owner.address);
//         console.log("Balance of owner ", ownerBalance.toString());
//         console.log("Total supply ", totalSupply.toString());
        
        
//         //checking the total supply of the token, expect function is similar to require in contracts
//         const s = expect(await hardhatToken.totalSupply().toString()).to.equal(ownerBalance);
//     })


//     it("We are testing transfer of token contract", async()=>{
//         //through ethers we can access the contract
//         const [owner, addr1] = await ethers.getSigners();

//         //creating instance of token contract
//         const Token = await ethers.getContractFactory("Token");
//         //deploying the token contract on the network (hardhat)
//         const hardhatToken = await Token.deploy();
        
//         //transfering the token from owner to addr1
//         const ownserT = await hardhatToken.transfer(addr1.address, 500);
//         let addr1Balance = await hardhatToken.balanceOf(addr1.address);
//         let ownerBalance1 = await hardhatToken.balanceOf(owner.address);
//         console.log("Balance of addr1 ", addr1Balance.toString());
//         console.log("Owner balance ", ownerBalance1.toString());
        
//         //checking the balance of addr1
//         const s = expect(addr1Balance.toString()).to.equal("500");
//         //transfering the token from addr1 to owner
//         //connecting to the addr1 wallet
//         const con = await hardhatToken.connect(addr1);
//         //transfering the token from addr1 to owner
//         const res = await hardhatToken.transfer(owner.address, 500);
//         // console.log(res);
//         let ownerBalance = await hardhatToken.balanceOf(owner.address);
//         ownerBalance = await ownerBalance.toString();
//         let addr1Balance1 = await hardhatToken.balanceOf(addr1.address);
//         addr1Balance1 = await addr1Balance1.toString();
//         console.log("owner", ownerBalance);
//         console.log("addr1", addr1Balance1);

//         expect(ownerBalance).to.equal("10000");


//     })



// })

describe("Token-Contract", ()=>{
    

    it("We are testing deployment of token contract", async()=>{
        const [owner, manufacture] = await ethers.getSigners();
        const Token = await ethers.getContractFactory("MyContract");
        const hardhatToken = await Token.deploy();

        //UpdateLogs(string memory _batchId, logs[] memory _log)
        const resp1 = await hardhatToken.settingManufacturer(manufacture.address);
        const resp2 = await hardhatToken.UpdateLogs("abc",[ {temperature: 25,humidity: 60,shock: 10,PrevCheckpoint: 0,time: 1644057600},
                                                            {temperature: 26,humidity: 61,shock: 11,PrevCheckpoint: 1,time: 1644057600},
                                                            {temperature: 27,humidity: 62,shock: 12,PrevCheckpoint: 2,time: 1644057600}
                                                    ]);

        //updateBatch(uint _currentCheckpoint, string memory _batchId, uint _temperature, uint _humidity, uint _shock)
        await hardhatToken.updateBatch(1, "abc", 27, 62, 12)

        const resp3 = await hardhatToken.UpdateLogs("xyz", [ {temperature: 225,humidity: 60,shock: 10,PrevCheckpoint: 0,time: 1644057600},
                                                            {temperature: 246,humidity: 61,shock: 11,PrevCheckpoint: 1,time: 1644057600},
                                                            {temperature: 274,humidity: 62,shock: 12,PrevCheckpoint: 2,time: 1644057600}
                                                    ]);
        await hardhatToken.updateBatch(2, "xyz", 274, 62, 12)
        const resp4 = await hardhatToken.UpdateLogs("pqr", [ {temperature: 25,humidity: 60,shock: 10,PrevCheckpoint: 0,time: 1644057600},
                                                            {temperature: 26,humidity: 61,shock: 11,PrevCheckpoint: 1,time: 1644057600},
                                                            {temperature: 27,humidity: 62,shock: 12,PrevCheckpoint: 2,time: 1644057600}
                                                    ]);
        await hardhatToken.updateBatch(3, "pqr", 27, 62, 12)
        const resp5 = await hardhatToken.getLog("abc");
        let ValidOutPut = [];

        for(let i = 0; i<resp5.length; i++){
            
            ValidOutPut.push({temperature: resp5[i].temperature.toString(), 
                humidity: resp5[i].humidity.toString(), 
                shock: resp5[i].shock.toString(), 
                PrevCheckpoint: resp5[i].PrevCheckpoint.toString(), 
                time: resp5[i].time.toString()})
        }

        console.log(ValidOutPut)

    })


})