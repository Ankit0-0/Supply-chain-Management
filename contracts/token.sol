// SPDX-License-Identifier: MIT 
pragma solidity >=0.5.0 <0.9.0;

contract MyContract {
   
   address owner;
   address manufacturer;
   address[] checkpoints;


    struct LogBatch {
        uint temperature;
        uint humidity;
        uint shock;
        uint time;
        uint PrevCheckpoint;
    }
    

    //0-> first checkpoint, 1-> second checkpoint, 2-> third checkpoint
    
   struct Batch {
        uint temperature;
        uint humidity;
        uint shock;
        string batchId; //arduino id
        uint currentCheckpoint; 
   }





    //in logs, we will store data about each truck at every hour and the checkpoint will be previous one
    mapping(string => LogBatch[]) public logs;  
    //key-> batchId, value-> LogBatch[] -> batchId->string

    //batches will store data about each truck at checkpoints ONLY
    mapping(uint => Batch[]) public batches;
    //key-> checkpoint, value-> Batch  ->currentCheckpoint->uint
    uint totalTrucks = 0;

    


   constructor(){
         owner = msg.sender;
   }

    modifier onlyOwner() {
       require(msg.sender == owner, "Only owner can call this function");
       _;
    }

    modifier onlyManufacturerOrCheckpoint() {
        require(msg.sender == manufacturer || isCheckpoint(msg.sender), "Only manufacturer or checkpoint can call this function");
        _;
    }

    function isCheckpoint(address _address) internal view returns (bool) {
        for (uint i = 0; i < checkpoints.length; i++) {
            if (checkpoints[i] == _address) {
                return true;
            }
        }
        return false;
    }

    function settingManufacturer(address _manufacturer) onlyOwner() public {
        manufacturer = _manufacturer;
        
    }

    function settingCheckPoint(address[] memory _checkpoint) onlyOwner() public onlyOwner()  {
            checkpoints = _checkpoint;
    }

    ////updateBatch function will only run at checkpoints, but it will keep on sensing the data in whole journey
    function UpdateLogs(string memory _batchId, LogBatch[] memory _log) public {
            LogBatch[] storage store = logs[_batchId];
            for(uint i = 0; i < _log.length; i++){
                store.push(_log[i]);
            }
            logs[_batchId] = store;
    }

    //updateBatch function will only run at checkpoints
    function  updateBatch(uint _currentCheckpoint, string memory _batchId, uint _temperature, uint _humidity, uint _shock) public  {
        Batch[] storage st = batches[_currentCheckpoint];
        st.push(Batch(_temperature, _humidity, _shock, _batchId, _currentCheckpoint));
        batches[_currentCheckpoint] = st; 

    }

    function manufacturer_insert_data(string memory _batchId, uint _temperature, uint _humidity, uint _shock, uint _currentCheckpoint) public {
        require(msg.sender == manufacturer, "only manufactures can set this");
        Batch[] storage st = batches[_currentCheckpoint];
        st.push(Batch(_temperature, _humidity, _shock, _batchId, _currentCheckpoint));
        batches[_currentCheckpoint] = st;
    }

    function getLog(string memory _batchId) public view returns (LogBatch[] memory) {
        return logs[_batchId];
    }

    function getBatch(uint _currentCheckpoint) public view returns (Batch[] memory) {
        return batches[_currentCheckpoint];
    }

}

   
