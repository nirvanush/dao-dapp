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

  async function handleConnectWallet() {
    const isConnected: boolean = await ergo_check_read_access() || await ergo_request_read_access();
    if (isConnected) {
      const address = await ergo.get_change_address()

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