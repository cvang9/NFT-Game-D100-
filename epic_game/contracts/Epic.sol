// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "./libraries/Base64.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract EpicGame is ERC721 {

    struct memeAttributes{
      uint uniqueId;
      string name;
      string imageURI;
      uint dp;                        // Destroy power
      uint maxDp;                    //  max Destroy power
      uint dps;                      // Destroy per second
    }
    memeAttributes[] defaultMemes;      // Keep track of our characters

    struct Boss{
        string name;
        string imageURI;
        uint dp;
        uint dps;
    }
    Boss public boss;

    using Counters for Counters.Counter;
    Counters.Counter private tokenIds;

    // Mapping from token Id to meme struct
    mapping( uint => memeAttributes ) public memeCarryByToken;
    // Mapping from address to tokenID
    mapping( address => uint ) public nftHolders;

    event memeMinted( address sender, uint tokId, uint charInd);  // Fires on every Mint
    event AttackComplete(address sender, uint newBossHp, uint newPlayerHp);  // Fires on every Attack

    constructor(
        string[] memory memeNames,
        string[] memory memeImageURIs,
        uint[] memory memeDp,
        uint[] memory memeDps,
        string  memory bossName,
        string memory bossImgURI,
        uint bossDp,
        uint bossDps
    )ERC721("MEMERS","MEM")
    {
        boss = Boss({
            name : bossName,
            imageURI : bossImgURI,
            dp : bossDp,
            dps: bossDps
        });

      for( uint i=0; i<memeNames.length; i+=1)
      {
        defaultMemes.push( memeAttributes({
            uniqueId : i,
            name : memeNames[i],
            imageURI : memeImageURIs[i],
            dp : memeDp[i],
            dps : memeDps[i],
            maxDp : memeDp[i]
        }));
      }

      tokenIds.increment(); // Now NFT indexing starts from 1
      
    }


    function mintMeme( uint _uniqueId ) external
    {
       uint memeId = tokenIds.current();

       _safeMint(msg.sender,memeId);

       memeCarryByToken[_uniqueId] = memeAttributes({
          uniqueId : _uniqueId,
          name : defaultMemes[_uniqueId].name ,
          imageURI : defaultMemes[_uniqueId].imageURI,
          dp : defaultMemes[_uniqueId].dp,
          maxDp : defaultMemes[_uniqueId].maxDp,
          dps : defaultMemes[_uniqueId].dps
       });

       nftHolders[msg.sender] = memeId;

       tokenIds.increment();
       emit memeMinted(msg.sender, memeId, _uniqueId);
    }

    function tokenURI( uint _tokenId) public view override returns( string memory )
    {
        memeAttributes memory randomMeme = memeCarryByToken[_tokenId];

        string memory strDp = Strings.toString( randomMeme.dp );
        string memory strDps = Strings.toString( randomMeme.dps );
        string memory strMaxDp = Strings.toString( randomMeme.maxDp );

        string memory json = Base64.encode(
        abi.encodePacked(
        '{"name": "',
        randomMeme.name,
        ' -- NFT #: ',
        Strings.toString(_tokenId),
        '", "description": "This is an NFT that lets people play in the game Metaverse Slayer!", "image": "',
        randomMeme.imageURI,
        '", "attributes": [ { "trait_type": "Destroy Points", "value": ',strDp,', "max_value":',strMaxDp,'}, { "trait_type": "Destroy per second", "value": ',
        strDps,'} ]}'
        )
        );

        string memory output = string(
           abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    }

    function attackBoss( ) public
    {
        uint tokenIdOfPlayer = nftHolders[msg.sender];
        memeAttributes storage memer = memeCarryByToken[tokenIdOfPlayer];

        require( memer.dp > 0,"MEMER iS TROLLED");
        require( boss.dp > 0,"Boss iS DEstroyEd");

        if( boss.dp < memer.dps )
        {
            boss.dp = 0;
        }
        else{
            boss.dp = boss.dp - memer.dps;
        }

        if(memer.dp < boss.dps)
        {
            memer.dp = 0;
        }
        else{
            memer.dp = memer.dp - boss.dps;
        }

        emit AttackComplete(msg.sender, boss.dp, memer.dp);

    }

    function isUserMemer( ) public view returns(memeAttributes memory)
    {
        uint tokenIdOfPlayer = nftHolders[msg.sender];

        if( tokenIdOfPlayer > 0)
        {
            return memeCarryByToken[tokenIdOfPlayer];
        }
        else{
            memeAttributes memory emptyAtt;
            return emptyAtt;
        }
    }

    function getAllMemeLords() external view returns(memeAttributes[] memory)
    {
        return defaultMemes;
    }

    function getBoss() public view returns (Boss memory)
    {
     return boss;
    }


 


}

// Contract Address -> 0x7a40e71C54B25A7Cf1cd1bE290fd4f282dAFFe0C

//   Contract deployed to: 0xA5be8c4Bf4b477CE688F38f0AeE75e71062F2CCB