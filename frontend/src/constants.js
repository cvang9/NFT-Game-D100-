const CONTRACT_ADDRESS = '0xA5be8c4Bf4b477CE688F38f0AeE75e71062F2CCB';
const transformCharacterData = (characterData) => {
    return {
      uniqueId: characterData.uniqueId,
      name: characterData.name,
      imageURI: characterData.imageURI,
      dp: characterData.dp.toNumber(),
      maxDp: characterData.maxDp.toNumber(),
      dps: characterData.dps.toNumber(),
    };
  };

  const transformBossData = (characterData) => {
    return {
      name: characterData.name,
      imageURI: characterData.imageURI,
      dp: characterData.dp.toNumber(),
      dps: characterData.dps.toNumber(),
    };
  };

export { CONTRACT_ADDRESS , transformCharacterData, transformBossData};