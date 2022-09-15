//hre- hardhat runtime environment is an object containing all the functionality that Hardhat exposes when running a task, test or script
const main = async () => {
    //This will actually compile our contract and generate the necessary files we need to work with our contract under the artifacts directory.
    const gameContractFactory = await hre.ethers.getContractFactory('EpicGame');
    // Deploying the contract
    const gameContract = await gameContractFactory.deploy(
        ["Lord Puneet", "Vimdhayak", "Tom", "Gigachad"],       // Names
        ["https://i.ytimg.com/vi/Z1K4BUtHsO4/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLA-AeRZ23DzAV8U5RfV5rDiK4Bh8A", 
        "https://imgs.search.brave.com/O-31bm9IUqLJFzmjtp89mdXHnHzKhkyRfd4cBupjFi0/rs:fit:236:236:1/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vMjM2/eC81ZC8xNi85Ny81/ZDE2OTdmNWFhNWMz/YWRjZDhiMGJhOTRk/OGY4ZDAzMC5qcGc_/bmlpPXQ", 
        "https://imgs.search.brave.com/zs_CyxzDMiny5m5JEFR4Xx2kOjZMUC21WobB7lk_euk/rs:fit:1200:720:1/g:ce/aHR0cHM6Ly9pLnl0/aW1nLmNvbS92aS9i/NUY4UlRTS1Y5US9t/YXhyZXNkZWZhdWx0/LmpwZw",
        "https://imgs.search.brave.com/0hSx4w20P5DBRY1Bez8idymX3VXOb-_CuYnZmrM1XAs/rs:fit:859:960:1/g:ce/aHR0cHM6Ly9pLmlt/Z2ZsaXAuY29tLzVr/aHYxdy5qcGc"],
        [300, 250, 100, 200],                    // Destroy Power
        [100, 50, 75, 50 ],                     // destroy Power per sec
        "Lord Bobby",
        "https://cdn.dnaindia.com/sites/default/files/styles/full/public/2022/03/04/1024326-bobby2.jpg",
        500,
        100
    );
    // wait for deployment
    await gameContract.deployed();
    console.log("Contract deployed to:", gameContract.address);

  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();

//   Contract deployed to: 0xA5be8c4Bf4b477CE688F38f0AeE75e71062F2CCB