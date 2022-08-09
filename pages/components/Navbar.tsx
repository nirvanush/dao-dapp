import {
  Box,
  Flex,
  HStack,
  Button,
} from '@chakra-ui/react';

import { AddIcon, CheckIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';


export default function withAction() {
  const [userAddress, setUserAddress] = useState<string>('');
  const [votingPower, setVotingPower] = useState<number>(0);

  async function fetchBalance(address: string) {

    const balance = await fetch(`https://api.ergoplatform.com/api/v1/addresses/${address}/balance/confirmed`).then(resp => resp.json());

    return balance;
  }

  async function handleConnectWallet() {
    const isConnected: boolean = await ergo_check_read_access() || await ergo_request_read_access();
    if (isConnected) {
      const address = await ergo.get_change_address()
      const balance = await fetchBalance(address);

      const votingToken = balance.tokens.find((a: any) => a.tokenId === '0cd8c9f416e5b1ca9f986a7f10a84191dfb85941619e49e53c0dc30ebf83324b');

      if (votingToken) {
        setVotingPower(votingToken.amount / 10 ** votingToken.decimals);
      }

      setUserAddress(address);
    }
  }

  useEffect(() => {
    handleConnectWallet();
  }, [])

  return (
    <>
      <Box bg={'gray.100'} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <HStack spacing={8} alignItems={'center'}>
            <Box>SigmaValley DAO</Box>
          </HStack>
          <Flex alignItems={'center'}>
            <span style={{display: 'inline-block', paddingRight: 10}}>Voting Power: {votingPower} Comet</span>
            <Button
              variant={'solid'}
              colorScheme={'teal'}
              size={'md'}
              mr={4}
              onClick={handleConnectWallet}
              leftIcon={userAddress ? <CheckIcon/> : <AddIcon />}>
              {userAddress || 'Connect wallet'}
            </Button>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}