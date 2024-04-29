const express = require('express');
const { ethers } = require('hardhat');
const { SingletonObject } = require('./ContractInstance/contract');
const cors = require("cors");










const main = async()=>{
    try{
        await SingletonObject.createAccount();
        let hardhatToken = SingletonObject.hardhatToken;
        const app = express();
        app.use(cors({
            origin: "*"
        }))
        const port = 3000;
        app.use(express.json());
        app.listen(port, async() => {
            console.log(`Server is running on http://localhost:${port}`);
            
        });
        let count = 1;
        app.post('/g', async (req, res) => {
            console.log("ankit agya");
            const store = req.body;
            
            let logArray = [];
            let batchId;
            let currentCheckpoint;

            for(let i = 0; i<store.length; i++){  
                batchId = store[i].BatchId;
                currentCheckpoint = store[i].currentCheckpoint;
                
                logArray.push({temperature: parseInt(store[i].temperature,10), humidity: store[i].humidity, shock: store[i].shock, time: Date.now(), PrevCheckpoint: store[i].currentCheckpoint-1})
            }
            try{
                // console.log(logArray);
                await hardhatToken.UpdateLogs(batchId, logArray);
                await hardhatToken.updateBatch(currentCheckpoint, batchId, logArray[logArray.length-1].temperature, logArray[logArray.length-1].humidity, logArray[logArray.length-1].shock);
                const LogData = await hardhatToken.getLog(batchId);
                const LogDataArr = [];
                for(let i = 0; i<LogData.length; i++){
                    LogDataArr.push({temperature:parseInt(LogData[i].temperature.toString(), 10), 
                                     humidity: parseInt(LogData[i].humidity.toString(), 10),
                                     shock: parseInt(LogData[i].shock.toString(), 10), 
                                     time: parseInt(LogData[i].time.toString(),10), 
                                     PrevCheckpoint: parseInt(LogData[i].PrevCheckpoint.toString(),10)
                                    });
                }
                // console.log("LogData", LogDataArr);

                const BatchData = await hardhatToken.getBatch(currentCheckpoint);
                console.log(currentCheckpoint);
                let BatchDataArr = [];
                for(let i=0; i<BatchData.length; i++){
                    BatchDataArr.push({batchId: parseInt(BatchData[i].batchId,10), 
                                        temperature: parseInt(BatchData[i].temperature.toString(), 10), 
                                        humidity: parseInt(BatchData[i].humidity.toString(),10), shock: parseInt(BatchData[i].shock.toString(),10)
                                    });
                }

                
                
                // console.log("Batchdata ", BatchDataArr);
                res.json({success: true, message: "Successfully saved"}).status(200);
            }
             catch(e){
                console.log(e);
                res.json({success: false, message: "Unable to save"}).status(200);

             }


        });
        

        app.post("/get-log-detail", async(req, res)=>{
            console.log("get-log-detail ", req.body);
            let {batchId} = req.body;
            if(typeof batchId != "string"){
                batchId = batchId.toString();
            }
            try{
                const LogData = await hardhatToken.getLog(batchId);
                const Data = [];
                for(let i = 0; i<LogData.length; i++){
                    Data.push({temperature:parseInt(LogData[i].temperature.toString(), 10), 
                                     humidity: parseInt(LogData[i].humidity.toString(), 10),
                                     shock: parseInt(LogData[i].shock.toString(), 10), 
                                     time: new Date(parseInt(LogData[i].time.toString(),10)).toTimeString(), 
                                     PrevCheckpoint: parseInt(LogData[i].PrevCheckpoint.toString(),10)
                                    });
                }
                console.log("LogData", Data);
                res.json({success: true, Data}).status(200);
            } catch(e){
                res.json({success: false, msg: "Unable to fetch data from web"})
            }
        
        })

        app.post("/get-batch-detail", async(req, res)=>{
            try{
                const {currentCheckpoint} = req.body;
                const BatchData = await hardhatToken.getBatch(currentCheckpoint);
                let Data = [];
                for(let i=0; i<BatchData.length; i++){
                    Data.push({batchId: parseInt(BatchData[i].batchId,10), 
                                        temperature: parseInt(BatchData[i].temperature.toString(), 10), 
                                        humidity: parseInt(BatchData[i].humidity.toString(),10), shock: parseInt(BatchData[i].shock.toString(),10)
                                    });
                }

                
                
                console.log("Batchdata ", Data);
                res.json({success: true, Data}).status(200);

            } catch(e){
                res.json({success: false, msg: "Unable to fetch data from web"}).status(500);

            }
        })


    } catch(err){
        console.log("Error agye");
        console.log(err);
    }
        
}

main();



