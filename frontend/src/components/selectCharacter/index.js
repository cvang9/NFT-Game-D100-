import React, { useEffect, useState } from 'react';
import './selectCharacter.css';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import myEpicGame from '../../utils/Epic.json';
/*
 * Don't worry about setCharacterNFT just yet, we will talk about it soon!
 */
const SelectCharacter = ({ setCharacterNFT }) => {

    const [characters, setCharacters] = useState([]);
    const [gameContract, setGameContract] = useState(null);

    // UseEffect
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
  
      /*
       * This is the big difference. Set our gameContract in state.
       */
      setGameContract(gameContract);
    } else {
      console.log('Ethereum object not found');
    }
  }, []);

  useEffect(() => {
    const getCharacters = async () => {
      try {
        console.log('Getting contract characters to mint');
  
        /*
         * Call contract to get all mint-able characters
         */
        const charactersTxn = await gameContract.getAllMemeLords();
        console.log('charactersTxn:', charactersTxn);
  
        /*
         * Go through all of our characters and transform the data
         */
        const characters = charactersTxn.map((characterData) =>
          transformCharacterData(characterData)
        );
  
        /*
         * Set all mint-able characters in state
         */
        setCharacters(characters);
      } catch (error) {
        console.error('Something went wrong fetching characters:', error);
      }
    };

    const memeMinted = async (sender, tokenId, characterIndex) => {
        console.log(
          `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
        );
    
        /*
         * Once our character NFT is minted we can fetch the metadata from our contract
         * and set it in state to move onto the Arena
         */
        if (gameContract) {
          const characterNFT = await gameContract.isUserMemer();
          console.log('CharacterNFT: ', characterNFT);
          setCharacterNFT(transformCharacterData(characterNFT));
        }
      };

   
    /*
     * If our gameContract is ready, let's get characters!
     */
    if (gameContract) {
      getCharacters();

      gameContract.on('memeMinted', memeMinted);
          /*
     * Setup NFT Minted Listener
     */

    }

    return () => {
        /*
         * When your component unmounts, let;s make sure to clean up this listener
         */
        if (gameContract) {
          gameContract.off('memeMinted', memeMinted);
        }
      };

    }, [gameContract]);

  const renderCharacters = () =>
  characters.map((character, index) => (
    <>
        <div class="mr-96 pr-96 ml-0 mb-5 text-center"  >
        <p class="font-mono text-xl underline-offset-2 ml-7"> NFT NAME : {character.name}</p>
        <p class="font-mono text-xl underline-offset-2">DESTROY POWER  : {character.dp}</p>
        <p class="font-mono text-xl underline-offset-2 ml-20">DESTROY POWER PER SEC : {character.dps}</p>
      </div>

    <div class="" key={character.name}>
     <div class="flex">
    <img class="justify-between content-center ml-72  h-60 mb-14" src={character.imageURI} alt={character.name} />

      <button
        type="button"
        class=" font-thin px-6 py-2 mt-24 ml-20 w-60 h-14 transition ease-in duration-200 uppercase rounded-full hover:bg-white hover:text-gray-800 border-2 border-gray-900 focus:outline-none"
        onClick={()=> mintCharacterNFTAction(index) }
      >{`Mint ${character.name}`}</button>
    </div>
    </div>
    </>
  ));

  const mintCharacterNFTAction = async (characterId) => {
    try {
      if (gameContract) {
        console.log('Minting character in progress...');
        const mintTxn = await gameContract.mintMeme(characterId);
        await mintTxn.wait();
        console.log('mintTxn:', mintTxn);
      }
    } catch (error) {
      console.warn('MintCharacterAction Error:', error);
    }
  };
  
  return (
  <div class="text-white">
    <h2 class="mb-10 font-mono">Mint Your Hero. Choose wisely.</h2>
    {/* Only show this when there are characters in state */}
    {characters.length > 0 && (
      <div className="character-grid">{renderCharacters()}</div>
    )}
  </div>
     );
};

export default SelectCharacter;