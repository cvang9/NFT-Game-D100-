import React, { useEffect, useState } from 'react';
import './App.css';
import SelectCharacter from './components/selectCharacter';
import myEpicGame from './utils/Epic.json';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from './constants';
import Arena from './components/Arena';

const App = () => {
    
  // State
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);

  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Make sure you have MetaMask!');
        return;
      } else {
        console.log('We have the ethereum object', ethereum);

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log('Found an authorized account:', account);
          setCurrentAccount(account);
        } else {
          console.log('No authorized account found');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };


  const renderContent = () => {

    if( !currentAccount)
    {
        return(
        <div className="connect-wallet-container">
        <img  class="my-14"
          src="https://i.pinimg.com/originals/b3/98/90/b39890cbcfa58eecbf277b80c5c13811.gif"
          alt="Monty Python Gif"
        />
        {/*
         * Button that we will use to trigger wallet connect
         * Don't forget to add the onClick event to call your method!
         */}
        <button
          class="items-center font-thin px-6 py-2  text-white transition ease-in duration-200 uppercase rounded-full hover:bg-white hover:text-gray-800 border-2 border-white focus:outline-none

          "
          onClick={connectWalletAction}
        >
          Connect Wallet 
        </button>
      </div>
        );
    }

        else if( currentAccount && !characterNFT)
        {
            return(
                <SelectCharacter setCharacterNFT={setCharacterNFT} />
            )
        }

        else if (currentAccount && characterNFT)
         {
            return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} currentAccount={currentAccount} />;
         }
    

  };

  /*
   * Implement your connectWallet method here
   */

  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }

      /*
       * Fancy method to request access to account.
       */
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      /*
       * Boom! This should print out public address once we authorize Metamask.
       */
      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    const checkNetwork = async () => {
        try { 
          if (window.ethereum.networkVersion !== '4') {
            alert("Please connect to Rinkeby!")
          }
        } catch(error) {
          console.log(error)
        }
      }
  }, []);

  useEffect(() => {
    /*
     * The function we will call that interacts with our smart contract
     */
    const fetchNFTMetadata = async () => {
      console.log('Checking for Character NFT on address:', currentAccount);
  
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );
  
      const txn = await gameContract.isUserMemer();
      if (txn.name) {
        console.log('User has character NFT');
        setCharacterNFT(transformCharacterData(txn));
      } else {
        console.log('No character NFT found');
      }
    };
  
    /*
     * We only want to run this, if we have a connected wallet
     */
    if (currentAccount) {
      console.log('CurrentAccount:', currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text text-xs font-serif">⚔️ MEME-LORDS-WAR ⚔️</p>
          <p  class="py-8 text-2xl text-amber-50 font-mono">Team up to do <b>DESTRUCTION 100</b></p>

          {renderContent()}

        </div>
        <div class=" font-mono">

          <a class= "pt-10 mt-10 text-white "
            target="_blank"
            rel="noreferrer"
          >@Shivang Was Here</a>
        </div>
      </div>
    </div>
  );
};

export default App;
