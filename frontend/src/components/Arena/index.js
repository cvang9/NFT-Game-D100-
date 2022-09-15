import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS,  transformBossData } from '../../constants';
import myEpicGame from '../../utils/Epic.json';
import './Arena.css';

/*
 * We pass in our characterNFT metadata so we can show a cool card in our UI
 */
const Arena = ({ characterNFT, setCharacterNFT,currentAccount }) => {
  // State
    const [gameContract, setGameContract] = useState(null);
    const [ loadin, setLoadin] = useState(false)
  /*
 * State that will hold our boss metadata
 */
    const [boss, setBoss] = useState(null);
    // Actions
    const runAttackAction = async () => {
            
        try {

            setLoadin(true);
            if (gameContract) {
            //   setAttackState('attacking');
              console.log('Attacking boss...');
              const attackTxn = await gameContract.attackBoss();
              await attackTxn.wait();
              console.log('attackTxn:', attackTxn);
              setLoadin(false);
            //   setAttackState('hit');
            }
          } catch (error) {
            setLoadin(false);
            console.error('Error attacking boss:', error);
            // setAttackState('');
          }

    };

    const loading =() =>{

        return(
            <div class="  load-wrapp ">
            <div class="load-10 ml-36">
                <div class="bar w-full"></div>
            </div>
            </div>
        )
    }

  // UseEffects
  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      setGameContract(gameContract);
    } else {
      console.log('Ethereum object not found');
    }
  }, []);

  useEffect(() => {
    /*
     * Setup async function that will get the boss from our contract and sets in state
     */
    const fetchBoss = async () => {
      const bossTxn = await gameContract.getBoss();
      console.log('Boss:', bossTxn);
      setBoss(transformBossData(bossTxn));
    };

      /*
        * Setup logic when this event is fired off
        */
      const onAttackComplete = (from, newBossDp, newPlayerDp) => {
        const bossDp = newBossDp.toNumber();
        const playerDp = newPlayerDp.toNumber();
        const sender = from.toString();

        console.log(`AttackComplete: Boss Dp: ${bossDp} Player Dp: ${playerDp}`);

        /*
        * If player is our own, update both player and boss Hp
        */
        if (currentAccount === sender.toLowerCase()) {

          setBoss((prevState) => {
              return { ...prevState, dp: bossDp };
          });
          setCharacterNFT((prevState) => {
              return { ...prevState, dp: playerDp };
          });
        }
        /*
        * If player isn't ours, update boss Hp only
        */
        else {
          setBoss((prevState) => {
              return { ...prevState, dp: bossDp };
          });
        }
    }
  
    if (gameContract) {
      /*
       * gameContract is ready to go! Let's fetch our boss
       */
      fetchBoss();
      gameContract.on('AttackComplete', onAttackComplete);
    }

    return () => {
        if (gameContract) {
            gameContract.off('AttackComplete', onAttackComplete);
        }
    }

  }, [gameContract]);

  return (
    <div class="row">
    <div class="row">
      {/* Boss */}
      <div class="column">
      <p class=" text-white font-mono ml-40 ">BOSS</p>
      {boss && (

        <div class="  w-80 mr-14 ml-60 column  mt-5 mb-3  max-w-xs rounded-md shadow-md dark:bg-gray-900 dark:text-gray-100">
        <img src={boss.imageURI} alt="{`Boss ${boss.name}`}" class="object-cover object-center w-full rounded-t-md h-72 dark:bg-gray-500"/>
        <div class="flex flex-col justify-between p-6 space-y-8">
            <div class="space-y-2">
                {/* <div className={`boss-content ${attackState}`}/> */}
                <h2 class="text-3xl font-semibold tracking-wide">🔥 {boss.name} 🔥</h2>
                <p class="dark:text-gray-100">{`Destroy Power : ${boss.dp} / 500 `}</p>
                <p class="dark:text-gray-100">{`Destruction/sec : ${boss.dps} `}</p>
                <p class="dark:text-gray-100">"He already knew it"</p>
            </div>
           
        </div>
        </div>
       
     )}
     </div>
     <div >
     <button class=" ml-20 mr-16 mt-56 pr-5 glow-on-hover" type="button" onClick={runAttackAction}>💥 Begin Attack </button>
      { loadin && loading()}
      </div>
        
{/* <button type="button" class=" text-white mt-48 column font-thin   w-60 h-14 transition ease-in duration-200 uppercase rounded-full hover:bg-white hover:text-red-700 border-2 border-gray-900 focus:outline-none font-serif" onClick={runAttackAction}>{`💥 Begin Attack `}</button> */}


      {/* Character NFT */}
      <div class="column">
      <p class="dark:text-gray-100 font-mono ml-7">Your NFT Avatar</p>
      {characterNFT && (

        <div class=" ml-14 mt-5 w-72  max-w-xs rounded-md shadow-md dark:bg-gray-900 dark:text-gray-100">
        <img src={characterNFT.imageURI} alt="{`Character ${characterNFT.name}`}" class="object-cover object-center w-full rounded-t-md h-72 dark:bg-gray-500"/>
        <div class="flex flex-col justify-between p-6 space-y-8">
            <div class="space-y-2">
                <h2 class="text-3xl font-semibold tracking-wide"> {characterNFT.name} </h2>
                <p class="dark:text-gray-100">{`Destroy Power : ${characterNFT.dp} / ${characterNFT.maxDp} `}</p>
                <p class="dark:text-gray-100">{`Destruction/sec : ${characterNFT.dps}  `}</p>
                <p class="dark:text-gray-100">" Ezpz lemon squezzy !"</p>
            </div>
        </div>
        </div>
    )}
    </div>
    </div>
     {/* Replace your Boss UI with this */}

 
   </div>
  );
};

export default Arena;